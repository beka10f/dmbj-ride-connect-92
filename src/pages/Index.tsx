import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <Features />
    </div>
  );
};

export default Index;