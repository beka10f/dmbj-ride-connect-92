import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: string;
}

export const useUserProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (!session) {
          console.log("No active session in useUserProfile");
          navigate("/login");
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, first_name, last_name, email, role")
          .eq("id", session.user.id)
          .single();

        if (profileError) throw profileError;
        
        setProfile(profileData);
      } catch (error: any) {
        console.error("Profile fetch error:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load user profile",
          variant: "destructive",
        });
        
        if (error.message?.includes('auth')) {
          navigate("/login");
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed in useUserProfile:", event, session);
      
      if (event === 'SIGNED_IN' && session) {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("id, first_name, last_name, email, role")
            .eq("id", session.user.id)
            .single();

          if (profileError) throw profileError;
          
          setProfile(profileData);
        } catch (error: any) {
          console.error("Profile fetch error after auth change:", error);
          toast({
            title: "Error",
            description: error.message || "Failed to load user profile",
            variant: "destructive",
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
        navigate("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return { profile };
};