import { Link } from "react-router-dom";

export const Navigation = () => {
  return (
    <nav className="bg-primary text-white py-4 px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-secondary">
          DMBJ Transportation
        </Link>
        <div className="space-x-4">
          <Link to="/" className="text-white hover:text-secondary transition-colors">
            Home
          </Link>
          <Link to="/become-driver" className="text-white hover:text-secondary transition-colors">
            Become a Driver
          </Link>
          <Link to="/login" className="text-white hover:text-secondary transition-colors">
            Login / Register
          </Link>
        </div>
      </div>
    </nav>
  );
};