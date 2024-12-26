import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationDetailsProps {
  pickup: string;
  dropoff: string;
  onLocationClick: (location: string) => void;
}

export const LocationDetails = ({ pickup, dropoff, onLocationClick }: LocationDetailsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Pickup Location
        </h3>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
          onClick={() => onLocationClick(pickup)}
        >
          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
          {pickup}
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
          onClick={() => onLocationClick(dropoff)}
        >
          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
          {dropoff}
          <ExternalLink className="h-4 w-4 ml-auto text-gray-500" />
        </Button>
      </div>
    </div>
  );
};