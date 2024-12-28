import { useBookingForm } from "./booking/useBookingForm";
import { BookingFormFields } from "./booking/BookingFormFields";
import { BookingConfirmationDialog } from "./booking/BookingConfirmationDialog";
import { useToast } from "@/hooks/use-toast";

export const BookingForm = () => {
  const {
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
  } = useBookingForm();

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

        <BookingConfirmationDialog
          showConfirmation={showConfirmation}
          setShowConfirmation={setShowConfirmation}
          bookingDetails={bookingDetails}
          onConfirm={handleConfirmBooking}
        />
      </div>
    </div>
  );
};