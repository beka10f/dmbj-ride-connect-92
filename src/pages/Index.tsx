import { Suspense, lazy } from 'react';
import { Hero } from "@/components/Hero";
import { Benefits } from "@/components/Benefits";
import { Footer } from "@/components/Footer";

const LazyBookingForm = lazy(() => import("@/components/BookingForm").then(module => ({ default: module.BookingForm })));
const LazyFleet = lazy(() => import("@/components/Fleet").then(module => ({ default: module.Fleet })));

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
        <LazyBookingForm />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <LazyFleet />
      </Suspense>
      <Footer />
    </div>
  );
};

export default Index;