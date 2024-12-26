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
    <nav className="bg-[#0F172A] border-b border-[#BFA181]/20 fixed top-0 left-0 right-0 w-full z-50">
      <div className="px-4 sm:px-6 py-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-semibold text-[#BFA181]">DMBJ Transportation</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <div className="mr-2">
                    <NotificationBell />
                  </div>
                )}
                <Link to="/dashboard">
                  <Button 
                    variant="ghost"
                    className="text-[#BFA181] hover:text-[#BFA181]/90 hover:bg-[#BFA181]/10 px-4 h-10 text-base font-medium"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  onClick={handleSignOut} 
                  variant="ghost"
                  className="text-[#BFA181] hover:text-[#BFA181]/90 hover:bg-[#BFA181]/10 px-4 h-10 text-base font-medium"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button 
                    variant="ghost"
                    className="text-[#BFA181] hover:text-[#BFA181]/90 hover:bg-[#BFA181]/10 px-4 h-10 text-base font-medium"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/become-driver">
                  <Button 
                    variant="secondary"
                    className="bg-[#BFA181] text-[#0F172A] hover:bg-[#BFA181]/90 px-4 h-10 text-base font-medium whitespace-nowrap"
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