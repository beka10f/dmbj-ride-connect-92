import { Hero } from "@/components/Hero";
import { BookingForm } from "@/components/BookingForm";
import { DriverForm } from "@/components/DriverForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <BookingForm />
      <DriverForm />
    </div>
  );
};

export default Index;