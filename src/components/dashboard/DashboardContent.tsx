import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { ProfileData } from "@/hooks/useUserProfile";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardContentProps {
  profile: ProfileData;
}

export const DashboardContent = ({ profile }: DashboardContentProps) => {
  const {
    bookings,
    applications,
    isLoading,
    refetchBookings
  } = useDashboardData(profile.id, profile.role);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
          <div className="space-y-8">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 animate-fadeIn">
        <DashboardHeader 
          firstName={profile.first_name}
          role={profile.role}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <DashboardStats
              bookingsCount={bookings.length}
              applicationsCount={applications.length}
              isAdmin={profile.role === "admin"}
              isLoading={isLoading}
            />
          </div>
        </div>

        <DashboardTabs
          isAdmin={profile.role === "admin"}
          bookings={bookings}
          driverApplications={applications}
          onBookingUpdated={refetchBookings}
        />
      </div>
    </div>
  );
};