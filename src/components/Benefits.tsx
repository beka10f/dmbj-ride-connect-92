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
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="mb-4 flex justify-center">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-primary">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};