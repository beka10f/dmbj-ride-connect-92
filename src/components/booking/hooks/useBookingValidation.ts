import { useState, useCallback } from "react";
import { BookingFormData } from "../useBookingForm";

export const useBookingValidation = () => {
  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});

  const validateForm = useCallback((formData: BookingFormData) => {
    const newErrors: Partial<Record<keyof BookingFormData, string>> = {};
    let isValid = true;

    // Personal info validation
    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = "Phone is required";
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

    // Date validation
    if (!formData.date) {
      newErrors.date = "Date is required";
      isValid = false;
    } else {
      const selectedDate = new Date(formData.date);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < now) {
        newErrors.date = "Date must be in the future";
        isValid = false;
      }
    }

    // Time validation
    if (!formData.time?.trim()) {
      newErrors.time = "Time is required";
      isValid = false;
    }

    // Passengers validation
    if (!formData.passengers?.trim()) {
      newErrors.passengers = "Number of passengers is required";
      isValid = false;
    } else {
      const passengersNum = parseInt(formData.passengers);
      if (isNaN(passengersNum) || passengersNum < 1) {
        newErrors.passengers = "Invalid number of passengers";
        isValid = false;
      }
    }

    console.log('Form validation result:', { isValid, errors: newErrors });
    console.log('Form data being validated:', formData);
    
    setErrors(newErrors);
    return isValid;
  }, []);

  return {
    errors,
    validateForm,
  };
};