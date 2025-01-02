import { CustomerInfo } from "../CustomerInfo";
import { TripDetails } from "../TripDetails";
import { LocationDetails } from "../LocationDetails";
import { BookingMetadata } from "./BookingMetadata";
import { BookingInstructions } from "../BookingInstructions";
import { BookingActions } from "../BookingActions";
import { DistanceCalculation } from "@/types/booking";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";

interface BookingDetailsContentProps {
  booking: {
    id: string;
    pickup_location: string;
    dropoff_location: string;
    pickup_date: string;
    status: string;
    user_id: string;
    special_instructions?: string;
    assigned_driver_id?: string;
  };
  userProfile: any;
  tripDetails: DistanceCalculation | null;
  isClient: boolean;
  isAdmin: boolean;
  canEdit: boolean;
  isEditing: boolean;
  editedInstructions: string;
  onLocationClick: (location: string) => void;
  onClose: () => void;
  onStatusUpdate: () => void;
  setIsEditing: (value: boolean) => void;
  onSaveChanges: () => void;
  setEditedInstructions: (value: string) => void;
}

export const BookingDetailsContent = ({
  booking,
  userProfile,
  tripDetails,
  isClient,
  isAdmin,
  canEdit,
  isEditing,
  editedInstructions,
  onLocationClick,
  onClose,
  onStatusUpdate,
  setIsEditing,
  onSaveChanges,
  setEditedInstructions,
}: BookingDetailsContentProps) => {
  const paymentInfo = booking.special_instructions ? (() => {
    try {
      const parsed = JSON.parse(booking.special_instructions);
      return parsed.payment_status ? {
        status: parsed.payment_status,
        amount: parsed.amount,
        date: parsed.payment_date
      } : null;
    } catch {
      return null;
    }
  })() : null;

  return (
    <div className="space-y-6 py-4">
      {!isClient && <CustomerInfo profile={userProfile} />}
      
      <div className="grid gap-4 sm:grid-cols-2">
        <TripDetails tripDetails={tripDetails} />
        <LocationDetails
          pickup={booking.pickup_location}
          dropoff={booking.dropoff_location}
          onLocationClick={onLocationClick}
        />
      </div>

      <BookingMetadata
        pickupDate={booking.pickup_date}
        status={booking.status}
      />

      {(isAdmin || paymentInfo) && (
        <div className="space-y-2 border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium">Payment Information</h3>
          </div>
          {paymentInfo ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge variant={paymentInfo.status === 'completed' ? 'secondary' : 'default'}>
                  {paymentInfo.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Amount</span>
                <span className="font-medium">${paymentInfo.amount}</span>
              </div>
              {paymentInfo.date && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Date</span>
                  <span className="text-sm">
                    {new Date(paymentInfo.date).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No payment information available</p>
          )}
        </div>
      )}

      <BookingInstructions
        isEditing={isEditing}
        instructions={booking.special_instructions || ""}
        editedInstructions={editedInstructions}
        onInstructionsChange={setEditedInstructions}
      />

      <BookingActions
        booking={booking}
        isClient={isClient}
        isAdmin={isAdmin}
        canEdit={canEdit}
        isEditing={isEditing}
        onClose={onClose}
        onStatusUpdate={onStatusUpdate}
        setIsEditing={setIsEditing}
        onSaveChanges={onSaveChanges}
      />
    </div>
  );
};