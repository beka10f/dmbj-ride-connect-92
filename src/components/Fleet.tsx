import { motion } from "framer-motion";
import { memo } from "react";

const cars = [
  {
    name: "BMW 5 Series",
    image: "https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?auto=format&fit=crop&w=800&q=80",
    description: "Executive sedan combining luxury and performance"
  },
  {
    name: "Mercedes E-Class",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80",
    description: "Sophisticated comfort with cutting-edge technology"
  },
  {
    name: "Tesla Model Y",
    image: "https://images.ctfassets.net/3xid768u5joa/4Swo3f7cYnwVLbKmZpsf3b/3f34d8f581b9bf9b0c0083ea4f165ec1/02._Solid_Black.jpg",
    description: "Electric SUV with advanced autopilot features"
  }
];

const CarCard = memo(({ car, index }: { car: typeof cars[0], index: number }) => (
  <motion.div
    key={car.name}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.2 }}
    className="bg-white rounded-3xl shadow-sm overflow-hidden ios-btn-active"
  >
    <div className="h-40 sm:h-48 md:h-56 overflow-hidden">
      <img
        src={car.image}
        alt={car.name}
        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
        loading={index === 0 ? "eager" : "lazy"}
      />
    </div>
    <div className="p-4 sm:p-5 md:p-6">
      <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-primary">{car.name}</h3>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{car.description}</p>
    </div>
  </motion.div>
));

CarCard.displayName = 'CarCard';

export const Fleet = memo(() => {
  return (
    <section id="fleet" className="py-8 sm:py-12 md:py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12 text-primary">Our Fleet</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {cars.map((car, index) => (
            <CarCard key={car.name} car={car} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
});

Fleet.displayName = 'Fleet';
