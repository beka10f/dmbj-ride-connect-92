import React from "react";
import BookingFormFields from "./booking/BookingFormFields";
import { useBookingForm } from "./booking/useBookingForm";


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
  } = useBookingForm();

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Book a Ride</h1>

      {/* The core fields */}
      <BookingFormFields
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        loading={loading}
        distance={distance}
        cost={cost}
      />

      {/* Confirmation dialog or section (if needed) */}
      {showConfirmation && (
        <div className="bg-gray-100 p-4 mt-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Confirm Your Booking</h2>
          <p>Pickup: {bookingDetails?.pickup}</p>
          <p>Dropoff: {bookingDetails?.dropoff}</p>
          <p>Date/Time: {bookingDetails?.dateTime?.toString()}</p>
          <p>Distance: {bookingDetails?.distance}</p>
          <p>Estimated Cost: {bookingDetails?.cost}</p>

          <div className="flex gap-2 mt-2">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={handleConfirmBooking}
            >
              Confirm & Pay
            </button>
            <button
              className="px-4 py-2 bg-gray-300 text-black rounded"
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingForm;
