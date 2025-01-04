import { Suspense, lazy, useEffect } from 'react';
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

  useEffect(() => {
    let mounted = true;

    const signOutIfLoggedIn = async () => {
      if (isLoggedIn && mounted) {
        console.log("User is logged in on home page, signing out");
        await handleSignOut();
        toast({
          title: "Signed Out",
          description: "You've been automatically signed out as this page is for non-authenticated users only.",
        });
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