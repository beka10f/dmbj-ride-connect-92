import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthError, Session } from "@supabase/supabase-js";
import { UserProfile } from "@/types/user";

interface AuthContextType {
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log("Initializing auth state in AuthProvider");
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(currentSession);
          
          if (currentSession) {
            console.log("Session found, fetching profile");
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", currentSession.user.id)
              .single();

            if (profileError) throw profileError;
            
            if (mounted) {
              setProfile(profileData);
              setIsAdmin(profileData.role === "admin");
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (mounted) {
          setSession(null);
          setProfile(null);
          setIsAdmin(false);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("Auth state changed in AuthProvider:", event);
      
      if (mounted) {
        setSession(newSession);
        
        if (newSession) {
          try {
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", newSession.user.id)
              .single();

            if (profileError) throw profileError;
            
            if (mounted) {
              setProfile(profileData);
              setIsAdmin(profileData.role === "admin");
            }
          } catch (error) {
            console.error("Profile fetch error:", error);
            if (mounted) {
              setProfile(null);
              setIsAdmin(false);
            }
          }
        } else {
          setProfile(null);
          setIsAdmin(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate("/login", { replace: true });
      toast({
        title: "Success",
        description: "Successfully signed out",
      });
    } catch (error: unknown) {
      console.error("Sign out error:", error);
      toast({
        title: "Error",
        description: error instanceof AuthError ? error.message : "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const value = {
    session,
    profile,
    isLoading,
    isAdmin,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}