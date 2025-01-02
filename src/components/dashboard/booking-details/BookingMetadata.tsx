import { Calendar, Clock, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface BookingMetadataProps {
  pickupDate: string;
  status: string;
}

export const BookingMetadata = ({ pickupDate, status }: BookingMetadataProps) => {
  // Create a single Date object to avoid parsing multiple times
  const parsedPickupDate = new Date(pickupDate);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm">
            {format(parsedPickupDate, "MMMM d, yyyy")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="text-sm">
            {format(parsedPickupDate, "h:mm a")}
          </span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-gray-500" />
          <Badge variant="outline" className="text-xs">
            {status}
          </Badge>
        </div>
      </div>
    </div>
  );
};
