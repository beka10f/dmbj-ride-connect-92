import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { profile, isLoading: profileLoading } = useUserProfile();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
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
          description: "Please sign in to access the dashboard",
          variant: "destructive",
        });
        navigate('/login');
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed in Dashboard:", event);
      if (event === 'SIGNED_OUT') {
        console.log("User signed out, clearing queries and redirecting");
        queryClient.clear();
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast, queryClient]);

  const { data: bookings = [], refetch: refetchBookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["bookings", profile?.id, profile?.role],
    queryFn: async () => {
      if (!profile?.id) {
        console.log("No profile ID available, skipping bookings fetch");
        return [];
      }

      console.log("Fetching bookings for profile:", profile.id, "with role:", profile.role);
      const query = supabase.from("bookings").select("*");

      if (profile.role === 'client') {
        query.eq('user_id', profile.id);
      } else if (profile.role === 'driver') {
        query.eq('assigned_driver_id', profile.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Bookings fetch error:", error);
        throw error;
      }
      
      console.log("Fetched bookings:", data);
      return data || [];
    },
    enabled: !!profile?.id,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  const { data: driverApplications = [], isLoading: applicationsLoading } = useQuery({
    queryKey: ["driverApplications", profile?.id, profile?.role],
    queryFn: async () => {
      if (profile?.role !== "admin") {
        console.log("User is not admin, skipping applications fetch");
        return [];
      }
      
      console.log("Fetching driver applications");
      const { data, error } = await supabase
        .from("driver_applications")
        .select("*");

      if (error) {
        console.error("Applications fetch error:", error);
        throw error;
      }
      
      console.log("Fetched applications:", data);
      return data || [];
    },
    enabled: profile?.role === "admin",
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-8">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const isLoading = bookingsLoading || applicationsLoading;

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
              applicationsCount={driverApplications.length}
              isAdmin={profile.role === "admin"}
              isLoading={isLoading}
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