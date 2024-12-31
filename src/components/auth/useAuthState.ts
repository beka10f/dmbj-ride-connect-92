import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const useAuthState = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const clearSession = () => {
    console.log("Clearing session state");
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  const handleSignOut = async () => {
    if (isSigningOut) return; // Prevent multiple sign-out attempts
    
    try {
      setIsSigningOut(true);
      console.log("Attempting to sign out");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      clearSession();
      console.log("Successfully signed out, redirecting to home");
      navigate('/');
      toast({
        title: "Success",
        description: "Successfully signed out",
      });
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
      clearSession();
      navigate('/');
    } finally {
      setIsSigningOut(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }

        if (session) {
          console.log("Active session found:", session.user.id);
          if (mounted) {
            setIsLoggedIn(true);
            
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();
            
            if (profileError) {
              console.error("Profile fetch error:", profileError);
              throw profileError;
            }
            
            if (mounted) {
              setIsAdmin(profile?.role === 'admin');
              console.log("User role set:", profile?.role);
            }
          }
        } else {
          console.log("No active session");
          if (mounted) {
            clearSession();
          }
        }
      } catch (error: any) {
        console.error("Auth check error:", error);
        if (mounted) {
          clearSession();
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session) {
        if (mounted) {
          setIsLoggedIn(true);
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();
            
            if (profileError) throw profileError;
            
            if (mounted) {
              setIsAdmin(profile?.role === 'admin');
              console.log("User role updated:", profile?.role);
            }
          } catch (error) {
            console.error("Error fetching profile:", error);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("Sign out event received");
        if (mounted) {
          clearSession();
          navigate('/');
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return {
    isLoggedIn,
    isAdmin,
    isLoading,
    handleSignOut,
  };
};