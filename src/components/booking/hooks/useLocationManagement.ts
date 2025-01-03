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

  const updateLocation = useCallback((type: "pickup" | "dropoff", value: string) => {
    setLocations((prev) => ({
      ...prev,
      [type]: value,
    }));
  }, []);

  const calculateTripDetails = useCallback(async () => {
    // Only calculate if both addresses are complete (contain commas indicating full addresses)
    if (!locations.pickup?.includes(',') || !locations.dropoff?.includes(',')) {
      return false;
    }

    setLoading(true);
    try {
      const details = await calculateDistance(locations.pickup, locations.dropoff);
      setLocations((prev) => ({
        ...prev,
        distance: details.distanceText,
        cost: `$${details.totalCost}`,
      }));
      return true;
    } catch (error: any) {
      console.error("Error calculating trip details:", error);
      toast({
        title: "Error",
        description: "Failed to calculate trip details. Please check the addresses.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [locations.pickup, locations.dropoff, toast]);

  return {
    locations,
    loading,
    updateLocation,
    calculateTripDetails,
  };
};