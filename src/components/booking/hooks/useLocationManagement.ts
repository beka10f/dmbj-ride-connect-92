import { useState, useCallback, useEffect } from "react";
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
    if (!locations.pickup || !locations.dropoff) return;

    setLoading(true);
    try {
      const result = await calculateDistance(locations.pickup, locations.dropoff);
      setLocations((prev) => ({
        ...prev,
        distance: result.distanceText,
        cost: result.totalCost,
      }));
    } catch (error) {
      console.error("Error calculating distance:", error);
      toast({
        title: "Error",
        description: "Unable to calculate trip details. Please check your addresses.",
        variant: "destructive",
      });
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