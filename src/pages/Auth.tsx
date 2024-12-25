import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";

const AuthPage = () => {
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, supabase.auth]);

  if (!mode) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container max-w-lg mx-auto pt-24 px-4">
        <h1 className="text-2xl font-bold text-center mb-8">
          {mode === "signin" ? "Welcome Back" : "Create an Account"}
        </h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          view={mode === "signin" ? "sign_in" : "sign_up"}
          theme="light"
          showLinks={false}
          providers={[]}
        />
      </div>
    </div>
  );
};

export default AuthPage;