import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BookingActionsProps {
  booking: {
    id: string;
    status: string;
  };
  isClient: boolean;
  isAdmin: boolean;
  canEdit: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSaveChanges: () => void;
  onCancel: () => void;
  onAccept: () => void;
}

export const BookingActions = ({
  booking,
  isClient,
  isAdmin,
  canEdit,
  isEditing,
  onEdit,
  onCancelEdit,
  onSaveChanges,
  onCancel,
  onAccept,
}: BookingActionsProps) => {
  return (
    <div className="flex justify-end gap-3 pt-4">
      {isAdmin && booking.status === "pending" && (
        <Button onClick={onAccept}>
          Accept Booking
        </Button>
      )}
      
      {canEdit && (
        <>
          {isEditing ? (
            <>
              <Button variant="outline" onClick={onCancelEdit}>
                Cancel
              </Button>
              <Button onClick={onSaveChanges}>
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onEdit}>
                Edit
              </Button>
              <Button variant="destructive" onClick={onCancel}>
                Cancel Booking
              </Button>
            </>
          )}
        </>
      )}
    </div>
  );
};