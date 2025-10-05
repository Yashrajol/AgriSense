import { NASAData, Advisory, CropSuggestion } from "@/types";
import nasaService from "@/services/nasaApi";
import { Location } from "@/types";

export const getMockNASAData = async (location?: Location): Promise<NASAData> => {
  // Use default location if none provided
  const lat = location?.lat || 41.8780; // Iowa, USA default
  const lng = location?.lng || -93.0977;
  
  try {
    return await nasaService.getNASAData(lat, lng);
  } catch (error) {
    console.error('Failed to fetch NASA data, using fallback:', error);
    // Fallback to basic mock data
    return {
      soilMoisture: 45,
      temperature: 24,
      precipitation: 12,
      lastUpdated: new Date(),
    };
  }
};

export const getAdvisories = (data: NASAData): Advisory[] => {
  const advisories: Advisory[] = [];

  // Irrigation advisory
  if (data.soilMoisture < 50) {
    advisories.push({
      id: '1',
      type: 'irrigation',
      status: data.soilMoisture < 30 ? 'alert' : 'caution',
      title: 'Irrigation Needed',
      message: `Soil moisture is ${data.soilMoisture}%. Consider irrigating today.`,
      icon: '💧',
      action: 'Irrigate 2-3 inches',
    });
  } else {
    advisories.push({
      id: '1',
      type: 'irrigation',
      status: 'good',
      title: 'Soil Moisture Good',
      message: `Soil moisture is optimal at ${data.soilMoisture}%.`,
      icon: '✓',
    });
  }

  // Temperature advisory
  if (data.temperature > 30) {
    advisories.push({
      id: '2',
      type: 'weather',
      status: 'alert',
      title: 'High Temperature Alert',
      message: `Temperature is ${data.temperature}°C. Protect sensitive crops.`,
      icon: '🌡️',
      action: 'Provide shade',
    });
  } else {
    advisories.push({
      id: '2',
      type: 'weather',
      status: 'good',
      title: 'Temperature Optimal',
      message: `Temperature is ideal at ${data.temperature}°C.`,
      icon: '☀️',
    });
  }

  // Fertilizer advisory
  advisories.push({
    id: '3',
    type: 'fertilizer',
    status: 'caution',
    title: 'Fertilizer Check',
    message: 'Consider nitrogen-based fertilizer in 2 weeks.',
    icon: '🌱',
    action: 'Apply N-P-K 20-10-10',
  });

  return advisories;
};

export const getCropSuggestions = (): CropSuggestion[] => {
  return [
    {
      name: 'Corn',
      suitability: 95,
      season: 'Spring-Summer',
      reason: 'Optimal soil moisture and temperature conditions',
    },
    {
      name: 'Soybeans',
      suitability: 88,
      season: 'Summer',
      reason: 'Good for nitrogen fixing after corn',
    },
    {
      name: 'Wheat',
      suitability: 75,
      season: 'Fall-Winter',
      reason: 'Suitable for crop rotation',
    },
    {
      name: 'Oats',
      suitability: 70,
      season: 'Spring',
      reason: 'Tolerates current moisture levels',
    },
  ];
};
