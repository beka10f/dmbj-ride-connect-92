import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SignInForm } from "@/components/auth/SignInForm";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session check error:", error);
          return;
        }
        if (session) {
          console.log("Active session found, redirecting to dashboard");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed in Login:", event);
      if (event === "SIGNED_IN" && session) {
        toast({
          title: "Success",
          description: "Successfully signed in!",
        });
        navigate("/dashboard");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <SignInForm />
    </div>
  );
};

export default Login;