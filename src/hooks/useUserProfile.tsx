import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ProfileData {
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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("first_name, last_name, email, role")
          .eq("id", session.user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    checkAuth();
  }, [navigate, toast]);

  return { profile };
};