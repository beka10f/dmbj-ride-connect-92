import React from "react";
import BookingFormFields from "./booking/BookingFormFields";
import { useBookingForm } from "./booking/useBookingForm";
import { BookingConfirmationDialog } from "./booking/BookingConfirmationDialog";

const BookingForm = () => {
  const {
    formData,
    setFormData,
    handleSubmit,
    handleConfirmBooking,
    loading,
    distance,
    cost,
    showConfirmation,
    setShowConfirmation,
    bookingDetails,
    errors,
  } = useBookingForm();

  if (!formData) {
    return null; // Return early if formData is not yet initialized
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Book a Ride</h1>

      <BookingFormFields
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        loading={loading}
        distance={distance}
        cost={cost}
        errors={errors}
      />

      <BookingConfirmationDialog
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowConfirmation}
        bookingDetails={bookingDetails}
        onConfirm={handleConfirmBooking}
      />
    </div>
  );
};

export default BookingForm;