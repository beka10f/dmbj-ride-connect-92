import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookingStatus } from "./BookingStatus";
import { MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { BookingDetailsDialog } from "./BookingDetailsDialog";

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

  return (
    <>
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="text-sm font-medium text-gray-500">Pickup Location</TableHead>
              <TableHead className="text-sm font-medium text-gray-500">Dropoff Location</TableHead>
              <TableHead className="text-sm font-medium text-gray-500">Date</TableHead>
              <TableHead className="text-sm font-medium text-gray-500">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow 
                key={booking.id}
                className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer"
                onClick={() => setSelectedBooking(booking)}
              >
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{booking.pickup_location}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{booking.dropoff_location}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {format(new Date(booking.pickup_date), "MMM d, yyyy")}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
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