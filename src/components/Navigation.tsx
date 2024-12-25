import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

export const Navigation = () => {
  const navigate = useNavigate();
  const session = useSession();
  const supabase = useSupabaseClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Button
              variant="link"
              className="text-xl font-bold text-primary"
              onClick={() => navigate("/")}
            >
              DMBJ Transportation
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/bookings")}
                >
                  My Bookings
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/auth")}
                >
                  Sign In
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/driver")}
                >
                  Become a Driver
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};