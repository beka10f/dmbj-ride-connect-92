import { motion } from "framer-motion";

export const Fleet = () => {
  const cars = [
    {
      name: "BMW 5 Series",
      image: "https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?q=80&w=2070",
      description: "Executive sedan combining luxury and performance"
    },
    {
      name: "Mercedes E-Class",
      image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070",
      description: "Sophisticated comfort with cutting-edge technology"
    },
    {
      name: "Tesla Model Y",
      image: "https://images.unsplash.com/photo-1619872644704-c136f11b4a50?q=80&w=2070",
      description: "Electric SUV with advanced autopilot features"
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