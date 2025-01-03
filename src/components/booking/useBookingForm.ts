import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useLocationManagement } from "./hooks/useLocationManagement";
import { usePersonalInfo } from "./hooks/usePersonalInfo";
import { useDateTime } from "./hooks/useDateTime";
import { useBookingValidation } from "./hooks/useBookingValidation";
import { useBookingConfirmation } from "./hooks/useBookingConfirmation";

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

  const { errors, validateForm } = useBookingValidation();
  const {
    showConfirmation,
    setShowConfirmation,
    bookingDetails,
    setBookingDetails,
    handleConfirmBooking,
  } = useBookingConfirmation(profile);

  const formData: BookingFormData = {
    name,
    email,
    phone,
    pickup: locations.pickup || "",
    dropoff: locations.dropoff || "",
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

  const handleSubmit = useCallback(async () => {
    console.log('Submitting form with data:', formData);
    
    if (!validateForm(formData)) {
      console.log('Form validation failed');
      toast({
        title: "Error",
        description: "Please fill in all required fields correctly",
        variant: "destructive",
      });
      return;
    }

    if (!locations.pickup || !locations.dropoff) {
      toast({
        title: "Error",
        description: "Please enter both pickup and dropoff locations",
        variant: "destructive",
      });
      return;
    }

    try {
      // Calculate trip details before proceeding
      const tripDetails = await calculateTripDetails();
      
      if (!tripDetails || !tripDetails.distanceText || !tripDetails.totalCost) {
        console.log('Missing distance or cost calculation');
        toast({
          title: "Error",
          description: "Unable to calculate trip distance and cost. Please check your addresses.",
          variant: "destructive",
        });
        return;
      }

      const dateTime = new Date(formData.date);
      const [hours, minutes] = formData.time.split(":");
      dateTime.setHours(parseInt(hours), parseInt(minutes));

      console.log('Setting booking details:', {
        ...formData,
        dateTime,
        distance: tripDetails.distanceText,
        cost: tripDetails.totalCost,
      });

      setBookingDetails({
        ...formData,
        dateTime,
        distance: tripDetails.distanceText,
        cost: tripDetails.totalCost,
      });

      setShowConfirmation(true);
    } catch (error) {
      console.error('Error preparing booking details:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  }, [formData, validateForm, locations, toast, setBookingDetails, setShowConfirmation, calculateTripDetails]);

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