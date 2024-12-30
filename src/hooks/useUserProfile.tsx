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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }

        if (!session) {
          console.log("No active session");
          if (mounted) {
            setProfile(null);
            setIsLoading(false);
          }
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, first_name, last_name, email, role")
          .eq("id", session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          throw profileError;
        }

        if (mounted) {
          setProfile(profileData);
          setIsLoading(false);
        }
      } catch (error: any) {
        console.error("Profile fetch error:", error);
        if (mounted) {
          setProfile(null);
          setIsLoading(false);
          if (error.message?.includes('JWT')) {
            navigate('/login');
          }
        }
      }
    };

    fetchProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_IN' && session) {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("id, first_name, last_name, email, role")
            .eq("id", session.user.id)
            .maybeSingle();

          if (profileError) throw profileError;
          
          if (mounted) {
            setProfile(profileData);
          }
        } catch (error) {
          console.error("Profile fetch error after auth change:", error);
          if (mounted) {
            setProfile(null);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        if (mounted) {
          setProfile(null);
          navigate('/login');
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return { profile, isLoading };
};