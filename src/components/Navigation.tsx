import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { NavigationItems } from "./navigation/NavigationItems";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { session, isAuthenticated } = useSession();
  const { toast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) return; // Prevent multiple sign out attempts
    
    setIsSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Successfully signed out",
      });
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({
        title: "Notice",
        description: "You have been signed out",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <nav className="bg-[#0F172A] fixed top-0 left-0 right-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-semibold text-[#BFA181]">
              DMBJ Transportation
            </span>
          </Link>

          <div className="sm:hidden">
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="text-[#BFA181]">
                  <Menu className="h-6 w-6" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-[#0F172A] p-6">
                <NavigationItems
                  isLoggedIn={isAuthenticated}
                  isAdmin={session?.user?.role === 'admin'}
                  handleSignOut={handleSignOut}
                  setIsOpen={setIsOpen}
                />
              </DrawerContent>
            </Drawer>
          </div>

          <div className="hidden sm:block">
            <NavigationItems
              isLoggedIn={isAuthenticated}
              isAdmin={session?.user?.role === 'admin'}
              handleSignOut={handleSignOut}
              setIsOpen={setIsOpen}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};