import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { NotificationBell } from "./notifications/NotificationBell";
import { Menu } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";

export const Navigation = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
    setIsOpen(false);
  };

  const NavigationItems = () => (
    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
      {isLoggedIn ? (
        <>
          {isAdmin && (
            <div className="sm:mr-2">
              <NotificationBell />
            </div>
          )}
          <Link 
            to="/dashboard" 
            className="w-full sm:w-auto"
            onClick={() => setIsOpen(false)}
          >
            <Button 
              variant="ghost"
              className="w-full sm:w-auto text-[#BFA181] hover:text-[#BFA181]/90 hover:bg-[#BFA181]/10 px-6 py-2 text-lg"
            >
              Dashboard
            </Button>
          </Link>
          <Button 
            onClick={handleSignOut} 
            variant="ghost"
            className="w-full sm:w-auto text-[#BFA181] hover:text-[#BFA181]/90 hover:bg-[#BFA181]/10 px-6 py-2 text-lg"
          >
            Sign Out
          </Button>
        </>
      ) : (
        <>
          <Link 
            to="/login" 
            className="w-full sm:w-auto"
            onClick={() => setIsOpen(false)}
          >
            <Button 
              variant="ghost"
              className="w-full sm:w-auto text-[#BFA181] hover:text-[#BFA181]/90 hover:bg-[#BFA181]/10 px-6 py-2 text-lg"
            >
              Sign In
            </Button>
          </Link>
          <Link 
            to="/become-driver" 
            className="w-full sm:w-auto"
            onClick={() => setIsOpen(false)}
          >
            <Button 
              variant="secondary"
              className="w-full sm:w-auto bg-[#BFA181] text-[#0F172A] hover:bg-[#BFA181]/90 px-6 py-2 text-lg font-medium"
            >
              Become a Driver
            </Button>
          </Link>
        </>
      )}
    </div>
  );

  return (
    <nav className="bg-[#0F172A] fixed top-0 left-0 right-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-semibold text-[#BFA181]">DMBJ Transportation</span>
          </Link>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="text-[#BFA181]">
                  <Menu className="h-6 w-6" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-[#0F172A] p-6">
                <NavigationItems />
              </DrawerContent>
            </Drawer>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:block">
            <NavigationItems />
          </div>
        </div>
      </div>
    </nav>
  );
};