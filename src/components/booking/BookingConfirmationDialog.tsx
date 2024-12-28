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

interface BookingDetails {
  name: string;
  email: string;
  phone: string;
  passengers: string;
  pickup: string;
  dropoff: string;
  dateTime: string;
  distance: string;
  cost: string;
}

interface BookingConfirmationDialogProps {
  showConfirmation: boolean;
  setShowConfirmation: (show: boolean) => void;
  bookingDetails: BookingDetails | null;
  onConfirm: () => void;
}

export const BookingConfirmationDialog = ({
  showConfirmation,
  setShowConfirmation,
  bookingDetails,
  onConfirm,
}: BookingConfirmationDialogProps) => {
  if (!bookingDetails) return null;

  return (
    <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
      <AlertDialogContent className="max-w-[95vw] w-full sm:max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl sm:text-2xl font-bold text-primary">
            Confirm Your Booking
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4 mt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-secondary/10 p-3 rounded-lg">
                <h3 className="font-semibold text-base sm:text-lg mb-2">
                  Passenger Details
                </h3>
                <div className="space-y-1 text-sm sm:text-base">
                  <p>
                    <span className="font-medium">Name:</span> {bookingDetails.name}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {bookingDetails.email}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {bookingDetails.phone}
                  </p>
                  <p>
                    <span className="font-medium">Passengers:</span>{" "}
                    {bookingDetails.passengers}
                  </p>
                </div>
              </div>

              <div className="bg-secondary/10 p-3 rounded-lg">
                <h3 className="font-semibold text-base sm:text-lg mb-2">
                  Trip Details
                </h3>
                <div className="space-y-1 text-sm sm:text-base">
                  <p>
                    <span className="font-medium">Pickup:</span>{" "}
                    {bookingDetails.pickup}
                  </p>
                  <p>
                    <span className="font-medium">Dropoff:</span>{" "}
                    {bookingDetails.dropoff}
                  </p>
                  <p>
                    <span className="font-medium">Date & Time:</span>{" "}
                    {bookingDetails.dateTime}
                  </p>
                  <p>
                    <span className="font-medium">Distance:</span>{" "}
                    {bookingDetails.distance}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-secondary p-3 rounded-lg text-primary mt-4">
              <p className="text-lg sm:text-xl font-bold text-center">
                Total Cost: {bookingDetails.cost}
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 gap-2">
          <AlertDialogCancel className="sm:w-auto w-full bg-gray-100 hover:bg-gray-200">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="sm:w-auto w-full bg-secondary text-primary hover:bg-secondary/90"
          >
            Confirm Booking
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};