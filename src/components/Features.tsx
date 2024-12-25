import { Car, Clock, Shield, Star } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: Car,
      title: "Luxury Fleet",
      description: "Choose from our premium selection of high-end vehicles",
    },
    {
      icon: Clock,
      title: "24/7 Service",
      description: "Available round the clock for your transportation needs",
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Professional drivers and top-tier safety measures",
    },
    {
      icon: Star,
      title: "Premium Experience",
      description: "Unmatched comfort and service quality",
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Why Choose Us
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience luxury transportation with our premium service offerings
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <feature.icon className="w-12 h-12 text-secondary mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};