import { useState, useCallback } from "react";
import { BookingFormData } from "../useBookingForm";

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

export const useBookingValidation = () => {
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = useCallback((formData: BookingFormData): boolean => {
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
  }, []);

  return {
    errors,
    validateForm,
  };
};