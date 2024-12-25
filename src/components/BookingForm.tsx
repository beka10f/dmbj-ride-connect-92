import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

export const BookingForm = () => {
  const [date, setDate] = useState<Date>();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Booking Submitted",
      description: "We'll contact you shortly to confirm your reservation.",
    });
    // Reset form
    const form = e.target as HTMLFormElement;
    form.reset();
    setDate(undefined);
  };

  return (
    <div id="booking" className="bg-white py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-primary mb-8 text-center">
          Book Your Ride
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" required placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" required type="tel" placeholder="+1 (555) 000-0000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickup">Pickup Location</Label>
              <Input id="pickup" required placeholder="Enter pickup address" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dropoff">Drop-off Location</Label>
              <Input id="dropoff" required placeholder="Enter destination address" />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Pickup Time</Label>
              <Input id="time" required type="time" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Special Instructions</Label>
            <Input id="notes" placeholder="Any special requirements?" />
          </div>
          <Button
            type="submit"
            className="w-full bg-secondary text-primary hover:bg-secondary/90"
          >
            Submit Booking
          </Button>
        </form>
      </div>
    </div>
  );
};