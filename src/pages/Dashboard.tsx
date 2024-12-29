import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { BookingsTable } from "@/components/dashboard/BookingsTable";
import { ApplicationsTable } from "@/components/dashboard/ApplicationsTable";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { QuickBookingButton } from "@/components/dashboard/QuickBookingButton";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useUserProfile();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to access the dashboard",
          variant: "destructive",
        });
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const { data: bookings = [], refetch: refetchBookings } = useQuery({
    queryKey: ["bookings", profile?.role],
    queryFn: async () => {
      if (!profile) return [];

      const query = supabase.from("bookings").select("*");

      if (profile.role === 'client') {
        query.eq('user_id', await supabase.auth.getUser().then(res => res.data.user?.id));
      } else if (profile.role === 'driver') {
        query.eq('assigned_driver_id', await supabase.auth.getUser().then(res => res.data.user?.id));
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching bookings:", error);
        throw error;
      }
      return data || [];
    },
    enabled: !!profile,
  });

  const { data: driverApplications = [] } = useQuery({
    queryKey: ["driverApplications"],
    queryFn: async () => {
      if (profile?.role !== "admin") return [];
      
      const { data: applicationsData, error: applicationsError } = await supabase
        .from("driver_applications")
        .select("*");

      if (applicationsError) throw applicationsError;
      return applicationsData || [];
    },
    enabled: profile?.role === "admin",
  });

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 space-y-8 animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Welcome, {profile?.first_name || "User"}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                {profile?.role === "admin" ? "Admin Dashboard" : "Your Dashboard"}
              </p>
            </div>
            {profile?.role === "client" && <QuickBookingButton />}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <DashboardStats
              bookingsCount={bookings.length}
              applicationsCount={driverApplications.length}
              isAdmin={profile.role === "admin"}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4">
          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="w-full flex space-x-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
              <TabsTrigger 
                value="bookings"
                className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:shadow-sm"
              >
                Bookings
              </TabsTrigger>
              {profile?.role === "admin" && (
                <TabsTrigger 
                  value="applications"
                  className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:shadow-sm"
                >
                  Applications
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="bookings" className="space-y-4 pt-2">
              <BookingsTable 
                bookings={bookings} 
                onBookingUpdated={refetchBookings}
              />
            </TabsContent>

            {profile?.role === "admin" && (
              <TabsContent value="applications" className="space-y-4 pt-2">
                <ApplicationsTable applications={driverApplications} />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;