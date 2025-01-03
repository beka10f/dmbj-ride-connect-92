import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useLocationManagement } from "./hooks/useLocationManagement";
import { usePersonalInfo } from "./hooks/usePersonalInfo";
import { useDateTime } from "./hooks/useDateTime";

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  pickup: string;
  dropoff: string;
  date: Date;
  time: string;
  passengers: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  pickup?: string;
  dropoff?: string;
  date?: string;
  time?: string;
  passengers?: string;
}

const initialFormData: BookingFormData = {
  name: "",
  email: "",
  phone: "",
  pickup: "",
  dropoff: "",
  date: new Date(),
  time: "",
  passengers: "1",
};

export const useBookingForm = () => {
  const { toast } = useToast();
  const { profile } = useUserProfile();
  const { locations, loading, updateLocation, calculateTripDetails } = useLocationManagement();
  
  const {
    name,
    email,
    phone,
    passengers,
    handleFieldChange: handlePersonalInfoChange
  } = usePersonalInfo(profile);
  
  const {
    date,
    time,
    handleDateChange,
    handleTimeChange
  } = useDateTime();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const formData: BookingFormData = {
    name,
    email,
    phone,
    pickup: locations.pickup,
    dropoff: locations.dropoff,
    date,
    time,
    passengers,
  };

  const handleFormUpdate = useCallback((field: keyof BookingFormData, value: any) => {
    switch (field) {
      case "pickup":
        updateLocation("pickup", value);
        break;
      case "dropoff":
        updateLocation("dropoff", value);
        break;
      case "date":
        handleDateChange(value);
        break;
      case "time":
        handleTimeChange(value);
        break;
      default:
        handlePersonalInfoChange(field, value);
    }
  }, [updateLocation, handleDateChange, handleTimeChange, handlePersonalInfoChange]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    }

    if (!formData.pickup.trim()) {
      newErrors.pickup = "Pickup location is required";
      isValid = false;
    }

    if (!formData.dropoff.trim()) {
      newErrors.dropoff = "Drop-off location is required";
      isValid = false;
    }

    if (!formData.time) {
      newErrors.time = "Pickup time is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [formData]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields correctly",
        variant: "destructive",
      });
      return;
    }

    const success = await calculateTripDetails();
    if (!success) return;

    const dateTime = new Date(formData.date);
    const [hours, minutes] = formData.time.split(":");
    dateTime.setHours(parseInt(hours), parseInt(minutes));

    setBookingDetails({
      ...formData,
      dateTime,
      distance: locations.distance,
      cost: locations.cost,
    });

    setShowConfirmation(true);
  }, [formData, validateForm, calculateTripDetails, locations, toast]);

  const handleConfirmBooking = useCallback(async () => {
    try {
      if (!bookingDetails) {
        throw new Error("No booking details available");
      }

      const numericCost = bookingDetails.cost.replace("$", "");

      const { data: checkoutData, error: checkoutError } =
        await supabase.functions.invoke("create-checkout", {
          body: {
            amount: numericCost,
            customerDetails: {
              name: bookingDetails.name,
              email: bookingDetails.email,
              phone: bookingDetails.phone,
            },
            bookingDetails: {
              ...bookingDetails,
              status: "pending_payment",
              user_id: profile?.id,
            },
          },
        });

      if (checkoutError) throw checkoutError;

      window.location.href = checkoutData.url;
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      toast({
        title: "Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    }
  }, [bookingDetails, profile?.id, toast]);

  return {
    formData,
    setFormData: handleFormUpdate,
    loading,
    distance: locations.distance,
    cost: locations.cost,
    showConfirmation,
    setShowConfirmation,
    bookingDetails,
    errors,
    handleSubmit,
    handleConfirmBooking,
  };
};