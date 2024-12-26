import { Calendar, Car } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";

interface DashboardStatsProps {
  bookingsCount: number;
  applicationsCount: number;
  isAdmin: boolean;
}

export const DashboardStats = ({ bookingsCount, applicationsCount, isAdmin }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Bookings"
        value={bookingsCount}
        icon={Calendar}
      />
      {isAdmin && (
        <StatsCard
          title="Driver Applications"
          value={applicationsCount}
          icon={Car}
        />
      )}
    </div>
  );
};