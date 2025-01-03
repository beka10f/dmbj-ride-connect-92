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
    <section className="py-12 bg-white">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="animate-fadeIn">
          <CardHeader className="text-center space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-primary">Book Your Ride</CardTitle>
            <p className="text-sm text-muted-foreground">Enter your trip details below</p>
          </CardHeader>
          <CardContent>
            <BookingFormFields
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              loading={loading}
              distance={distance}
              cost={cost}
              errors={errors}
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