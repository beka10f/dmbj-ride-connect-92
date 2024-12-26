import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-primary text-white py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold mb-4 text-secondary">DMBJ Transportation</h3>
          <p className="text-gray-300">
            Providing luxury transportation services with style and comfort.
          </p>
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold mb-4 text-secondary">Quick Links</h3>
          <ul className="space-y-3">
            <li>
              <Link to="/" className="text-gray-300 hover:text-secondary transition-colors ios-btn-active inline-block py-1">
                Home
              </Link>
            </li>
            <li>
              <Link to="/become-driver" className="text-gray-300 hover:text-secondary transition-colors ios-btn-active inline-block py-1">
                Become a Driver
              </Link>
            </li>
            <li>
              <Link 
                to="/login" 
                className="text-gray-300 hover:text-secondary transition-colors ios-btn-active inline-block py-1"
              >
                Login
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold mb-4 text-secondary">Contact Us</h3>
          <p className="text-gray-300 mb-2">Email: info@dmbjtransportation.com</p>
          <p className="text-gray-300">Phone: (555) 123-4567</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-700">
        <p className="text-center text-gray-300">
          © {new Date().getFullYear()} DMBJ Transportation. All rights reserved.
        </p>
      </div>
    </footer>
  );
};