import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-primary text-white py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold mb-6 text-secondary tracking-tight">DMBJ Transportation</h3>
          <p className="text-gray-300 leading-relaxed">
            Providing luxury transportation services with style and comfort.
          </p>
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold mb-6 text-secondary tracking-tight">Quick Links</h3>
          <ul className="space-y-4">
            <li>
              <Link to="/" className="text-gray-300 hover:text-secondary transition-colors duration-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/become-driver" className="text-gray-300 hover:text-secondary transition-colors duration-300">
                Become a Driver
              </Link>
            </li>
            <li>
              <Link 
                to="/login" 
                className="text-gray-300 hover:text-secondary transition-colors duration-300"
              >
                Login
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold mb-6 text-secondary tracking-tight">Contact Us</h3>
          <div className="space-y-4">
            <p className="text-gray-300">Email: info@dmbjtransportation.com</p>
            <p className="text-gray-300">Phone: (555) 123-4567</p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-700">
        <p className="text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} DMBJ Transportation. All rights reserved.
        </p>
      </div>
    </footer>
  );
};