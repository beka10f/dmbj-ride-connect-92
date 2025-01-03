import React from "react";
import BookingFormFields from "./booking/BookingFormFields";
import { useBookingForm } from "./booking/useBookingForm";
import { BookingConfirmationDialog } from "./booking/BookingConfirmationDialog";
import { Card } from "./ui/card";

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
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-3xl font-bold text-primary">Book Your Luxury Ride</h2>
          <p className="text-gray-600">Experience unparalleled comfort and style</p>
        </div>

        <Card className="p-8 shadow-lg bg-white/50 backdrop-blur-sm border-0">
          <BookingFormFields
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            loading={loading}
            distance={distance}
            cost={cost}
            errors={errors}
          />
        </Card>

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