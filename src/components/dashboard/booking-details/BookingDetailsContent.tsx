import { CustomerInfo } from "../CustomerInfo";
import { TripDetails } from "../TripDetails";
import { LocationDetails } from "../LocationDetails";
import { BookingMetadata } from "./BookingMetadata";
import { BookingInstructions } from "../BookingInstructions";
import { BookingActions } from "../BookingActions";
import { DistanceCalculation } from "@/types/booking";

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