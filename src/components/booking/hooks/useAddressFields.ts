import { useState, useCallback } from "react";

export const useAddressFields = (initialPickup = "", initialDropoff = "") => {
  const [pickup, setPickup] = useState(initialPickup);
  const [dropoff, setDropoff] = useState(initialDropoff);

  const handlePickupChange = useCallback((value: string) => {
    console.log("Updating pickup address:", value);
    setPickup(value);
  }, []);

  const handleDropoffChange = useCallback((value: string) => {
    console.log("Updating dropoff address:", value);
    setDropoff(value);
  }, []);

  return {
    pickup,
    dropoff,
    handlePickupChange,
    handleDropoffChange,
  };
};