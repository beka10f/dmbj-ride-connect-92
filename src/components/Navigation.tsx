import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Navigation = () => {
  return (
    <nav className="bg-primary text-white py-4 px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-secondary">
          DMBJ Transportation
        </Link>
        <div className="space-x-4">
          <Link to="/">
            <Button variant="ghost" className="text-white hover:text-secondary">
              Home
            </Button>
          </Link>
          <Link to="/become-driver">
            <Button variant="ghost" className="text-white hover:text-secondary">
              Become a Driver
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};