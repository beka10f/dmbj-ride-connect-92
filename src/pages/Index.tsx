import { Hero } from "@/components/Hero";
import { BookingForm } from "@/components/BookingForm";
import { Benefits } from "@/components/Benefits";
import { Fleet } from "@/components/Fleet";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white antialiased smooth-scroll">
      <Hero />
      <Benefits />
      <BookingForm />
      <Fleet />
      <Footer />
    </div>
  );
};

export default Index;