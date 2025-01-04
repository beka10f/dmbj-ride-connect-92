import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, isLoading, session } = useAuth();

  useEffect(() => {
    if (!isLoading && !session) {
      console.log("No session found in Dashboard, redirecting to login");
      navigate("/login", { replace: true });
    }
  }, [isLoading, session, navigate]);

  if (isLoading || !profile) {
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