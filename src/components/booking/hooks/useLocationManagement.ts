import { useState, useCallback } from "react";
import { calculateDistance } from "../DistanceCalculator";
import { useToast } from "@/hooks/use-toast";

export interface LocationState {
  pickup: string;
  dropoff: string;
  distance: string;
  cost: string;
}

const initialLocationState: LocationState = {
  pickup: "",
  dropoff: "",
  distance: "",
  cost: "",
};

export const useLocationManagement = () => {
  const { toast } = useToast();
  const [locations, setLocations] = useState<LocationState>(initialLocationState);
  const [loading, setLoading] = useState(false);

  const updateLocation = useCallback(async (type: "pickup" | "dropoff", value: string) => {
    setLocations((prev) => ({
      ...prev,
      [type]: value,
    }));

    // If both locations are set and contain commas (indicating complete addresses)
    const updatedLocations = {
      ...locations,
      [type]: value,
    };

    if (updatedLocations.pickup?.includes(',') && updatedLocations.dropoff?.includes(',')) {
      setLoading(true);
      try {
        console.log('Calculating distance for:', updatedLocations.pickup, updatedLocations.dropoff);
        const details = await calculateDistance(updatedLocations.pickup, updatedLocations.dropoff);
        console.log('Calculated details:', details);
        setLocations((prev) => ({
          ...prev,
          [type]: value,
          distance: details.distanceText,
          cost: `$${details.totalCost}`,
        }));
      } catch (error: any) {
        console.error("Error calculating trip details:", error);
        toast({
          title: "Error",
          description: "Failed to calculate trip details. Please check the addresses.",
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