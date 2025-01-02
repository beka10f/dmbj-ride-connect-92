import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { ProfileData } from "@/hooks/useUserProfile";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface DashboardContentProps {
  profile: ProfileData;
}

export const DashboardContent = ({ profile }: DashboardContentProps) => {
  const { toast } = useToast();
  const {
    bookings,
    applications,
    isLoading,
    bookingsError,
    applicationsError,
    refetchBookings,
  } = useDashboardData(profile.id, profile.role);

  // Show toast when errors occur
  useEffect(() => {
    if (bookingsError) {
      console.error("Bookings fetch error:", bookingsError);
      toast({
        title: "Error loading bookings",
        description: "There was a problem loading your bookings. Please try again.",
        variant: "destructive",
      });
    }
    if (applicationsError) {
      console.error("Applications fetch error:", applicationsError);
      toast({
        title: "Error loading applications",
        description: "There was a problem loading driver applications. Please try again.",
        variant: "destructive",
      });
    }
  }, [bookingsError, applicationsError, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
          <div className="space-y-8">
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Skeleton className="h-[120px] w-full" />
              </div>
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (bookingsError || applicationsError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              There was a problem loading your dashboard data.
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-4"
                onClick={() => refetchBookings()}
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
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
              bookingsCount={bookings?.length || 0}
              applicationsCount={applications?.length || 0}
              isAdmin={profile.role === "admin"}
              isLoading={isLoading}
            />
          </div>
        </div>

        <DashboardTabs
          isAdmin={profile.role === "admin"}
          bookings={bookings || []}
          driverApplications={applications || []}
          onBookingUpdated={refetchBookings}
        />
      </div>
    </div>
  );
};