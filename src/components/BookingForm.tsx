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
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-primary mb-3">Book Your Luxury Ride</h2>
          <p className="text-gray-600 text-lg">Experience unparalleled comfort and style</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
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