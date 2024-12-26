import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const Navigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  return (
    <nav className="bg-primary text-white py-4 px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-secondary">
          DMBJ Transportation
        </Link>
        <div className="space-x-4">
          <Link to="/" className="text-white hover:text-secondary transition-colors">
            Home
          </Link>
          <Link to="/become-driver" className="text-white hover:text-secondary transition-colors">
            Become a Driver
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-white hover:text-secondary transition-colors">
                Dashboard
              </Link>
              <Button 
                variant="secondary" 
                onClick={handleLogout}
                className="text-primary hover:text-primary-foreground"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link to="/login" className="text-white hover:text-secondary transition-colors">
              Login / Register
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};