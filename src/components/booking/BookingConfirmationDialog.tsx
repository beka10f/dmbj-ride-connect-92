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
      <AlertDialogContent className={`max-w-[600px] w-[95vw] ${isMobile ? 'h-[90vh]' : 'max-h-[90vh]'} overflow-y-auto bg-white/95 backdrop-blur-sm`}>
        <AlertDialogHeader className="space-y-2">
          <AlertDialogTitle className="text-3xl font-bold text-primary">
            Booking Summary
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            Please review your booking details before proceeding to payment
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-6 py-4">
          <Card className="p-6 bg-secondary/10 border-0">
            <h3 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-secondary" />
                <span className="text-gray-700">{bookingDetails.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-secondary" />
                <span className="text-gray-700">{bookingDetails.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-secondary" />
                <span className="text-gray-700">{bookingDetails.phone}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-secondary/10 border-0">
            <h3 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Trip Details
            </h3>
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Pickup Location</Label>
                  <p className="text-gray-700">{bookingDetails.pickup}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Drop-off Location</Label>
                  <p className="text-gray-700">{bookingDetails.dropoff}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-secondary" />
                    Date
                  </Label>
                  <p className="text-gray-700">
                    {format(bookingDetails.dateTime, "MMMM d, yyyy")}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-secondary" />
                    Time
                  </Label>
                  <p className="text-gray-700">
                    {format(bookingDetails.dateTime, "h:mm a")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Users className="h-4 w-4 text-secondary" />
                    Passengers
                  </Label>
                  <p className="text-gray-700">{bookingDetails.passengers}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-secondary" />
                    Trip Cost
                  </Label>
                  <p className="text-gray-700">{bookingDetails.cost}</p>
                  <p className="text-sm text-gray-500">Distance: {bookingDetails.distance}</p>
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
            className="sm:w-auto w-full bg-secondary text-primary hover:bg-secondary/90 font-semibold"
          >
            Confirm and Pay
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};