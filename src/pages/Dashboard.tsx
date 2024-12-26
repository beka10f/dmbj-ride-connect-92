import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Car, CheckCircle, Clock, MapPin, User, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return (
      <Badge className={`${statusStyles[status as keyof typeof statusStyles]}`}>
        {status}
      </Badge>
    );
  };

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
          <h1 className="text-3xl font-bold text-primary">
            Welcome, {profile?.first_name || 'User'}!
          </h1>
          <p className="text-muted-foreground mt-1">
            {profile?.role === 'admin' ? 'Admin Dashboard' : 'Your Dashboard'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
          </CardContent>
        </Card>
        {profile?.role === 'admin' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Driver Applications</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{driverApplications.length}</div>
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs defaultValue="bookings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          {profile?.role === 'admin' && (
            <TabsTrigger value="applications">Driver Applications</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pickup Location</TableHead>
                    <TableHead>Dropoff Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {booking.pickup_location}
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {booking.dropoff_location}
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {new Date(booking.pickup_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {profile?.role === 'admin' && (
          <TabsContent value="applications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Driver Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>License Number</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applied On</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {driverApplications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {application.license_number}
                        </TableCell>
                        <TableCell>{application.years_experience} years</TableCell>
                        <TableCell>{getStatusBadge(application.status)}</TableCell>
                        <TableCell className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(application.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Dashboard;