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
  phone: string | null;
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
        console.log("Fetching user profile");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error in useUserProfile:", sessionError);
          throw sessionError;
        }
        
        if (!session) {
          console.log("No active session in useUserProfile");
          if (mounted) {
            setProfile(null);
            setIsLoading(false);
          }
          return;
        }

        console.log("Fetching profile for user:", session.user.id);
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, first_name, last_name, email, role, phone")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          throw profileError;
        }
        
        console.log("Profile data fetched:", profileData);
        if (mounted) {
          setProfile(profileData);
        }
      } catch (error: any) {
        console.error("Profile fetch error:", error);
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive",
        });
        navigate('/login', { replace: true });
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed in useUserProfile:", event);
      
      if (event === 'SIGNED_IN' && session) {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("id, first_name, last_name, email, role, phone")
            .eq("id", session.user.id)
            .single();

          if (profileError) throw profileError;
          
          if (mounted) {
            console.log("Updated profile data:", profileData);
            setProfile(profileData);
          }
        } catch (error: any) {
          console.error("Profile fetch error after auth change:", error);
          toast({
            title: "Error",
            description: "Failed to load user profile",
            variant: "destructive",
          });
          navigate('/login', { replace: true });
        }
      } else if (event === 'SIGNED_OUT') {
        if (mounted) {
          setProfile(null);
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