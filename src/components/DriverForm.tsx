import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export const DriverForm = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Application Submitted",
      description: "Thank you for your interest! We'll review your application and contact you soon.",
    });
    // Reset form
    const form = e.target as HTMLFormElement;
    form.reset();
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
              <Input id="driverName" required placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="driverPhone">Phone Number</Label>
              <Input
                id="driverPhone"
                required
                type="tel"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="driverEmail">Email</Label>
              <Input
                id="driverEmail"
                required
                type="email"
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                required
                type="number"
                min="0"
                placeholder="Years of driving experience"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="license">Driver's License Number</Label>
            <Input id="license" required placeholder="Enter your license number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="about">Tell us about yourself</Label>
            <Input
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