import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MapPin, Calendar, Clock, DollarSign, Users, User, Mail, Phone } from "lucide-react";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card } from "@/components/ui/card";

interface BookingConfirmationDialogProps {
  showConfirmation: boolean;
  setShowConfirmation: (show: boolean) => void;
  bookingDetails: {
    pickup: string;
    dropoff: string;
    dateTime: Date;
    distance: string;
    cost: string;
    name: string;
    email: string;
    phone: string;
    passengers: string;
  } | null;
  onConfirm: () => void;
}

export const BookingConfirmationDialog = ({
  showConfirmation,
  setShowConfirmation,
  bookingDetails,
  onConfirm,
}: BookingConfirmationDialogProps) => {
  const isMobile = useIsMobile();
  
  if (!bookingDetails) return null;

  return (
    <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
      <AlertDialogContent className={`max-w-[600px] w-[95vw] ${isMobile ? 'h-[90vh]' : 'max-h-[90vh]'} overflow-y-auto`}>
        <AlertDialogHeader className="space-y-2">
          <AlertDialogTitle className="text-2xl font-bold">
            Confirm Your Booking
          </AlertDialogTitle>
          <AlertDialogDescription>
            Please review your booking details before proceeding to payment.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-6 py-4">
          {/* Personal Information Card */}
          <Card className="p-4 bg-gray-50/50">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span className="text-sm text-gray-600">{bookingDetails.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm text-gray-600">{bookingDetails.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm text-gray-600">{bookingDetails.phone}</span>
              </div>
            </div>
          </Card>

          {/* Trip Details Card */}
          <Card className="p-4 bg-gray-50/50">
            <h3 className="text-lg font-semibold mb-4">Trip Details</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div className="space-y-1 flex-1">
                  <Label className="text-sm font-medium">Pickup Location</Label>
                  <p className="text-sm text-gray-600 break-words">{bookingDetails.pickup}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div className="space-y-1 flex-1">
                  <Label className="text-sm font-medium">Drop-off Location</Label>
                  <p className="text-sm text-gray-600 break-words">{bookingDetails.dropoff}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Date</Label>
                    <p className="text-sm text-gray-600">
                      {format(bookingDetails.dateTime, "MMMM d, yyyy")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Time</Label>
                    <p className="text-sm text-gray-600">
                      {format(bookingDetails.dateTime, "h:mm a")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Passengers</Label>
                  <p className="text-sm text-gray-600">{bookingDetails.passengers}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Trip Cost</Label>
                  <p className="text-sm text-gray-600">{bookingDetails.cost}</p>
                  <p className="text-xs text-gray-500">Distance: {bookingDetails.distance}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <AlertDialogFooter className={`gap-3 sm:gap-0 ${isMobile ? 'flex-col' : ''}`}>
          <AlertDialogCancel className="sm:w-auto w-full mt-2 sm:mt-0">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="sm:w-auto w-full bg-secondary text-primary hover:bg-secondary/90"
          >
            Confirm and Pay
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};