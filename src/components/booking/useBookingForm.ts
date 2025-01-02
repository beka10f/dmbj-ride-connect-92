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

  // Local component state
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState<string>("");
  const [cost, setCost] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Initialize form data with any existing profile information
  const [formData, setFormData] = useState<BookingFormData>({
    name: profile ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() : "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    pickup: "",
    dropoff: "",
    date: new Date(),
    time: "",
    passengers: "1",
  });

  // This holds all final booking details once the user calculates distance
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  // Submit handler: calculates distance & cost, then shows a confirmation
  const handleSubmit = async () => {
    setLoading(true);

    try {
      const { pickup, dropoff, name, email, phone, passengers, date, time } = formData;

      if (!pickup || !dropoff) {
        throw new Error("Please fill in all required fields");
      }

      // Fetch distance details
      const details: DistanceCalculation = await calculateDistance(pickup, dropoff);
      setDistance(details.distanceText || "");
      setCost(details.totalCost);

      // Combine date + time into one Date object
      const dateTime = new Date(date);
      const [hours, minutes] = time.split(":");
      dateTime.setHours(parseInt(hours), parseInt(minutes));

      // Prepare final booking info for confirmation
      setBookingDetails({
        pickup,
        dropoff,
        dateTime,
        distance: details.distanceText || "",
        cost: details.totalCost,
        name,
        email,
        phone,
        passengers,
      });

      setShowConfirmation(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Confirmation handler: invokes the Supabase function to create a checkout session
  const handleConfirmBooking = async () => {
    try {
      // Strip the "$" sign if present, so we only pass the numeric value
      const amount = cost.replace("$", "");

      // Send booking + customer details to the serverless function
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
        "create-checkout",
        {
          body: {
            amount,
            customerDetails: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
            },
            bookingDetails: {
              ...bookingDetails,
              status: "pending_payment",
              user_id: profile?.id,
            },
          },
        }
      );

      if (checkoutError) throw checkoutError;
      // Redirect the user to the checkout URL
      window.location.href = checkoutData.url;
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
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
