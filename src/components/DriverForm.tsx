import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const DriverForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Rate limiting check
    const now = Date.now();
    const timeSinceLastSubmit = now - lastSubmitTime;
    if (timeSinceLastSubmit < 60000) { // 60 seconds
      toast({
        title: "Please wait",
        description: `You can submit again in ${Math.ceil((60000 - timeSinceLastSubmit) / 1000)} seconds.`,
        variant: "destructive",
      });
      return;
    }

    if (loading) return;
    setLoading(true);
    setLastSubmitTime(now);

    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      // Create the driver application
      const { error: applicationError } = await supabase
        .from("driver_applications")
        .insert({
          years_experience: parseInt(formData.get("experience") as string),
          license_number: formData.get("license") as string,
          about_text: formData.get("about") as string,
        });

      if (applicationError) {
        console.error("Application error:", applicationError);
        throw new Error("Failed to submit application");
      }

      toast({
        title: "Application Submitted",
        description: "Thank you for your interest! We'll review your application and contact you soon.",
      });
      navigate("/");
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit application. Please try again.",
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