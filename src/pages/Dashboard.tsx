import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Car } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BookingsTable } from "@/components/dashboard/BookingsTable";
import { StatsCard } from "@/components/dashboard/StatsCard";

interface BookingData {
  id: string;
  pickup_location: string;
  dropoff_location: string;
  pickup_date: string;
  status: string;
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

interface ProfileData {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [driverApplications, setDriverApplications] = useState<DriverApplication[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      try {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name, email, role')
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch bookings based on role
        const bookingsQuery = profile?.role === 'admin' 
          ? supabase.from('bookings').select('*')
          : supabase.from('bookings').select('*').eq('user_id', session.user.id);
        
        const { data: bookingsData, error: bookingsError } = await bookingsQuery;
        if (bookingsError) throw bookingsError;
        setBookings(bookingsData || []);

        // Fetch driver applications if admin
        if (profile?.role === 'admin') {
          const { data: applicationsData, error: applicationsError } = await supabase
            .from('driver_applications')
            .select('*');
          if (applicationsError) throw applicationsError;
          setDriverApplications(applicationsData || []);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, toast, profile?.role]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {profile?.first_name || 'User'}!
          </h1>
          <p className="text-gray-500 mt-1">
            {profile?.role === 'admin' ? 'Admin Dashboard' : 'Your Dashboard'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Bookings"
          value={bookings.length}
          icon={Calendar}
        />
        {profile?.role === 'admin' && (
          <StatsCard
            title="Driver Applications"
            value={driverApplications.length}
            icon={Car}
          />
        )}
      </div>

      <Tabs defaultValue="bookings" className="space-y-6">
        <TabsList className="bg-gray-100/50 p-1 rounded-lg">
          <TabsTrigger 
            value="bookings"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-2 text-sm font-medium transition-all"
          >
            Bookings
          </TabsTrigger>
          {profile?.role === 'admin' && (
            <TabsTrigger 
              value="applications"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-2 text-sm font-medium transition-all"
            >
              Driver Applications
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="bookings" className="space-y-4">
          <BookingsTable bookings={bookings} />
        </TabsContent>

        {profile?.role === 'admin' && (
          <TabsContent value="applications" className="space-y-4">
            <BookingsTable bookings={bookings} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Dashboard;
