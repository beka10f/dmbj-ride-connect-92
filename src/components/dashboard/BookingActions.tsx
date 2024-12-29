import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface BookingActionsProps {
  booking: {
    id: string;
    status: string;
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

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Session error:", sessionError);
        navigate('/login');
        return;
      }
      if (!session) {
        await supabase.auth.refreshSession();
      }
    };
    checkSession();
  }, [navigate]);

  const handleUpdateBookingStatus = async (newStatus: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Session Expired",
          description: "Please sign in again to continue",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      console.log("Attempting to update booking status:", booking.id, newStatus);
      
      // Using upsert with POST method instead of update with PATCH
      const { error } = await supabase
        .from("bookings")
        .upsert([
          {
            id: booking.id,
            status: newStatus
          }
        ], { 
          onConflict: 'id',
          ignoreDuplicates: false 
        });

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