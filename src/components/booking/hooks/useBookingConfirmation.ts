import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/user";

export const useBookingConfirmation = (profile: UserProfile | null) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const { toast } = useToast();

  const handleConfirmBooking = async () => {
    try {
      if (!bookingDetails) {
        throw new Error("No booking details available");
      }

      if (!profile?.id) {
        throw new Error("User must be logged in to book");
      }

      // Extract numeric value from cost string (e.g., "$50.00" -> 50.00)
      const costString = bookingDetails.cost.replace(/[^0-9.]/g, "");
      const numericCost = parseFloat(costString);

      if (isNaN(numericCost)) {
        console.error('Invalid cost amount:', bookingDetails.cost);
        throw new Error("Invalid cost amount");
      }

      console.log('Creating checkout session with details:', {
        amount: numericCost,
        customerDetails: {
          name: bookingDetails.name,
          email: bookingDetails.email,
          phone: bookingDetails.phone,
        },
        bookingDetails: {
          pickup: bookingDetails.pickup,
          dropoff: bookingDetails.dropoff,
          dateTime: bookingDetails.dateTime,
          user_id: profile.id,
          special_instructions: `Booking for ${bookingDetails.name} - ${bookingDetails.phone}`,
        },
      });

      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
        "create-checkout",
        {
          body: {
            amount: numericCost,
            customerDetails: {
              name: bookingDetails.name,
              email: bookingDetails.email,
              phone: bookingDetails.phone,
            },
            bookingDetails: {
              pickup: bookingDetails.pickup,
              dropoff: bookingDetails.dropoff,
              dateTime: bookingDetails.dateTime,
              user_id: profile.id,
              special_instructions: `Booking for ${bookingDetails.name} - ${bookingDetails.phone}`,
            },
          },
        }
      );

      if (checkoutError) {
        console.error('Checkout error:', checkoutError);
        throw checkoutError;
      }

      if (!checkoutData?.url) {
        console.error('No checkout URL received:', checkoutData);
        throw new Error('No checkout URL received');
      }

      // Redirect to Stripe Checkout
      window.location.href = checkoutData.url;
    } catch (error: any) {
      console.error('Booking confirmation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    showConfirmation,
    setShowConfirmation,
    bookingDetails,
    setBookingDetails,
    handleConfirmBooking,
  };
};