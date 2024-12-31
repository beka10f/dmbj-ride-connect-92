import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Info, Clock } from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { calculateDistance } from "../booking/DistanceCalculator";
import { useState, useEffect } from "react";
import { CustomerInfo } from "./CustomerInfo";
import { TripDetails } from "./TripDetails";
import { LocationDetails } from "./LocationDetails";
import { useUserProfile } from "@/hooks/useUserProfile";
import { DistanceCalculation } from "@/types/booking";
import { BookingActions } from "./BookingActions";
import { BookingInstructions } from "./BookingInstructions";

interface BookingDetailsDialogProps {
  booking: {
    id: string;
    pickup_location: string;
    dropoff_location: string;
    pickup_date: string;
    status: string;
    user_id: string;
    special_instructions?: string;
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
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", booking.user_id)
          .maybeSingle();
        
        if (error) throw error;
        return data;
      } catch (error: any) {
        console.error("Error in userProfile query:", error);
        throw error;
      }
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
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Booking Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!isClient && <CustomerInfo profile={userProfile} />}
          
          <div className="grid gap-4 sm:grid-cols-2">
            <TripDetails tripDetails={tripDetails} />
            <LocationDetails
              pickup={booking.pickup_location}
              dropoff={booking.dropoff_location}
              onLocationClick={handleLocationClick}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {format(new Date(booking.pickup_date), "MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {format(new Date(booking.pickup_date), "h:mm a")}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-gray-500" />
                <Badge variant="outline" className="text-xs">
                  {booking.status}
                </Badge>
              </div>
            </div>
          </div>

          <BookingInstructions
            isEditing={isEditing}
            instructions={booking.special_instructions || ""}
            editedInstructions={editedInstructions}
            onInstructionsChange={setEditedInstructions}
          />

          <BookingActions
            booking={booking}
            isClient={isClient}
            isAdmin={isAdmin}
            canEdit={canEdit}
            isEditing={isEditing}
            onClose={onClose}
            onStatusUpdate={onStatusUpdate}
            setIsEditing={setIsEditing}
            onSaveChanges={handleSaveChanges}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};