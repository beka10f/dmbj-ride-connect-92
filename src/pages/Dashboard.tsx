import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, isLoading: profileLoading } = useUserProfile();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          toast({
            title: "Session Error",
            description: "There was an error checking your session. Please try logging in again.",
            variant: "destructive",
          });
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      console.log("Auth state changed in Dashboard:", event);
      if (event === 'SIGNED_OUT') {
        console.log("User signed out, redirecting");
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

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

  return <DashboardContent profile={profile} />;
};

export default Dashboard;