import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { BookingsTable } from "@/components/dashboard/BookingsTable";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useQuery } from "@tanstack/react-query";

interface BookingData {
  id: string;
  pickup_location: string;
  dropoff_location: string;
  pickup_date: string;
  status: string;
  user_id: string;
  special_instructions?: string;
}

interface DriverApplication {
  id: string;
  years_experience: number;
  license_number: string;
  about_text?: string;
  status: string;
  created_at: string;
}

const Dashboard = () => {
  const { profile } = useUserProfile();

  const { data: bookings = [], refetch: refetchBookings } = useQuery({
    queryKey: ["bookings", profile?.role],
    queryFn: async () => {
      if (!profile) return [];

      const query = supabase.from("bookings").select("*");

      // Filter bookings based on user role
      if (profile.role === 'client') {
        query.eq('user_id', await supabase.auth.getUser().then(res => res.data.user?.id));
      } else if (profile.role === 'driver') {
        query.eq('assigned_driver_id', await supabase.auth.getUser().then(res => res.data.user?.id));
      }
      // Admin sees all bookings (no filter)

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
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {profile?.first_name || "User"}!
          </h1>
          <p className="text-gray-500 mt-1">
            {profile?.role === "admin" ? "Admin Dashboard" : "Your Dashboard"}
          </p>
        </div>
      </div>

      <DashboardStats
        bookingsCount={bookings.length}
        applicationsCount={driverApplications.length}
        isAdmin={profile.role === "admin"}
      />

      <Tabs defaultValue="bookings" className="space-y-6">
        <TabsList className="bg-gray-100/50 p-1 rounded-lg">
          <TabsTrigger 
            value="bookings"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-2 text-sm font-medium transition-all"
          >
            Bookings
          </TabsTrigger>
          {profile?.role === "admin" && (
            <TabsTrigger 
              value="applications"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-2 text-sm font-medium transition-all"
            >
              Driver Applications
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="bookings" className="space-y-4">
          <BookingsTable 
            bookings={bookings} 
            onBookingUpdated={refetchBookings}
          />
        </TabsContent>

        {profile?.role === "admin" && (
          <TabsContent value="applications" className="space-y-4">
            <BookingsTable 
              bookings={bookings}
              onBookingUpdated={refetchBookings}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Dashboard;