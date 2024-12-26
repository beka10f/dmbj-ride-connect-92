import { Card } from "@/components/ui/card";
import { Calendar, Users } from "lucide-react";

interface DashboardStatsProps {
  bookingsCount: number;
  applicationsCount: number;
  isAdmin: boolean;
}

export const DashboardStats = ({ bookingsCount, applicationsCount, isAdmin }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <Calendar className="h-6 w-6 text-blue-500 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Bookings</p>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
              {bookingsCount}
            </h3>
          </div>
        </div>
      </Card>

      {isAdmin && (
        <Card className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <Users className="h-6 w-6 text-purple-500 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Driver Applications</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {applicationsCount}
              </h3>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};