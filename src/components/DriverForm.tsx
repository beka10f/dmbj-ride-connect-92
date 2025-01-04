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
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const email = formData.get("email") as string;
      const password = crypto.randomUUID().slice(0, 8); // Generate a random password

      // First, create an auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: "driver",
          },
        },
      });

      if (authError || !authData.user) {
        console.error("Auth error:", authError);
        throw new Error("Failed to create user account");
      }

      // Wait for the profile to be available
      const waitForProfile = async (userId: string, attempts = 0): Promise<void> => {
        if (attempts > 5) throw new Error("Profile creation timeout");
        
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select()
          .eq("id", userId)
          .single();
        
        if (profileError || !profile) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return waitForProfile(userId, attempts + 1);
        }
      };

      // Wait for profile to be created by the trigger
      await waitForProfile(authData.user.id);

      // Update the profile with additional information
      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({
          first_name: formData.get("name")?.toString().split(" ")[0],
          last_name: formData.get("name")?.toString().split(" ").slice(1).join(" "),
          phone: formData.get("phone") as string,
        })
        .eq("id", authData.user.id);

      if (profileUpdateError) {
        console.error("Profile update error:", profileUpdateError);
        throw new Error("Failed to update profile information");
      }

      // Now create the driver application
      const { error: applicationError } = await supabase
        .from("driver_applications")
        .insert({
          user_id: authData.user.id,
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
        description: "Thank you for your interest! We'll review your application and contact you soon. Check your email for account details.",
      });
      navigate("/");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
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