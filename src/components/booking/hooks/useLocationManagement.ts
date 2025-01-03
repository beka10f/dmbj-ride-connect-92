import { useState, useCallback } from "react";
import { calculateDistance } from "../DistanceCalculator";
import { useToast } from "@/hooks/use-toast";

interface LocationState {
  pickup: string;
  dropoff: string;
  distance: string;
  cost: string;
}

export const useLocationManagement = () => {
  const { toast } = useToast();
  const [locations, setLocations] = useState<LocationState>({
    pickup: "",
    dropoff: "",
    distance: "",
    cost: "",
  });
  const [loading, setLoading] = useState(false);

  const updateLocation = useCallback(async (type: "pickup" | "dropoff", value: string) => {
    setLocations((prev) => ({ ...prev, [type]: value }));

    const updatedLocations = {
      ...locations,
      [type]: value,
    };

    if (updatedLocations.pickup && updatedLocations.dropoff) {
      setLoading(true);
      try {
        const result = await calculateDistance(
          updatedLocations.pickup,
          updatedLocations.dropoff
        );
        
        setLocations((prev) => ({
          ...prev,
          [type]: value,
          distance: result.distanceText,
          cost: result.totalCost,
        }));
      } catch (error) {
        console.error("Error calculating distance:", error);
        toast({
          title: "Error",
          description: "Failed to calculate trip distance. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  }, [locations, toast]);

  return {
    locations,
    loading,
    updateLocation,
  };
};