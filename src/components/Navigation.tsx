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
import { useAuthState } from "./auth/useAuthState";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, isAdmin, handleSignOut } = useAuthState();

  return (
    <nav className="bg-[#0F172A] fixed top-0 left-0 right-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-semibold text-[#BFA181]">DMBJ Transportation</span>
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
                  isLoggedIn={isLoggedIn}
                  isAdmin={isAdmin}
                  handleSignOut={handleSignOut}
                  setIsOpen={setIsOpen}
                />
              </DrawerContent>
            </Drawer>
          </div>

          <div className="hidden sm:block">
            <NavigationItems 
              isLoggedIn={isLoggedIn}
              isAdmin={isAdmin}
              handleSignOut={handleSignOut}
              setIsOpen={setIsOpen}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};