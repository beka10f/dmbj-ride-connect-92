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
    if (isSigningOut) return;
    
    setIsSigningOut(true);
    try {
      console.log("Attempting to sign out");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear the session state before navigation
      clearSession();
      
      // Show toast and navigate
      toast({
        title: "Success",
        description: "Successfully signed out",
      });
      
      navigate('/login');
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({
        title: "Error",
        description: "Failed to sign out properly. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && mounted) {
          console.log("Session found:", session.user.id);
          setIsLoggedIn(true);
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (mounted) {
            setIsAdmin(profile?.role === 'admin');
          }
        } else {
          console.log("No active session");
          if (mounted) {
            clearSession();
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (mounted) {
          clearSession();
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session) {
        if (mounted) {
          setIsLoggedIn(true);
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (mounted) {
            setIsAdmin(profile?.role === 'admin');
          }
        }
      } else if (event === 'SIGNED_OUT') {
        if (mounted) {
          clearSession();
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