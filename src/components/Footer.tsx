import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-primary text-white py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4 text-secondary">DMBJ Transportation</h3>
          <p className="text-gray-300">
            Providing luxury transportation services with style and comfort.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4 text-secondary">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="text-gray-300 hover:text-secondary transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/become-driver" className="text-gray-300 hover:text-secondary transition-colors">
                Become a Driver
              </Link>
            </li>
            <li>
              <Link to="/admin" className="text-gray-300 hover:text-secondary transition-colors">
                Admin Dashboard
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4 text-secondary">Contact Us</h3>
          <p className="text-gray-300">Email: info@dmbjtransportation.com</p>
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