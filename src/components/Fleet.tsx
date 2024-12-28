import { motion } from "framer-motion";

export const Fleet = () => {
  const cars = [
    {
      name: "BMW 7 Series",
      image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1974",
      description: "Luxury and comfort for executive travel"
    },
    {
      name: "Mercedes S-Class",
      image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=2071",
      description: "Premium elegance and sophistication"
    },
    {
      name: "Tesla Model S",
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2071",
      description: "Sustainable luxury and cutting-edge technology"
    }
  ];

  return (
    <section id="fleet" className="py-8 sm:py-12 md:py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12 text-primary">Our Fleet</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {cars.map((car, index) => (
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
                />
              </div>
              <div className="p-4 sm:p-5 md:p-6">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-primary">{car.name}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{car.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};