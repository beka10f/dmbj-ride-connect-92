import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { calculateDistance } from "./DistanceCalculator";
import { DistanceCalculation } from "@/types/booking";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/useUserProfile";

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
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState<string>("");
  const [cost, setCost] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    pickup: "",
    dropoff: "",
    date: new Date(),
    time: "",
    passengers: "1",
  });

  const [bookingDetails, setBookingDetails] = useState<any>(null);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (!formData.pickup || !formData.dropoff) {
        throw new Error("Please fill in all required fields");
      }

      const details: DistanceCalculation = await calculateDistance(
        formData.pickup,
        formData.dropoff
      );

      setDistance(details.distanceText || "");
      setCost(details.totalCost);

      const dateTime = new Date(formData.date);
      const [hours, minutes] = formData.time.split(":");
      dateTime.setHours(parseInt(hours), parseInt(minutes));

      setBookingDetails({
        pickup: formData.pickup,
        dropoff: formData.dropoff,
        dateTime,
        distance: details.distanceText || "",
        cost: details.totalCost,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        passengers: formData.passengers,
      });

      setShowConfirmation(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      console.error("Booking error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    try {
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
        'create-checkout',
        {
          body: {
            amount: cost.replace('$', ''),
            customerDetails: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
            },
            bookingDetails: {
              ...bookingDetails,
              status: 'pending_payment',
              user_id: profile?.id,
            },
          },
        }
      );

      if (checkoutError) throw checkoutError;

      window.location.href = checkoutData.url;
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    formData,
    setFormData,
    loading,
    distance,
    cost,
    showConfirmation,
    setShowConfirmation,
    bookingDetails,
    handleSubmit,
    handleConfirmBooking,
  };
};