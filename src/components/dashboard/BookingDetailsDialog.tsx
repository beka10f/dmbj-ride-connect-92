import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  const [tripDetails, setTripDetails] = useState<{ distanceText: string; totalCost: string } | null>(null);

  const { data: userProfile } = useQuery({
    queryKey: ["userProfile", booking?.user_id],
    queryFn: async () => {
      if (!booking?.user_id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", booking.user_id)
        .single();
      
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
  }, [booking]);

  const handleLocationClick = (location: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
  };

  const handleAcceptBooking = async () => {
    if (!booking) return;

    const { error } = await supabase
      .from("bookings")
      .update({ status: "accepted" })
      .eq("id", booking.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to accept booking",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Booking accepted successfully",
    });
    onStatusUpdate();
  };

  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Booking Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <CustomerInfo profile={userProfile} />
          <TripDetails tripDetails={tripDetails} />
          <LocationDetails
            pickup={booking.pickup_location}
            dropoff={booking.dropoff_location}
            onLocationClick={handleLocationClick}
          />

          <div className="flex flex-col space-y-2">
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
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-gray-500" />
              <Badge variant="outline" className="text-xs">
                {booking.status}
              </Badge>
            </div>
          </div>

          {booking.special_instructions && (
            <div className="space-y-2">
              <h3 className="font-medium">Special Instructions</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                {booking.special_instructions}
              </p>
            </div>
          )}

          {booking.status === "pending" && (
            <div className="flex justify-end gap-3 pt-4">
              <Button onClick={handleAcceptBooking}>
                Accept Booking
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};