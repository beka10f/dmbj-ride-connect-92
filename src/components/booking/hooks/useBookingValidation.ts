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

    // Name validation
    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    // Email validation
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    // Phone validation
    if (!formData.phone?.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone.replace(/\s+/g, ''))) {
      newErrors.phone = "Invalid phone number";
      isValid = false;
    }

    // Location validation
    if (!formData.pickup?.trim()) {
      newErrors.pickup = "Pickup location is required";
      isValid = false;
    }

    if (!formData.dropoff?.trim()) {
      newErrors.dropoff = "Drop-off location is required";
      isValid = false;
    }

    // Date and time validation
    if (!formData.date) {
      newErrors.date = "Date is required";
      isValid = false;
    } else {
      const selectedDate = new Date(formData.date);
      const now = new Date();
      if (selectedDate < now) {
        newErrors.date = "Date must be in the future";
        isValid = false;
      }
    }

    if (!formData.time?.trim()) {
      newErrors.time = "Time is required";
      isValid = false;
    }

    // Passengers validation
    if (!formData.passengers?.trim()) {
      newErrors.passengers = "Number of passengers is required";
      isValid = false;
    } else {
      const numPassengers = parseInt(formData.passengers);
      if (isNaN(numPassengers) || numPassengers < 1 || numPassengers > 8) {
        newErrors.passengers = "Must be between 1 and 8 passengers";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, []);

  return {
    errors,
    validateForm,
  };
};