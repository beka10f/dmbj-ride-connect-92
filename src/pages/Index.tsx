import { Suspense, lazy, useEffect, useRef } from 'react';
import { Hero } from "@/components/Hero";
import { Benefits } from "@/components/Benefits";
import { Footer } from "@/components/Footer";
import { useAuthState } from "@/components/auth/useAuthState";
import { useToast } from "@/hooks/use-toast";

const BookingForm = lazy(() => import("@/components/BookingForm"));
const Fleet = lazy(() => import("@/components/Fleet"));

const LoadingFallback = () => (
  <div className="w-full h-64 flex items-center justify-center">
    <div className="animate-pulse bg-gray-200 rounded-lg w-full max-w-3xl h-32"></div>
  </div>
);

const Index = () => {
  const { isLoggedIn, handleSignOut } = useAuthState();
  const { toast } = useToast();
  const isSigningOutRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    const signOutIfLoggedIn = async () => {
      // Prevent multiple sign-out attempts
      if (isSigningOutRef.current) {
        console.log("Sign out already in progress");
        return;
      }

      if (isLoggedIn && mounted) {
        try {
          isSigningOutRef.current = true;
          console.log("User is logged in on home page, initiating sign out");
          await handleSignOut();
          
          if (mounted) {
            toast({
              title: "Signed Out",
              description: "You've been automatically signed out as this page is for non-authenticated users only.",
            });
          }
        } catch (error) {
          console.error("Error during automatic sign out:", error);
          if (mounted) {
            toast({
              title: "Sign Out Error",
              description: "Failed to sign you out automatically. Please try refreshing the page.",
              variant: "destructive",
            });
          }
        } finally {
          if (mounted) {
            isSigningOutRef.current = false;
          }
        }
      }
    };

    signOutIfLoggedIn();

    return () => {
      mounted = false;
    };
  }, [isLoggedIn, handleSignOut, toast]);

  return (
    <div className="min-h-screen bg-white antialiased smooth-scroll">
      <Hero />
      <Benefits />
      <Suspense fallback={<LoadingFallback />}>
        <BookingForm />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <Fleet />
      </Suspense>
      <Footer />
    </div>
  );
};

export default Index;