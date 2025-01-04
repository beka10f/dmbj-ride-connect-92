import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSession = () => {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error fetching session:", error);
          if (mounted) {
            toast({
              title: "Error",
              description: "Failed to fetch session",
              variant: "destructive",
            });
            setSession(null);
          }
          return;
        }
        console.log("Initial session check:", currentSession?.user?.id || "No session");
        if (mounted) {
          setSession(currentSession);
        }
      } catch (error) {
        console.error("Session initialization error:", error);
        if (mounted) {
          setSession(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event, currentSession?.user?.id);
      
      if (mounted) {
        if (event === 'SIGNED_OUT') {
          console.log("User signed out, clearing session");
          setSession(null);
        } else if (currentSession) {
          setSession(currentSession);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  return {
    session,
    setSession,
    isLoading,
    isAuthenticated: !!session,
    user: session?.user,
  };
};