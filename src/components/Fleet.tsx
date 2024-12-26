import { motion } from "framer-motion";

export const Fleet = () => {
  const cars = [
    {
      name: "Luxury Sedan",
      image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1974",
      description: "Perfect for business travel and special occasions"
    },
    {
      name: "Executive SUV",
      image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=2071",
      description: "Spacious comfort for group travel"
    },
    {
      name: "Premium Van",
      image: "https://images.unsplash.com/photo-1631486360162-27c02d76ef57?q=80&w=2070",
      description: "Ideal for larger groups and airport transfers"
    }
  ];

  return (
    <section id="fleet" className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">Our Fleet</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cars.map((car, index) => (
            <motion.div
              key={car.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-primary">{car.name}</h3>
                <p className="text-gray-600">{car.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};