import { Badge } from "@/components/ui/badge";

interface BookingStatusProps {
  status: string;
}

export const BookingStatus = ({ status }: BookingStatusProps) => {
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <Badge 
      variant="outline" 
      className={`${statusStyles[status as keyof typeof statusStyles]} px-3 py-1 rounded-full font-medium text-xs capitalize`}
    >
      {status}
    </Badge>
  );
};