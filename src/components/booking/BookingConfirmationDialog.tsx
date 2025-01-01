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
import { MapPin, Calendar, Clock, DollarSign } from "lucide-react";
import { format } from "date-fns";

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
  };
  onConfirm: () => void;
}

export const BookingConfirmationDialog = ({
  showConfirmation,
  setShowConfirmation,
  bookingDetails,
  onConfirm,
}: BookingConfirmationDialogProps) => {
  return (
    <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
      <AlertDialogContent className="max-w-[500px] w-[95vw]">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Your Booking</AlertDialogTitle>
          <AlertDialogDescription>
            Please review your booking details before proceeding to payment.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="space-y-1">
                <Label className="text-sm font-medium">Pickup Location</Label>
                <p className="text-sm text-gray-500">{bookingDetails.pickup}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="space-y-1">
                <Label className="text-sm font-medium">Drop-off Location</Label>
                <p className="text-sm text-gray-500">{bookingDetails.dropoff}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="space-y-1">
                <Label className="text-sm font-medium">Date</Label>
                <p className="text-sm text-gray-500">
                  {format(bookingDetails.dateTime, "MMMM d, yyyy")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="space-y-1">
                <Label className="text-sm font-medium">Time</Label>
                <p className="text-sm text-gray-500">
                  {format(bookingDetails.dateTime, "h:mm a")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="space-y-1">
                <Label className="text-sm font-medium">Estimated Cost</Label>
                <p className="text-sm text-gray-500">{bookingDetails.cost}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={bookingDetails.name}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={bookingDetails.email}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={bookingDetails.phone}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>
        </div>

        <AlertDialogFooter className="gap-3 sm:gap-0">
          <AlertDialogCancel className="sm:w-auto w-full">
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