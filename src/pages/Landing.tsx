import { Hero } from "@/components/Hero";
import { BookingForm } from "@/components/BookingForm";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-primary mb-4">
              Luxury Fleet
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our selection of premium vehicles including BMW 5 Series,
              Mercedes, and Tesla Model Y for an exceptional riding experience.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "BMW 5 Series",
                description: "Perfect blend of luxury and performance",
              },
              {
                title: "Mercedes",
                description: "Ultimate comfort and sophistication",
              },
              {
                title: "Tesla Model Y",
                description: "Sustainable luxury with cutting-edge technology",
              },
            ].map((car) => (
              <motion.div
                key={car.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {car.title}
                </h3>
                <p className="text-gray-600">{car.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <BookingForm />
    </div>
  );
};

export default LandingPage;