import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center bg-primary text-white px-4 py-12 sm:py-16 md:py-24 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1631486360162-27c02d76ef57?q=80&w=2070')",
        }}
      />
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4 sm:space-y-6"
        >
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            Luxury Transportation
            <span className="block text-secondary mt-2 font-medium">At Your Service</span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm sm:text-base md:text-xl mb-6 sm:mb-8 text-gray-300 max-w-2xl mx-auto leading-relaxed px-2"
          >
            Experience the epitome of comfort and elegance with our premium
            limousine service
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="px-4 sm:px-0"
          >
            <Button
              size="lg"
              className="bg-secondary text-primary hover:bg-secondary/90 ios-btn-active rounded-2xl px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg shadow-lg transition-all duration-300 w-full sm:w-auto"
              onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}
            >
              Book Your Ride
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};