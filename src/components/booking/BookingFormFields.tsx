import { memo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AddressAutocomplete from "./AddressAutocomplete";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface BookingFormFieldsProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    pickup: string;
    dropoff: string;
    passengers: string;
    date: Date | undefined;
    time: string;
  };
  setFormData: (data: any) => void;
  onSubmit: () => void;
  loading: boolean;
  distance: string;
  cost: string;
}

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

export const BookingFormFields = ({
  formData,
  setFormData,
  onSubmit,
  loading,
}: BookingFormFieldsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="passengers">Number of Passengers</Label>
          <Select
            value={formData.passengers}
            onValueChange={(value) =>
              setFormData({ ...formData, passengers: value })
            }
          >
            <SelectTrigger id="passengers" className="bg-white">
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

        <AddressAutocomplete
          id="pickup"
          label="Pickup Location"
          value={formData.pickup}
          onChange={(value) => setFormData({ ...formData, pickup: value })}
          placeholder="Enter pickup address"
        />

        <AddressAutocomplete
          id="dropoff"
          label="Drop-off Location"
          value={formData.dropoff}
          onChange={(value) => setFormData({ ...formData, dropoff: value })}
          placeholder="Enter destination address"
        />

        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-white",
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
                onSelect={(date) => setFormData({ ...formData, date })}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Pickup Time</Label>
          <Select
            value={formData.time}
            onValueChange={(value) => setFormData({ ...formData, time: value })}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select pickup time">
                {formData.time ? (
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    {timeSlots.find((slot) => slot.value === formData.time)?.label}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Select pickup time</span>
                  </div>
                )}
              </SelectValue>
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
      </div>

      <Button
        type="submit"
        className="w-full bg-secondary text-primary hover:bg-secondary/90"
        disabled={loading}
        onClick={onSubmit}
      >
        {loading ? "Calculating..." : "Submit Booking"}
      </Button>
    </div>
  );
};

export default memo(BookingFormFields);
