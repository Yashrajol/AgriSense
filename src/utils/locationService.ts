import { Location } from "@/types";

export const getCurrentLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        // Fallback to a default location (example: Iowa, USA)
        console.warn('Geolocation failed, using default location:', error);
        resolve({
          lat: 41.8780,
          lng: -93.0977,
          name: 'Default Location',
        });
      }
    );
  });
};

export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    // Try Google Maps Geocoding API first if API key is available
    const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (googleApiKey) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleApiKey}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'OK' && data.results.length > 0) {
          return data.results[0].formatted_address;
        }
      }
    }
    
    // Fallback to OpenStreetMap Nominatim (free service)
    const nominatimResponse = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
    );
    
    if (nominatimResponse.ok) {
      const data = await nominatimResponse.json();
      if (data.display_name) {
        return data.display_name;
      }
    }
    
    // Final fallback
    return `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  } catch (error) {
    console.error('Geocoding failed:', error);
    return `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  }
};

export const geocode = async (address: string): Promise<Location | null> => {
  try {
    // Try Google Maps Geocoding API first if API key is available
    const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (googleApiKey) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleApiKey}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'OK' && data.results.length > 0) {
          const result = data.results[0];
          return {
            lat: result.geometry.location.lat,
            lng: result.geometry.location.lng,
            name: result.formatted_address,
          };
        }
      }
    }
    
    // Fallback to OpenStreetMap Nominatim
    const nominatimResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
    );
    
    if (nominatimResponse.ok) {
      const data = await nominatimResponse.json();
      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          name: data[0].display_name,
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Geocoding failed:', error);
    return null;
  }
};

export const getLocationName = async (lat: number, lng: number): Promise<string> => {
  try {
    const address = await reverseGeocode(lat, lng);
    return address;
  } catch (error) {
    console.error('Failed to get location name:', error);
    return `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  }
};
