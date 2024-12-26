import { Hero } from "@/components/Hero";
import { BookingForm } from "@/components/BookingForm";
import { Benefits } from "@/components/Benefits";
import { Fleet } from "@/components/Fleet";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Benefits />
      <Fleet />
      <BookingForm />
    </div>
  );
};

export default Index;