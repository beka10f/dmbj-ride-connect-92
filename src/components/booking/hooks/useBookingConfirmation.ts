import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserProfile } from "@/types/user";

export const useBookingConfirmation = (profile: UserProfile | null) => {
  const { toast } = useToast();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const handleConfirmBooking = useCallback(async () => {
    try {
      if (!bookingDetails) {
        throw new Error("No booking details available");
      }

      const numericCost = parseFloat(bookingDetails.cost.replace(/[^0-9.]/g, ""));

      console.log('Creating checkout session with details:', {
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
              ...bookingDetails,
              status: "pending_payment",
              user_id: profile?.id,
            },
          },
        }
      );

      if (checkoutError) {
        console.error('Checkout error:', checkoutError);
        throw checkoutError;
      }

      if (!checkoutData?.url) {
        throw new Error('No checkout URL received');
      }

      console.log('Redirecting to checkout:', checkoutData.url);
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
    showConfirmation,
    setShowConfirmation,
    bookingDetails,
    setBookingDetails,
    handleConfirmBooking,
  };
};