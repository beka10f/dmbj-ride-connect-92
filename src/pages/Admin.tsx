import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email !== "DmbjTransportation@gmail.com") {
      toast({
        title: "Access Denied",
        description: "Invalid admin credentials",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Invalid credentials",
        variant: "destructive",
      });
      return;
    }

    if (data.user) {
      toast({
        title: "Success",
        description: "Welcome to the admin dashboard",
      });
      navigate("/admin");
    }
  };

  const metrics = [
    { title: "Total Drivers", value: "25", change: "+3 this month" },
    { title: "Pending Applications", value: "8", change: "5 new this week" },
    { title: "Ride Requests", value: "150", change: "+15% vs last month" },
    { title: "Completed Rides", value: "1,234", change: "+8% this month" },
  ];

  // Check if user is the admin
  const isAdminEmail = email === "DmbjTransportation@gmail.com";

  return (
    <div className="p-8">
      {!isAdminEmail ? (
        <div className="max-w-md mx-auto">
          <Card className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Card>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-8 text-primary">Admin Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric) => (
              <Card key={metric.title} className="p-6">
                <h3 className="text-lg font-medium text-gray-600">
                  {metric.title}
                </h3>
                <p className="text-3xl font-bold text-primary mt-2">
                  {metric.value}
                </p>
                <p className="text-sm text-gray-500 mt-2">{metric.change}</p>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Admin;