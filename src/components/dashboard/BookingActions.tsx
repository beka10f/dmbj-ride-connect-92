import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BookingActionsProps {
  booking: {
    id: string;
    status: string;
    user_id: string;
  };
  isClient: boolean;
  isAdmin: boolean;
  canEdit: boolean;
  isEditing: boolean;
  onClose: () => void;
  onStatusUpdate: () => void;
  setIsEditing: (value: boolean) => void;
  onSaveChanges: () => void;
}

export const BookingActions = ({
  booking,
  isClient,
  isAdmin,
  canEdit,
  isEditing,
  onClose,
  onStatusUpdate,
  setIsEditing,
  onSaveChanges,
}: BookingActionsProps) => {
  const { toast } = useToast();

  const handleAcceptBooking = async () => {
    if (!booking) return;

    try {
      console.log("Attempting to accept booking:", booking.id);
      const { error } = await supabase
        .from("bookings")
        .update({ status: "accepted" })
        .eq("id", booking.id);

      if (error) {
        console.error("Error accepting booking:", error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Booking accepted successfully",
      });
      onStatusUpdate();
    } catch (error: any) {
      console.error("Error accepting booking:", {
        message: error.message,
        details: error.stack,
        hint: error.hint,
        code: error.code
      });
      toast({
        title: "Error",
        description: "Failed to accept booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelBooking = async () => {
    if (!booking) return;

    try {
      console.log("Attempting to cancel booking:", booking.id);
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", booking.id);

      if (error) {
        console.error("Error cancelling booking:", error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Booking cancelled successfully",
      });
      onStatusUpdate();
      onClose();
    } catch (error: any) {
      console.error("Error cancelling booking:", {
        message: error.message,
        details: error.stack,
        hint: error.hint,
        code: error.code
      });
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-end gap-3 pt-4">
      {isAdmin && booking.status === "pending" && (
        <Button onClick={handleAcceptBooking}>
          Accept Booking
        </Button>
      )}
      
      {canEdit && (
        <>
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={onSaveChanges}>
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              <Button variant="destructive" onClick={handleCancelBooking}>
                Cancel Booking
              </Button>
            </>
          )}
        </>
      )}
    </div>
  );
};