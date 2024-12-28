import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { BookingFormFields } from "./booking/BookingFormFields";
import { calculateDistance } from "./booking/DistanceCalculator";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DistanceCalculation } from "@/types/booking";

export const BookingForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState<string>("");
  const [cost, setCost] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
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
        pickup_location: formData.pickup,
        dropoff_location: formData.dropoff,
        pickup_date: new Date(
          `${formData.date?.toISOString().split("T")[0]}T${formData.time}`
        ).toISOString(),
        special_instructions: `Name: ${formData.name}, Email: ${formData.email}, Phone: ${formData.phone}, Passengers: ${formData.passengers}`,
      });

      if (bookingError) {
        console.error("Booking error:", bookingError);
        toast({
          title: "Error",
          description: "Failed to create booking. Please try again.",
          variant: "destructive",
        });
        return;
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
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
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

        <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <AlertDialogContent className="max-w-[95vw] w-full sm:max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl sm:text-2xl font-bold text-primary">
                Confirm Your Booking
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-4 mt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-secondary/10 p-3 rounded-lg">
                    <h3 className="font-semibold text-base sm:text-lg mb-2">Passenger Details</h3>
                    <div className="space-y-1 text-sm sm:text-base">
                      <p><span className="font-medium">Name:</span> {bookingDetails?.name}</p>
                      <p><span className="font-medium">Email:</span> {bookingDetails?.email}</p>
                      <p><span className="font-medium">Phone:</span> {bookingDetails?.phone}</p>
                      <p><span className="font-medium">Passengers:</span> {bookingDetails?.passengers}</p>
                    </div>
                  </div>
                  
                  <div className="bg-secondary/10 p-3 rounded-lg">
                    <h3 className="font-semibold text-base sm:text-lg mb-2">Trip Details</h3>
                    <div className="space-y-1 text-sm sm:text-base">
                      <p><span className="font-medium">Pickup:</span> {bookingDetails?.pickup}</p>
                      <p><span className="font-medium">Dropoff:</span> {bookingDetails?.dropoff}</p>
                      <p><span className="font-medium">Date & Time:</span> {bookingDetails?.dateTime}</p>
                      <p><span className="font-medium">Distance:</span> {bookingDetails?.distance}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-secondary p-3 rounded-lg text-primary mt-4">
                  <p className="text-lg sm:text-xl font-bold text-center">
                    Total Cost: {bookingDetails?.cost}
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6 gap-2">
              <AlertDialogCancel className="sm:w-auto w-full bg-gray-100 hover:bg-gray-200">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmBooking}
                className="sm:w-auto w-full bg-secondary text-primary hover:bg-secondary/90"
              >
                Confirm Booking
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
