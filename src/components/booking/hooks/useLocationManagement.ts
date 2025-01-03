import { useState, useCallback } from "react";
import { calculateDistance } from "../DistanceCalculator";
import { useToast } from "@/hooks/use-toast";

export const useLocationManagement = () => {
  const [locations, setLocations] = useState({
    pickup: "",
    dropoff: "",
    distance: "",
    cost: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const updateLocation = useCallback((type: "pickup" | "dropoff", value: string) => {
    setLocations((prev) => ({
      ...prev,
      [type]: value,
    }));
  }, []);

  const calculateTripDetails = useCallback(async () => {
    if (!locations.pickup || !locations.dropoff) {
      return null;
    }

    setLoading(true);
    try {
      const result = await calculateDistance(locations.pickup, locations.dropoff);
      const updatedLocations = {
        ...locations,
        distance: result.distanceText,
        cost: result.totalCost,
      };
      setLocations(updatedLocations);
      return result;
    } catch (error) {
      console.error("Error calculating distance:", error);
      toast({
        title: "Error",
        description: "Unable to calculate trip details. Please check your addresses.",
        variant: "destructive",
      });
      return null;
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