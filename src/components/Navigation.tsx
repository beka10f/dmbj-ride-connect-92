import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { NotificationBell } from "./notifications/NotificationBell";

export const Navigation = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        setIsAdmin(profile?.role === 'admin');
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setIsLoggedIn(true);
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="bg-[#0F172A] border-b border-[#BFA181]/20 fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-14 sm:h-16 items-center">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-lg sm:text-xl font-bold text-[#BFA181] truncate">DMBJ Transportation</span>
            </Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {isLoggedIn ? (
              <>
                {isAdmin && <NotificationBell />}
                <Link to="/dashboard">
                  <Button 
                    variant="ghost"
                    className="text-[#BFA181] hover:text-[#BFA181]/90 hover:bg-[#BFA181]/10 px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  onClick={handleSignOut} 
                  variant="ghost"
                  className="text-[#BFA181] hover:text-[#BFA181]/90 hover:bg-[#BFA181]/10 px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button 
                    variant="ghost"
                    className="text-[#BFA181] hover:text-[#BFA181]/90 hover:bg-[#BFA181]/10 px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/become-driver">
                  <Button 
                    variant="secondary"
                    className="bg-[#BFA181] text-[#0F172A] hover:bg-[#BFA181]/90 px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base whitespace-nowrap"
                  >
                    Become a Driver
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};