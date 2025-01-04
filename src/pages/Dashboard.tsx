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
        
        if (error) throw error;
        
        if (!session) {
          console.log("No active session found, redirecting to login");
          toast({
            title: "Authentication Required",
            description: "Please sign in to access the dashboard",
            variant: "destructive",
          });
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
  }, [navigate, toast]);

  if (profileLoading || !profile) {
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

  return <DashboardContent profile={profile} />;
};

export default Dashboard;