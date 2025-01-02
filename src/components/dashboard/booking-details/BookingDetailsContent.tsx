import { CustomerInfo } from "../CustomerInfo";
import { LocationDetails } from "../LocationDetails";
import { BookingInstructions } from "../BookingInstructions";
import { BookingActions } from "../BookingActions";
import { DistanceCalculation } from "@/types/booking";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";

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
  const {
    pickup_location,
    dropoff_location,
    pickup_date,
    status,
    payment_status,
    payment_amount,
    special_instructions,
  } = booking;

  // Keep existing logic for determining payment status icon
  const getPaymentStatusIcon = (ps?: string) => {
    switch (ps) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  // Keep existing logic for determining payment status styles
  const getPaymentStatusColor = (ps?: string) => {
    switch (ps) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Conditionally show CustomerInfo */}
      {!isClient && <CustomerInfo profile={userProfile} />}

      <div className="space-y-4">
        {/* Trip Details Section */}
        <div className="grid gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Trip Details
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Distance</span>
                <span className="text-sm font-medium">
                  {tripDetails?.distanceText || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Estimated Cost</span>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">
                    {tripDetails?.totalCost ?? "0.00"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <LocationDetails
            pickup={pickup_location}
            dropoff={dropoff_location}
            onLocationClick={onLocationClick}
          />

          {/* Schedule */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Date</span>
                  <span className="text-sm font-medium">
                    {format(new Date(pickup_date), "MMMM d, yyyy")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Time</span>
                  <span className="text-sm font-medium">
                    {format(new Date(pickup_date), "h:mm a")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                  <Badge variant="outline" className="capitalize">
                    {status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Payment Details
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                <div className="flex items-center gap-2">
                  {getPaymentStatusIcon(payment_status)}
                  <Badge
                    variant="outline"
                    // Fixed the template literal syntax here
                    className={`${getPaymentStatusColor(payment_status)} 
                      px-3 py-1 rounded-full font-medium text-xs capitalize`}
                  >
                    {payment_status || "pending"}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Amount</span>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">
                    {payment_amount?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <BookingInstructions
          isEditing={isEditing}
          instructions={special_instructions || ""}
          editedInstructions={editedInstructions}
          onInstructionsChange={setEditedInstructions}
        />

        {/* Actions */}
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
    </div>
  );
};
