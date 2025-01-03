import { Suspense, lazy } from 'react';
import { Hero } from "@/components/Hero";
import { Benefits } from "@/components/Benefits";
import { Footer } from "@/components/Footer";

const BookingForm = lazy(() => import("@/components/BookingForm"));
const Fleet = lazy(() => import("@/components/Fleet"));

const LoadingFallback = () => (
  <div className="w-full h-64 flex items-center justify-center">
    <div className="animate-pulse bg-gray-200 rounded-lg w-full max-w-3xl h-32"></div>
  </div>
);

const Index = () => {
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