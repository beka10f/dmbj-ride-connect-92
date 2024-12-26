import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-primary text-white p-4">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1631486360162-27c02d76ef57?q=80&w=2070')",
        }}
      />
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-8 tracking-tight"
        >
          Luxury Transportation
          <span className="block text-secondary mt-3 text-3xl md:text-5xl">At Your Service</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl mb-12 text-gray-300 leading-relaxed max-w-2xl mx-auto"
        >
          Experience the epitome of comfort and elegance with our premium
          limousine service
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-4"
        >
          <Button
            size="lg"
            className="bg-secondary text-primary hover:bg-secondary/90 text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}
          >
            Book Your Ride
          </Button>
        </motion.div>
      </div>
    </div>
  );
};