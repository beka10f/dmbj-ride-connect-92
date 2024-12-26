import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { BookingFormFields } from "./booking/BookingFormFields";
import { calculateDistance } from "./booking/DistanceCalculator";

export const BookingForm = () => {
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState<string>("");
  const [cost, setCost] = useState<string>("");
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pickup: "",
    dropoff: "",
    passengers: "1",
    date: undefined as Date | undefined,
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
      const { distanceText, totalCost } = await calculateDistance(
        formData.pickup,
        formData.dropoff
      );

      setDistance(distanceText);
      setCost(`$${totalCost}`);

      toast({
        title: "Booking Submitted",
        description: `Distance: ${distanceText} | Estimated Cost: $${totalCost}`,
      });
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

  return (
    <div id="booking" className="bg-white py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-primary mb-8 text-center">
          Book Your Ride
        </h2>
        <BookingFormFields
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          loading={loading}
          distance={distance}
          cost={cost}
        />
      </div>
    </div>
  );
};