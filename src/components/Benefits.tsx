import { motion } from "framer-motion";
import { Shield, Clock, Award, ThumbsUp } from "lucide-react";

export const Benefits = () => {
  const benefits = [
    {
      icon: <Shield className="w-8 h-8 text-secondary" />,
      title: "Safety First",
      description: "Professional drivers and well-maintained vehicles"
    },
    {
      icon: <Clock className="w-8 h-8 text-secondary" />,
      title: "Punctual Service",
      description: "Always on time, every time"
    },
    {
      icon: <Award className="w-8 h-8 text-secondary" />,
      title: "Premium Experience",
      description: "Luxury vehicles and exceptional service"
    },
    {
      icon: <ThumbsUp className="w-8 h-8 text-secondary" />,
      title: "Customer Satisfaction",
      description: "Dedicated to exceeding expectations"
    }
  ];

  return (
    <section className="py-12 sm:py-16 px-4 bg-gray-50/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-primary">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white text-center p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 ios-btn-active"
            >
              <div className="mb-4 sm:mb-6 flex justify-center">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-2xl">
                  {benefit.icon}
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-primary">
                {benefit.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};