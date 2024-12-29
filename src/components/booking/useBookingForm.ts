import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { calculateDistance } from "./DistanceCalculator";
import { DistanceCalculation } from "@/types/booking";
import { useNavigate } from "react-router-dom";

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  pickup: string;
  dropoff: string;
  passengers: string;
  date: Date | undefined;
  time: string;
}

export const useBookingForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState<string>("");
  const [cost, setCost] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [formData, setFormData] = useState<BookingFormData>({
    name: "",
    email: "",
    phone: "",
    pickup: "",
    dropoff: "",
    passengers: "1",
    date: undefined,
    time: "",
  });

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.pickup ||
      !formData.dropoff ||
      !formData.date ||
      !formData.time
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const details: DistanceCalculation = await calculateDistance(
        formData.pickup,
        formData.dropoff
      );

      setDistance(details.distanceText);
      setCost(`$${details.totalCost}`);
      
      setBookingDetails({
        ...formData,
        distance: details.distanceText,
        cost: `$${details.totalCost}`,
        dateTime: `${formData.date?.toLocaleDateString()} ${formData.time}`,
      });
      
      setShowConfirmation(true);
    } catch (error) {
      console.error("Error calculating distance:", error);
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
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      const bookingData = {
        user_id: userId,
        pickup_location: formData.pickup,
        dropoff_location: formData.dropoff,
        pickup_date: new Date(
          `${formData.date?.toISOString().split("T")[0]}T${formData.time}`
        ).toISOString(),
        special_instructions: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          passengers: formData.passengers,
          distance: distance,
          cost: cost
        }),
        status: 'pending'
      };

      const { error: bookingError } = await supabase
        .from("bookings")
        .insert([bookingData]);

      if (bookingError) {
        console.error("Booking error:", bookingError);
        throw bookingError;
      }

      toast({
        title: "Booking Confirmed!",
        description: "Your booking has been created successfully. We'll contact you shortly with the details.",
      });
      
      setShowConfirmation(false);
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        pickup: "",
        dropoff: "",
        passengers: "1",
        date: undefined,
        time: "",
      });

      // If user is logged in, redirect to dashboard
      if (userId) {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error("Error creating booking:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
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