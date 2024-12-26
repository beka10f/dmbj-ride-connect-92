import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import BecomeDriver from "@/pages/BecomeDriver";
import Admin from "@/pages/Admin";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/become-driver" element={<BecomeDriver />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;