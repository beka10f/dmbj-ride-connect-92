import { Info, DollarSign } from "lucide-react";

interface TripDetailsProps {
  tripDetails: {
    distanceText: string;
    totalCost: string;
  } | null;
}

export const TripDetails = ({ tripDetails }: TripDetailsProps) => {
  if (!tripDetails) return null;

  return (
    <div className="space-y-2">
      <h3 className="font-medium flex items-center gap-2">
        <Info className="h-4 w-4" />
        Trip Details
      </h3>
      <div className="pl-6 space-y-1">
        <p className="text-sm text-gray-600">
          Distance: {tripDetails.distanceText}
        </p>
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Estimated Cost: ${tripDetails.totalCost}
        </p>
      </div>
    </div>
  );
};