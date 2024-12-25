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
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import type { TablesInsert } from "@/integrations/supabase/types";

export const BookingForm = () => {
  const [date, setDate] = useState<Date>();
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

      if (!date) {
        toast({
          title: "Error",
          description: "Please select a date",
          variant: "destructive",
        });
        return;
      }

      const bookingData: TablesInsert<"bookings"> = {
        user_id: user.id,
        pickup_location: formData.get("pickup") as string,
        dropoff_location: formData.get("dropoff") as string,
        pickup_date: new Date(
          `${format(date, "yyyy-MM-dd")}T${formData.get("time")}`
        ).toISOString(),
        special_instructions: formData.get("notes")?.toString() || null,
      };

      const { error } = await supabase.from("bookings").insert(bookingData);

      if (error) throw error;

      toast({
        title: "Booking Submitted",
        description: "We'll contact you shortly to confirm your reservation.",
      });
      
      form.reset();
      setDate(undefined);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error submitting your booking. Please try again.",
        variant: "destructive",
      });
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
              <Label htmlFor="pickup">Pickup Location</Label>
              <Input name="pickup" id="pickup" required placeholder="Enter pickup address" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dropoff">Drop-off Location</Label>
              <Input name="dropoff" id="dropoff" required placeholder="Enter destination address" />
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
              <Input name="time" id="time" required type="time" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Special Instructions</Label>
            <Input name="notes" id="notes" placeholder="Any special requirements?" />
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