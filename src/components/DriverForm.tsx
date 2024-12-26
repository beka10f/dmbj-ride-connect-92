import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const DriverForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        toast({
          title: "Error",
          description: "Please sign in to submit a driver application",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      const { error: applicationError } = await supabase.from("driver_applications").insert({
        user_id: session.session.user.id,
        years_experience: parseInt(formData.get("experience") as string),
        license_number: formData.get("license"),
        about_text: formData.get("about"),
      });

      if (applicationError) {
        console.error("Application error:", applicationError);
        toast({
          title: "Error",
          description: "Failed to submit application. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Application Submitted",
        description: "Thank you for your interest! We'll review your application and contact you soon.",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="driver" className="bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-primary mb-8 text-center">
          Become a Driver
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="driverName">Full Name</Label>
              <Input id="driverName" name="name" required placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="driverPhone">Phone Number</Label>
              <Input
                id="driverPhone"
                name="phone"
                required
                type="tel"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="driverEmail">Email</Label>
              <Input
                id="driverEmail"
                name="email"
                required
                type="email"
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                name="experience"
                required
                type="number"
                min="0"
                placeholder="Years of driving experience"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="license">Driver's License Number</Label>
            <Input 
              id="license" 
              name="license" 
              required 
              placeholder="Enter your license number" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="about">Tell us about yourself</Label>
            <Input
              id="about"
              name="about"
              placeholder="Brief description of your experience and why you'd like to join us"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-secondary text-primary hover:bg-secondary/90"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </div>
    </div>
  );
};