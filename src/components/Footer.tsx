import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-primary text-white py-8 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <div className="text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-bold mb-4 text-secondary">DMBJ Transportation</h3>
          <p className="text-sm sm:text-base text-gray-300">
            Providing luxury transportation services with style and comfort.
          </p>
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-bold mb-4 text-secondary">Quick Links</h3>
          <ul className="space-y-2 sm:space-y-3">
            <li>
              <Link to="/" className="text-sm sm:text-base text-gray-300 hover:text-secondary transition-colors ios-btn-active inline-block py-1">
                Home
              </Link>
            </li>
            <li>
              <Link to="/become-driver" className="text-sm sm:text-base text-gray-300 hover:text-secondary transition-colors ios-btn-active inline-block py-1">
                Become a Driver
              </Link>
            </li>
            <li>
              <Link 
                to="/login" 
                className="text-sm sm:text-base text-gray-300 hover:text-secondary transition-colors ios-btn-active inline-block py-1"
              >
                Login
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-bold mb-4 text-secondary">Contact Us</h3>
          <p className="text-sm sm:text-base text-gray-300 mb-2">Email: info@dmbjtransportation.com</p>
          <p className="text-sm sm:text-base text-gray-300">Phone: (555) 123-4567</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-700">
        <p className="text-center text-sm sm:text-base text-gray-300">
          © {new Date().getFullYear()} DMBJ Transportation. All rights reserved.
        </p>
      </div>
    </footer>
  );
};