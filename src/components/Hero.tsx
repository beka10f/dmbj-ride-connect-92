import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-primary text-white p-4 pt-16">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1631486360162-27c02d76ef57?q=80&w=2070')",
        }}
      />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Luxury Transportation
          <span className="block text-secondary mt-2">At Your Service</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl mb-12 text-gray-300"
        >
          Experience the epitome of comfort and elegance with our premium
          limousine service. Available 24/7 for your transportation needs.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            className="bg-secondary text-primary hover:bg-secondary/90"
            asChild
          >
            <Link to="/booking">Book Your Ride</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-secondary text-secondary hover:bg-secondary/10"
            asChild
          >
            <Link to="/auth">Sign Up Now</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};