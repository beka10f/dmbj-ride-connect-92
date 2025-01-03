import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AddressInput from "./booking/AddressInput";
import { calculateDistance } from "./booking/DistanceCalculator";
import { useUserProfile } from "@/hooks/useUserProfile";
import { supabase } from "@/integrations/supabase/client";

interface BookingFormData {
  pickup: string;
  dropoff: string;
}

const BookingForm = () => {
  const { toast } = useToast();
  const { profile } = useUserProfile();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    pickup: "",
    dropoff: "",
  });
  const [errors, setErrors] = useState<Partial<BookingFormData>>({});
  const [distance, setDistance] = useState("");
  const [cost, setCost] = useState("");

  const validateForm = () => {
    const newErrors: Partial<BookingFormData> = {};
    let isValid = true;

    if (!formData.pickup) {
      newErrors.pickup = "Pickup location is required";
      isValid = false;
    }
    if (!formData.dropoff) {
      newErrors.dropoff = "Drop-off location is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await calculateDistance(formData.pickup, formData.dropoff);
      setDistance(result.distance);
      setCost(result.cost);

      if (profile) {
        const { error: bookingError } = await supabase.from("bookings").insert({
          user_id: profile.id,
          pickup_location: formData.pickup,
          dropoff_location: formData.dropoff,
          pickup_date: new Date().toISOString(),
        });

        if (bookingError) throw bookingError;

        toast({
          title: "Success",
          description: "Your booking has been created!",
        });
      } else {
        toast({
          title: "Sign in required",
          description: "Please sign in to create a booking",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Booking error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process booking",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Book a Ride</h1>
      
      <div className="space-y-6">
        <AddressInput
          id="pickup"
          label="Pickup Location"
          value={formData.pickup}
          onChange={(value) => setFormData({ ...formData, pickup: value })}
          placeholder="Enter pickup address"
          error={errors.pickup}
        />

        <AddressInput
          id="dropoff"
          label="Drop-off Location"
          value={formData.dropoff}
          onChange={(value) => setFormData({ ...formData, dropoff: value })}
          placeholder="Enter destination address"
          error={errors.dropoff}
        />

        {(distance || cost) && (
          <div className="flex justify-between text-sm">
            <span>Distance: {distance}</span>
            <span>Estimated Cost: {cost}</span>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-secondary text-primary hover:bg-secondary/90"
        >
          {loading ? "Processing..." : "Book Now"}
        </Button>
      </div>
    </div>
  );
};

export default BookingForm;