import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSession = () => {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: currentSession }, error }) => {
      if (error) {
        console.error("Error fetching session:", error);
        toast({
          title: "Error",
          description: "Failed to fetch session",
          variant: "destructive",
        });
      }
      console.log("Initial session check:", currentSession?.user?.id || "No session");
      setSession(currentSession);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      console.log("Auth state changed:", _event, currentSession?.user?.id);
      setSession(currentSession);
      
      if (_event === 'SIGNED_OUT') {
        console.log("User signed out, clearing session");
        setSession(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  return {
    session,
    isLoading,
    isAuthenticated: !!session,
    user: session?.user,
  };
};