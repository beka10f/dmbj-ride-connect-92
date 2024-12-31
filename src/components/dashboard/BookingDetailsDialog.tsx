import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { calculateDistance } from "../booking/DistanceCalculator";
import { useState, useEffect } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { DistanceCalculation } from "@/types/booking";
import { BookingHeader } from "./booking-details/BookingHeader";
import { BookingDetailsContent } from "./booking-details/BookingDetailsContent";

interface BookingDetailsDialogProps {
  booking: {
    id: string;
    pickup_location: string;
    dropoff_location: string;
    pickup_date: string;
    status: string;
    user_id: string;
    special_instructions?: string;
    assigned_driver_id?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: () => void;
}

export const BookingDetailsDialog = ({
  booking,
  isOpen,
  onClose,
  onStatusUpdate,
}: BookingDetailsDialogProps) => {
  const { toast } = useToast();
  const { profile } = useUserProfile();
  const [tripDetails, setTripDetails] = useState<DistanceCalculation | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInstructions, setEditedInstructions] = useState(booking?.special_instructions || "");

  const { data: userProfile } = useQuery({
    queryKey: ["userProfile", booking?.user_id],
    queryFn: async () => {
      if (!booking?.user_id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", booking.user_id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!booking?.user_id,
  });

  useEffect(() => {
    const fetchTripDetails = async () => {
      if (booking) {
        try {
          const details = await calculateDistance(booking.pickup_location, booking.dropoff_location);
          setTripDetails(details);
        } catch (error) {
          console.error("Error calculating trip details:", error);
        }
      }
    };

    fetchTripDetails();
    setEditedInstructions(booking?.special_instructions || "");
  }, [booking]);

  const handleLocationClick = (location: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
  };

  const handleSaveChanges = async () => {
    if (!booking) return;

    try {
      const { error } = await supabase
        .from("bookings")
        .update({ special_instructions: editedInstructions })
        .eq("id", booking.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Booking updated successfully",
      });
      setIsEditing(false);
      onStatusUpdate();
    } catch (error: any) {
      console.error("Error updating booking:", error);
      toast({
        title: "Error",
        description: "Failed to update booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!booking) return null;

  const isClient = profile?.role === 'client';
  const isAdmin = profile?.role === 'admin';
  const canEdit = isClient && booking.status === 'pending';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <BookingHeader />
        <BookingDetailsContent
          booking={booking}
          userProfile={userProfile}
          tripDetails={tripDetails}
          isClient={isClient}
          isAdmin={isAdmin}
          canEdit={canEdit}
          isEditing={isEditing}
          editedInstructions={editedInstructions}
          onLocationClick={handleLocationClick}
          onClose={onClose}
          onStatusUpdate={onStatusUpdate}
          setIsEditing={setIsEditing}
          onSaveChanges={handleSaveChanges}
          setEditedInstructions={setEditedInstructions}
        />
      </DialogContent>
    </Dialog>
  );
};