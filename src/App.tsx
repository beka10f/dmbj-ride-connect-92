import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
