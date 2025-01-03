import { useState, useCallback } from "react";
import { UserProfile } from "@/types/user";

export const usePersonalInfo = (profile: UserProfile | null) => {
  const [name, setName] = useState(
    profile ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() : ""
  );
  const [email, setEmail] = useState(profile?.email || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [passengers, setPassengers] = useState("1");

  const handleFieldChange = useCallback((field: string, value: string) => {
    switch (field) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "passengers":
        setPassengers(value);
        break;
    }
  }, []);

  return {
    name,
    email,
    phone,
    passengers,
    handleFieldChange,
  };
};