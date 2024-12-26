import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { BookingFormFields } from "./booking/BookingFormFields";
import { calculateDistance } from "./booking/DistanceCalculator";
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

export const BookingForm = () => {
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
      const { distanceText, totalCost } = await calculateDistance(
        formData.pickup,
        formData.dropoff
      );

      setDistance(distanceText);
      setCost(`$${totalCost}`);
      
      // Set booking details for confirmation
      setBookingDetails({
        ...formData,
        distance: distanceText,
        cost: `$${totalCost}`,
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
    // Here we would typically make an API call to send the email
    // For now, we'll just show a success toast
    toast({
      title: "Booking Confirmed!",
      description: "A confirmation email has been sent to your inbox.",
    });
    setShowConfirmation(false);
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
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-bold text-primary">
                Confirm Your Booking
              </AlertDialogTitle>
              <AlertDialogDescription>
                <div className="space-y-4 mt-6">
                  <div className="bg-secondary/10 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Passenger Details</h3>
                    <div className="space-y-2">
                      <p><strong>Name:</strong> {bookingDetails?.name}</p>
                      <p><strong>Email:</strong> {bookingDetails?.email}</p>
                      <p><strong>Phone:</strong> {bookingDetails?.phone}</p>
                      <p><strong>Passengers:</strong> {bookingDetails?.passengers}</p>
                    </div>
                  </div>
                  
                  <div className="bg-secondary/10 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Trip Details</h3>
                    <div className="space-y-2">
                      <p><strong>Pickup:</strong> {bookingDetails?.pickup}</p>
                      <p><strong>Dropoff:</strong> {bookingDetails?.dropoff}</p>
                      <p><strong>Date & Time:</strong> {bookingDetails?.dateTime}</p>
                      <p><strong>Distance:</strong> {bookingDetails?.distance}</p>
                    </div>
                  </div>
                  
                  <div className="bg-secondary p-4 rounded-lg text-primary">
                    <p className="text-lg font-bold">Total Cost: {bookingDetails?.cost}</p>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6">
              <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmBooking}
                className="bg-secondary text-primary hover:bg-secondary/90"
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