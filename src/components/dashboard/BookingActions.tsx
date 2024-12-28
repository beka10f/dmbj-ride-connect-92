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

  const handleUpdateBookingStatus = async (newStatus: string) => {
    try {
      console.log("Attempting to update booking status:", booking.id, newStatus);
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", booking.id);

      if (error) {
        console.error("Error updating booking status:", error);
        throw error;
      }

      toast({
        title: "Success",
        description: `Booking ${newStatus} successfully`,
      });
      onStatusUpdate();
      onClose();
    } catch (error: any) {
      console.error("Error updating booking status:", {
        message: error.message,
        details: error.stack,
        hint: error.hint,
        code: error.code
      });
      toast({
        title: "Error",
        description: "Failed to update booking status. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-end gap-3 pt-4">
      {isAdmin && booking.status === "pending" && (
        <div className="flex gap-2">
          <Button 
            variant="destructive" 
            onClick={() => handleUpdateBookingStatus("declined")}
          >
            Decline
          </Button>
          <Button 
            variant="default"
            onClick={() => handleUpdateBookingStatus("accepted")}
          >
            Accept
          </Button>
        </div>
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
              <Button 
                variant="destructive" 
                onClick={() => handleUpdateBookingStatus("cancelled")}
              >
                Cancel Booking
              </Button>
            </>
          )}
        </>
      )}
    </div>
  );
};