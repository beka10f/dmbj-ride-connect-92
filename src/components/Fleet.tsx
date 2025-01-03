import { motion } from "framer-motion";
import { memo } from "react";

const cars = [
  {
    name: "BMW 5 Series",
    image:
      "https://file.kelleybluebookimages.com/kbb/base/evox/CP/53203/2023-BMW-5%20Series-front_53203_032_1824x735_668_cropped.png",
    description: "Executive sedan combining luxury and performance",
  },
  {
    name: "Mercedes E-Class",
    image:
      "https://cdn-ds.com/stock/2024-Mercedes-Benz-C-Class-C-300-Morristown-NJ/seo/7444-W1KAF4HB4RR177343/sz_20550/ab43a4e6a0e960243eab31ffcbd53e3d.jpg",
    description: "Sophisticated comfort with cutting-edge technology",
  },
  {
    name: "Tesla Model Y",
    image:
      "https://images.ctfassets.net/3xid768u5joa/4Swo3f7cYnwVLbKmZpsf3b/3f34d8f581b9bf9b0c0083ea4f165ec1/02._Solid_Black.jpg",
    description: "Electric SUV with advanced autopilot features",
  },
];

const CarCard = memo(({ car, index }: { car: typeof cars[0]; index: number }) => (
  <motion.div
    key={car.name}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.2 }}
    className="bg-white rounded-3xl shadow-sm overflow-hidden ios-btn-active"
  >
    <div className={`flex items-center justify-center h-40 sm:h-48 md:h-56 overflow-hidden ${index === 1 ? 'px-4 py-2' : ''}`}>
      <img
        src={car.image}
        alt={car.name}
        className={`h-full transform hover:scale-105 transition-transform duration-300 ${
          index === 1 ? 'object-cover w-[90%] hover:scale-110' : 'object-contain'
        }`}
        loading={index === 0 ? "eager" : "lazy"}
      />
    </div>
    <div className="p-4 sm:p-5 md:p-6">
      <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-primary">
        {car.name}
      </h3>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
        {car.description}
      </p>
    </div>
  </motion.div>
));

CarCard.displayName = "CarCard";

const Fleet = memo(() => {
  return (
    <section id="fleet" className="py-8 sm:py-12 md:py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12 text-primary">
          Our Fleet
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {cars.map((car, index) => (
            <CarCard key={car.name} car={car} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
});

Fleet.displayName = "Fleet";

export default Fleet;