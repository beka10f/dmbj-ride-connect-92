import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookingStatus } from "./BookingStatus";
import { MapPin, Calendar, Clock, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { BookingDetailsDialog } from "./BookingDetailsDialog";
import { calculateDistance } from "../booking/DistanceCalculator";
import { useUserProfile } from "@/hooks/useUserProfile";
import { supabase } from "@/integrations/supabase/client";

interface Booking {
  id: string;
  pickup_location: string;
  dropoff_location: string;
  pickup_date: string;
  status: string;
  user_id: string;
  special_instructions?: string;
}

interface BookingsTableProps {
  bookings: Booking[];
  onBookingUpdated?: () => void;
}

export const BookingsTable = ({ bookings, onBookingUpdated }: BookingsTableProps) => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingCosts, setBookingCosts] = useState<Record<string, string>>({});
  const { profile } = useUserProfile();

  useEffect(() => {
    const fetchCosts = async () => {
      const costs: Record<string, string> = {};
      for (const booking of bookings) {
        try {
          const details = await calculateDistance(booking.pickup_location, booking.dropoff_location);
          costs[booking.id] = details.totalCost;
        } catch (error) {
          console.error("Error calculating cost for booking:", booking.id, error);
        }
      }
      setBookingCosts(costs);
    };

    fetchCosts();
  }, [bookings]);

  // Filter bookings based on user role and ID
  const filteredBookings = bookings.filter(booking => {
    if (!profile) return false;
    
    if (profile.role === 'admin') {
      return true; // Admins see all bookings
    } else if (profile.role === 'driver') {
      return booking.assigned_driver_id === profile.id; // Drivers see only their assigned bookings
    } else {
      return booking.user_id === profile.id; // Clients see only their bookings
    }
  });

  return (
    <>
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="text-sm font-medium text-gray-500">Pickup</TableHead>
              <TableHead className="text-sm font-medium text-gray-500">Dropoff</TableHead>
              <TableHead className="text-sm font-medium text-gray-500">Date</TableHead>
              <TableHead className="text-sm font-medium text-gray-500">Time</TableHead>
              <TableHead className="text-sm font-medium text-gray-500">Price</TableHead>
              <TableHead className="text-sm font-medium text-gray-500">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow 
                key={booking.id}
                className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer"
                onClick={() => setSelectedBooking(booking)}
              >
                <TableCell className="py-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700 truncate max-w-[150px]">
                      {booking.pickup_location}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700 truncate max-w-[150px]">
                      {booking.dropoff_location}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {format(new Date(booking.pickup_date), "MMM d")}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {format(new Date(booking.pickup_date), "h:mm a")}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      ${bookingCosts[booking.id] || '...'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <BookingStatus status={booking.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <BookingDetailsDialog
        booking={selectedBooking}
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onStatusUpdate={() => {
          setSelectedBooking(null);
          onBookingUpdated?.();
        }}
      />
    </>
  );
};