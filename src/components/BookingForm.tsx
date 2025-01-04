import React from "react";
import BookingFormFields from "./booking/BookingFormFields";
import { useBookingForm } from "./booking/useBookingForm";
import { BookingConfirmationDialog } from "./booking/BookingConfirmationDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <section className="py-8 sm:py-12 bg-white" id="booking">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <Card className="animate-fadeIn shadow-lg sm:shadow">
          <CardHeader className="text-center space-y-1 pb-4 sm:pb-6">
            <CardTitle className="text-xl sm:text-2xl font-semibold text-primary">Book Your Ride</CardTitle>
            <p className="text-sm text-muted-foreground">Enter your trip details below</p>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <BookingFormFields
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              loading={loading}
              distance={distance}
              cost={cost}
              errors={errors}
              showTripDetails={showConfirmation}
            />
          </CardContent>
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