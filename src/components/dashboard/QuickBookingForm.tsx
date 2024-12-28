import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddressAutocomplete } from "@/components/booking/AddressAutocomplete";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Car } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const QuickBookingForm = () => {
  const { profile } = useUserProfile();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pickup: "",
    dropoff: "",
    date: new Date(),
    time: "",
    vehicle: "",
  });

  const vehicles = [
    { id: "bmw", name: "BMW 5 Series", price: "Luxury Sedan" },
    { id: "mercedes", name: "Mercedes E-Class", price: "Executive" },
    { id: "tesla", name: "Tesla Model Y", price: "Electric SUV" },
  ];

  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return {
      value: `${hour.toString().padStart(2, "0")}:${minute}`,
      label: `${displayHour}:${minute} ${ampm}`,
    };
  });

  const handleSubmit = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("bookings").insert({
        user_id: profile.id,
        pickup_location: formData.pickup,
        dropoff_location: formData.dropoff,
        pickup_date: new Date(
          `${format(formData.date, "yyyy-MM-dd")}T${formData.time}`
        ).toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Booking Created",
        description: "Your booking has been successfully created.",
      });

      setFormData({
        pickup: "",
        dropoff: "",
        date: new Date(),
        time: "",
        vehicle: "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Car className="h-5 w-5" />
          Quick Booking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <AddressAutocomplete
            id="quick-pickup"
            label="Pickup Location"
            value={formData.pickup}
            onChange={(value) => setFormData({ ...formData, pickup: value })}
            placeholder="Enter pickup address"
          />

          <AddressAutocomplete
            id="quick-dropoff"
            label="Drop-off Location"
            value={formData.dropoff}
            onChange={(value) => setFormData({ ...formData, dropoff: value })}
            placeholder="Enter destination address"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? (
                      format(formData.date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) =>
                      setFormData({ ...formData, date: date || new Date() })
                    }
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Time</label>
              <Select
                value={formData.time}
                onValueChange={(value) => setFormData({ ...formData, time: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot.value} value={slot.value}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Vehicle</label>
              <Select
                value={formData.vehicle}
                onValueChange={(value) =>
                  setFormData({ ...formData, vehicle: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      <div className="flex justify-between items-center">
                        <span>{vehicle.name}</span>
                        <span className="text-sm text-gray-500">
                          {vehicle.price}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            className="w-full bg-primary hover:bg-primary/90"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Creating Booking..." : "Create Booking"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};