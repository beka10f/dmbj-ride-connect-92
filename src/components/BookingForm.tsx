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
    return <div>Loading...</div>;
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <div className="space-y-8">
          <BookingFormFields
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            loading={loading}
            distance={distance}
            cost={cost}
            errors={errors}
          />
        </div>

        <BookingConfirmationDialog
          showConfirmation={showConfirmation}
          setShowConfirmation={setShowConfirmation}
          bookingDetails={bookingDetails}
          onConfirm={handleConfirmBooking}
        />
      </div>
    </section>
  );
};

export default BookingForm;