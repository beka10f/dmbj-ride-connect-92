import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const DriverForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { error } = await supabase.from("driver_applications").insert({
        user_id: user.id,
        years_experience: parseInt(formData.get("experience") as string),
        license_number: formData.get("license"),
        about_text: formData.get("about") || null,
      });

      if (error) throw error;

      // Update user role to driver
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ role: "driver" })
        .eq("id", user.id);

      if (profileError) throw profileError;

      toast({
        title: "Application Submitted",
        description: "Thank you for your interest! We'll review your application and contact you soon.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
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
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                name="experience"
                id="experience"
                required
                type="number"
                min="0"
                placeholder="Years of driving experience"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license">Driver's License Number</Label>
              <Input
                name="license"
                id="license"
                required
                placeholder="Enter your license number"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="about">Tell us about yourself</Label>
            <Input
              name="about"
              id="about"
              placeholder="Brief description of your experience and why you'd like to join us"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-secondary text-primary hover:bg-secondary/90"
          >
            Submit Application
          </Button>
        </form>
      </div>
    </div>
  );
};