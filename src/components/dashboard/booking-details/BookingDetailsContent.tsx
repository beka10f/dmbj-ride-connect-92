import { CustomerInfo } from "../CustomerInfo";
import { TripDetails } from "../TripDetails";
import { LocationDetails } from "../LocationDetails";
import { BookingMetadata } from "./BookingMetadata";
import { BookingInstructions } from "../BookingInstructions";
import { BookingActions } from "../BookingActions";
import { DistanceCalculation } from "@/types/booking";
import { Badge } from "@/components/ui/badge";
import { DollarSign, CheckCircle, Clock, XCircle } from "lucide-react";

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
    payment_status?: string;
    payment_amount?: number;
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
  const getPaymentStatusIcon = (status?: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Details</h3>
        <div className="flex flex-col gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
            <div className="flex items-center gap-2">
              {getPaymentStatusIcon(booking.payment_status)}
              <Badge 
                variant="outline" 
                className={`${getPaymentStatusColor(booking.payment_status)} px-3 py-1 rounded-full font-medium text-xs capitalize`}
              >
                {booking.payment_status || 'pending'}
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Amount</span>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">
                {booking.payment_amount?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>
        </div>
      </div>

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