import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";

interface BookingActionsProps {
  booking: {
    id: string;
    status: string;
    user_id: string;
    assigned_driver_id?: string;
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
  const navigate = useNavigate();
  const { profile } = useUserProfile();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.error("Session error:", sessionError);
        navigate('/login');
        return;
      }
    };
    checkSession();
  }, [navigate]);

  const handleUpdateBookingStatus = async (newStatus: string) => {
    try {
      if (!profile) {
        toast({
          title: "Error",
          description: "You must be logged in to perform this action",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      console.log("Attempting to update booking status:", booking.id, newStatus);

      // Use upsert instead of update to avoid CORS issues with PATCH
      const { error: updateError } = await supabase
        .from("bookings")
        .upsert({
          id: booking.id,
          status: newStatus
        }, {
          onConflict: 'id'
        });

      if (updateError) {
        console.error("Error updating booking status:", updateError);
        throw updateError;
      }

      toast({
        title: "Success",
        description: `Booking ${newStatus} successfully`,
      });
      onStatusUpdate();
      onClose();
    } catch (error: any) {
      console.error("Failed to update booking status:", error);
      toast({
        title: "Error",
        description: "Failed to update booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isEditing) {
    return (
      <div className="flex justify-end space-x-2 mt-4">
        <Button variant="outline" onClick={() => setIsEditing(false)}>
          Cancel
        </Button>
        <Button onClick={onSaveChanges}>
          Save Changes
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-end space-x-2 mt-4">
      {canEdit && (
        <Button variant="outline" onClick={() => setIsEditing(true)}>
          Edit Instructions
        </Button>
      )}
      {isAdmin && booking.status === 'pending' && (
        <>
          <Button 
            variant="outline" 
            onClick={() => handleUpdateBookingStatus('declined')}
            className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
          >
            Decline
          </Button>
          <Button 
            onClick={() => handleUpdateBookingStatus('accepted')}
            className="bg-green-600 hover:bg-green-700"
          >
            Accept
          </Button>
        </>
      )}
      <Button variant="outline" onClick={onClose}>
        Close
      </Button>
    </div>
  );
};