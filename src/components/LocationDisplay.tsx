import { useEffect, useState } from "react";
import { MapPin, RefreshCw } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Location } from "@/types";
import { getCurrentLocation, reverseGeocode } from "@/utils/locationService";
import { useToast } from "@/hooks/use-toast";

const LocationDisplay = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [locationName, setLocationName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchLocation = async () => {
    setLoading(true);
    try {
      const loc = await getCurrentLocation();
      setLocation(loc);
      const name = await reverseGeocode(loc.lat, loc.lng);
      setLocationName(name);
    } catch (error) {
      toast({
        title: "Location Error",
        description: "Could not get your location. Using default location.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <Card className="p-4 bg-gradient-primary text-primary-foreground">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold">Your Location</h3>
            {location ? (
              <>
                <p className="text-sm opacity-90 truncate">{locationName}</p>
                <p className="text-xs opacity-75 mt-1">
                  {location.lat.toFixed(4)}°, {location.lng.toFixed(4)}°
                </p>
              </>
            ) : (
              <p className="text-sm opacity-90">Loading...</p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={fetchLocation}
          disabled={loading}
          className="flex-shrink-0 hover:bg-primary-foreground/20"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </Card>
  );
};

export default LocationDisplay;
