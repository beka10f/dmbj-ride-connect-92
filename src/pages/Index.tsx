import { Suspense, lazy, useEffect } from 'react';
import { Hero } from "@/components/Hero";
import { Benefits } from "@/components/Benefits";
import { Footer } from "@/components/Footer";
import { useAuthState } from "@/components/auth/useAuthState";

const BookingForm = lazy(() => import("@/components/BookingForm"));
const Fleet = lazy(() => import("@/components/Fleet"));

const LoadingFallback = () => (
  <div className="w-full h-64 flex items-center justify-center">
    <div className="animate-pulse bg-gray-200 rounded-lg w-full max-w-3xl h-32"></div>
  </div>
);

const Index = () => {
  const { isLoggedIn, handleSignOut } = useAuthState();

  useEffect(() => {
    if (isLoggedIn) {
      console.log("User is logged in on home page, signing out");
      handleSignOut();
    }
  }, [isLoggedIn, handleSignOut]);

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