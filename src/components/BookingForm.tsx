import { Suspense, lazy } from "react";
import { useBookingForm } from "./booking/useBookingForm";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load the form fields and confirmation dialog
const BookingFormFields = lazy(() => import("./booking/BookingFormFields").then(module => ({ default: module.BookingFormFields })));
const BookingConfirmationDialog = lazy(() => import("./booking/BookingConfirmationDialog").then(module => ({ default: module.BookingConfirmationDialog })));

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
  </div>
);

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

  const onSubmit = () => {
    handleSubmit();
  };

  return (
    <div id="booking" className="bg-white py-8 sm:py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-6 sm:mb-8 text-center">
          Book Your Ride
        </h2>
        
        <Suspense fallback={<LoadingSkeleton />}>
          <BookingFormFields
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            loading={loading}
            distance={distance}
            cost={cost}
          />
        </Suspense>

        <Suspense fallback={null}>
          <BookingConfirmationDialog
            showConfirmation={showConfirmation}
            setShowConfirmation={setShowConfirmation}
            bookingDetails={bookingDetails}
            onConfirm={handleConfirmBooking}
          />
        </Suspense>
      </div>
    </div>
  );
};