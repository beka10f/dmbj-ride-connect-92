import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import type { TablesInsert } from "@/integrations/supabase/types";

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

      const applicationData: TablesInsert<"driver_applications"> = {
        user_id: user.id,
        years_experience: parseInt(formData.get("experience") as string),
        license_number: formData.get("license") as string,
        about_text: formData.get("about")?.toString() || null,
      };

      const { error } = await supabase
        .from("driver_applications")
        .insert(applicationData);

      if (error) throw error;

      // Send email notification
      const { error: emailError } = await supabase.functions.invoke('send-notification', {
        body: { type: 'driver', data: applicationData }
      });

      if (emailError) {
        console.error('Error sending email:', emailError);
      }

      toast({
        title: "Application Submitted",
        description: "We'll review your application and get back to you soon.",
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
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
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
                type="number"
                min="0"
                required
                placeholder="Enter years of experience"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license">Driver's License Number</Label>
              <Input
                name="license"
                id="license"
                required
                placeholder="Enter license number"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="about">About You</Label>
            <Textarea
              name="about"
              id="about"
              placeholder="Tell us about your experience and why you'd like to join our team"
              className="min-h-[100px]"
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