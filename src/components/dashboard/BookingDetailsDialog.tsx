import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin, User, Calendar, Info, DollarSign, Clock } from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { calculateDistance } from "../booking/DistanceCalculator";
import { useState, useEffect } from "react";

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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Booking Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* User Information */}
          <div className="space-y-2">
            <h3 className="font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Customer Information
            </h3>
            <div className="pl-6 space-y-1">
              <p className="text-sm text-gray-600">
                Name: {userProfile?.first_name} {userProfile?.last_name}
              </p>
              <p className="text-sm text-gray-600">
                Email: {userProfile?.email}
              </p>
              <p className="text-sm text-gray-600">
                Phone: {userProfile?.phone || "Not provided"}
              </p>
            </div>
          </div>

          {/* Trip Details */}
          <div className="space-y-2">
            <h3 className="font-medium flex items-center gap-2">
              <Info className="h-4 w-4" />
              Trip Details
            </h3>
            <div className="pl-6 space-y-1">
              {tripDetails && (
                <>
                  <p className="text-sm text-gray-600">
                    Distance: {tripDetails.distanceText}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Estimated Cost: ${tripDetails.totalCost}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Locations */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Pickup Location
              </h3>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                onClick={() => handleLocationClick(booking.pickup_location)}
              >
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                {booking.pickup_location}
                <ExternalLink className="h-4 w-4 ml-auto text-gray-500" />
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Dropoff Location
              </h3>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                onClick={() => handleLocationClick(booking.dropoff_location)}
              >
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                {booking.dropoff_location}
                <ExternalLink className="h-4 w-4 ml-auto text-gray-500" />
              </Button>
            </div>
          </div>

          {/* Date and Time */}
          <div className="space-y-4">
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

          {/* Special Instructions */}
          {booking.special_instructions && (
            <div className="space-y-2">
              <h3 className="font-medium">Special Instructions</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                {booking.special_instructions}
              </p>
            </div>
          )}

          {/* Actions */}
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