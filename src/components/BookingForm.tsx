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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const BookingForm = () => {
  const [date, setDate] = useState<Date>();
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState<string>("");
  const [cost, setCost] = useState<string>("");
  const { toast } = useToast();

  const calculateRide = async (formData: FormData) => {
    const pickup = formData.get("pickup") as string;
    const dropoff = formData.get("dropoff") as string;
    const rate = 3; // Rate per mile

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${encodeURIComponent(
          pickup
        )}&destinations=${encodeURIComponent(
          dropoff
        )}&key=AIzaSyB46w_yxT1TE3wbnUntUVPh32SVyEecjN8`
      );

      if (!response.ok) {
        throw new Error("Error calculating distance");
      }

      const data = await response.json();
      if (data.rows[0].elements[0].status !== "OK") {
        throw new Error("Unable to calculate distance. Please check addresses.");
      }

      const distanceText = data.rows[0].elements[0].distance.text;
      const distanceValue = data.rows[0].elements[0].distance.value; // in meters
      const distanceInMiles = distanceValue / 1609.34;
      const totalCost = (distanceInMiles * rate).toFixed(2);

      setDistance(distanceText);
      setCost(`$${totalCost}`);
      return { distanceText, totalCost };
    } catch (error) {
      console.error("Error calculating ride:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const { distanceText, totalCost } = await calculateRide(formData);

      toast({
        title: "Booking Submitted",
        description: `Distance: ${distanceText} | Estimated Cost: $${totalCost}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to calculate ride. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
              <Input id="name" name="name" required placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                required
                type="tel"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passengers">Number of Passengers</Label>
              <Select name="passengers" defaultValue="1">
                <SelectTrigger>
                  <SelectValue placeholder="Select passengers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Passenger</SelectItem>
                  <SelectItem value="2">2 Passengers</SelectItem>
                  <SelectItem value="3">3 Passengers</SelectItem>
                  <SelectItem value="4">4 Passengers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickup">Pickup Location</Label>
              <Input
                id="pickup"
                name="pickup"
                required
                placeholder="Enter pickup address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dropoff">Drop-off Location</Label>
              <Input
                id="dropoff"
                name="dropoff"
                required
                placeholder="Enter destination address"
              />
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
              <Input id="time" name="time" required type="time" />
            </div>
          </div>

          {(distance || cost) && (
            <div className="p-4 bg-secondary/20 rounded-lg space-y-2">
              <p className="text-sm font-medium">
                Estimated Distance: {distance}
              </p>
              <p className="text-sm font-medium">
                Estimated Cost: {cost}
              </p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-secondary text-primary hover:bg-secondary/90"
            disabled={loading}
          >
            {loading ? "Calculating..." : "Submit Booking"}
          </Button>
        </form>
      </div>
    </div>
  );
};