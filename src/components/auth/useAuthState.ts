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

  const clearSession = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem('supabase.auth.session');
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      clearSession();
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
      // If there's a token error, force clear the session
      clearSession();
      navigate('/login');
    }
  };

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }

        if (session) {
          console.log("Active session found:", session.user.id);
          if (mounted) {
            setIsLoggedIn(true);
            localStorage.setItem('supabase.auth.session', JSON.stringify(session));
            
            // Fetch user profile to check role
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();
            
            if (profileError) throw profileError;
            
            if (mounted) {
              setIsAdmin(profile?.role === 'admin');
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
          if (error.message?.includes('refresh_token')) {
            navigate('/login');
          }
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Initial auth check
    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_IN' && session) {
        if (mounted) {
          setIsLoggedIn(true);
          localStorage.setItem('supabase.auth.session', JSON.stringify(session));
          
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();
            
            if (mounted) {
              setIsAdmin(profile?.role === 'admin');
            }
          } catch (error) {
            console.error("Error fetching profile:", error);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        if (mounted) {
          clearSession();
          navigate('/login');
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