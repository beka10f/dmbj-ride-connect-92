import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import { calculateDistance } from "../booking/DistanceCalculator";

export interface QuickBookingFormData {
  pickup: string;
  dropoff: string;
  date: Date;
  time: string;
}

export const useQuickBooking = (onSuccess?: () => void) => {
  const { profile } = useUserProfile();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [formData, setFormData] = useState<QuickBookingFormData>({
    pickup: "",
    dropoff: "",
    date: new Date(),
    time: "",
  });

  const handleSubmit = async () => {
    if (!profile) return;
    
    if (!formData.pickup || !formData.dropoff || !formData.date || !formData.time) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const details = await calculateDistance(formData.pickup, formData.dropoff);
      
      setBookingDetails({
        ...formData,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User',
        email: profile.email || 'Not provided',
        phone: 'Not provided',
        distance: details.distanceText,
        cost: `$${details.totalCost}`,
        dateTime: `${formData.date.toLocaleDateString()} ${formData.time}`,
      });
      
      setShowConfirmation(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to calculate ride. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    try {
      const { error: bookingError } = await supabase.from("bookings").insert({
        user_id: profile?.id,
        pickup_location: formData.pickup,
        dropoff_location: formData.dropoff,
        pickup_date: new Date(
          `${formData.date.toISOString().split("T")[0]}T${formData.time}`
        ).toISOString(),
      });

      if (bookingError) throw bookingError;

      toast({
        title: "Booking Confirmed!",
        description: "Your booking has been created successfully.",
      });
      
      setShowConfirmation(false);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    formData,
    setFormData,
    loading,
    showConfirmation,
    setShowConfirmation,
    bookingDetails,
    handleSubmit,
    handleConfirmBooking,
  };
};