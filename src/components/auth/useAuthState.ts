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
    localStorage.removeItem('supabase.auth.token');
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
      if (error.message?.includes('refresh_token')) {
        clearSession();
        navigate('/login');
      }
      toast({
        title: "Error",
        description: error.message || "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          if (sessionError.message?.includes('refresh_token')) {
            clearSession();
            navigate('/login');
            return;
          }
          throw sessionError;
        }

        if (session) {
          console.log("Active session found:", session.user.id);
          setIsLoggedIn(true);
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) throw profileError;
          setIsAdmin(profile?.role === 'admin');
        } else {
          console.log("No active session");
          clearSession();
        }
      } catch (error: any) {
        console.error("Auth check error:", error);
        toast({
          title: "Error",
          description: error.message || "Authentication check failed",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      if (event === 'SIGNED_IN' && session) {
        setIsLoggedIn(true);
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        setIsAdmin(profile?.role === 'admin');
      } else if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        if (!session) {
          clearSession();
        }
      }
    });

    return () => {
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