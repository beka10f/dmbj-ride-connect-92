import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, isLoading: profileLoading } = useUserProfile();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check failed:", error);
          throw error;
        }
        
        if (!session) {
          console.log("No active session found, redirecting to login");
          navigate('/login');
          return;
        }

        console.log("Active session found:", session.user.id);
      } catch (error: any) {
        console.error("Session check failed:", error);
        toast({
          title: "Authentication Required",
          description: error.message || "Please sign in to access the dashboard",
          variant: "destructive",
        });
        navigate('/login');
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed in Dashboard:", event, session);
      if (event === 'SIGNED_OUT' || (!session && event === 'TOKEN_REFRESHED')) {
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const { data: bookings = [], refetch: refetchBookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["bookings", profile?.role],
    queryFn: async () => {
      if (!profile) {
        console.log("No profile data available for bookings query");
        return [];
      }

      try {
        const query = supabase.from("bookings").select("*");

        if (profile.role === 'client') {
          query.eq('user_id', profile.id);
        } else if (profile.role === 'driver') {
          query.eq('assigned_driver_id', profile.id);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
      } catch (error: any) {
        console.error("Error fetching bookings:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to fetch bookings",
          variant: "destructive",
        });
        return [];
      }
    },
    enabled: !!profile,
  });

  const { data: driverApplications = [], isLoading: applicationsLoading } = useQuery({
    queryKey: ["driverApplications"],
    queryFn: async () => {
      if (profile?.role !== "admin") {
        console.log("User is not admin, skipping applications fetch");
        return [];
      }
      
      try {
        const { data, error } = await supabase
          .from("driver_applications")
          .select("*");

        if (error) throw error;
        return data || [];
      } catch (error: any) {
        console.error("Error fetching applications:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to fetch driver applications",
          variant: "destructive",
        });
        return [];
      }
    },
    enabled: profile?.role === "admin",
  });

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-6 space-y-8">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!profile) {
    console.log("No profile data available for dashboard render");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 space-y-8 animate-fadeIn">
        <DashboardHeader 
          firstName={profile.first_name}
          role={profile.role}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <DashboardStats
              bookingsCount={bookings.length}
              applicationsCount={driverApplications.length}
              isAdmin={profile.role === "admin"}
              isLoading={bookingsLoading || applicationsLoading}
            />
          </div>
        </div>

        <DashboardTabs
          isAdmin={profile.role === "admin"}
          bookings={bookings}
          driverApplications={driverApplications}
          onBookingUpdated={refetchBookings}
        />
      </div>
    </div>
  );
};

export default Dashboard;
