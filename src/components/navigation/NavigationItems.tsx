import { memo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface NavigationItemsProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
  handleSignOut: () => Promise<void>;
  setIsOpen: (open: boolean) => void;
}

export const NavigationItems = memo(({ 
  isLoggedIn, 
  isAdmin, 
  handleSignOut, 
  setIsOpen 
}: NavigationItemsProps) => (
  <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
    {isLoggedIn ? (
      <>
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
));

NavigationItems.displayName = 'NavigationItems';