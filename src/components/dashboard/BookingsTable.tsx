import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookingStatus } from "./BookingStatus";
import { MapPin, Calendar, Clock, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { BookingDetailsDialog } from "./BookingDetailsDialog";
import { calculateDistance } from "../booking/DistanceCalculator";
import { useUserProfile } from "@/hooks/useUserProfile";
import { DistanceCalculation } from "@/types/booking";

interface Booking {
  id: string;
  pickup_location: string;
  dropoff_location: string;
  pickup_date: string;
  status: string;
  user_id: string;
  assigned_driver_id?: string;
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
          // Check if special_instructions contains cost information
          if (booking.special_instructions) {
            try {
              const instructionsData = JSON.parse(booking.special_instructions);
              if (instructionsData.cost) {
                costs[booking.id] = instructionsData.cost.replace('$', '');
                continue;
              }
            } catch (e) {
              // If parsing fails, proceed with distance calculation
              console.log("Could not parse special instructions for cost:", e);
            }
          }

          // Fallback to calculating distance if no cost in special instructions
          const details: DistanceCalculation = await calculateDistance(
            booking.pickup_location, 
            booking.dropoff_location
          );
          costs[booking.id] = details.totalCost;
        } catch (error) {
          console.error("Error calculating cost for booking:", booking.id, error);
          costs[booking.id] = "N/A";
        }
      }
      setBookingCosts(costs);
    };

    fetchCosts();
  }, [bookings]);

  const filteredBookings = bookings.filter(booking => {
    if (!profile) return false;
    
    if (profile.role === 'admin') {
      return true;
    } else if (profile.role === 'driver') {
      return booking.assigned_driver_id === profile.id;
    } else {
      return booking.user_id === profile.id;
    }
  });

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 dark:bg-gray-800/50">
                <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[120px]">Pickup</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[120px]">Dropoff</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[100px]">Date</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[100px]">Time</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[80px]">Price</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[100px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow 
                  key={booking.id}
                  className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer dark:border-gray-800 dark:hover:bg-gray-800/50"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[120px] sm:max-w-[200px]">
                        {booking.pickup_location}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[120px] sm:max-w-[200px]">
                        {booking.dropoff_location}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {format(new Date(booking.pickup_date), "MMM d")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {format(new Date(booking.pickup_date), "h:mm a")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
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