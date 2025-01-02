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

// Define time slots outside component to avoid recreation on every render
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

const BookingFormFields = ({
  formData,
  setFormData,
  onSubmit,
  loading,
}: BookingFormFieldsProps) => {
  const {
    name,
    email,
    phone,
    pickup,
    dropoff,
    passengers,
    date,
    time,
  } = formData;

  // Handle generic input changes by merging new field values into formData
  const handleChange =
    (field: keyof BookingFormFieldsProps["formData"]) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
    };

  return (
    <div className="space-y-6">
      {/* Grid Layout for Name, Email, Phone, and Passengers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={name}
            onChange={handleChange("name")}
            placeholder="John Doe"
          />
        </div>

        {/* Email Address */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={handleChange("email")}
            placeholder="john@example.com"
          />
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={handleChange("phone")}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        {/* Number of Passengers (Select) */}
        <div className="space-y-2">
          <Label htmlFor="passengers">Number of Passengers</Label>
          <Select
            value={passengers}
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

        {/* Pickup Location (using AddressAutocomplete) */}
        <AddressAutocomplete
          id="pickup"
          label="Pickup Location"
          value={pickup}
          onChange={(val) => setFormData({ ...formData, pickup: val })}
          placeholder="Enter pickup address"
        />

        {/* Drop-off Location (using AddressAutocomplete) */}
        <AddressAutocomplete
          id="dropoff"
          label="Drop-off Location"
          value={dropoff}
          onChange={(val) => setFormData({ ...formData, dropoff: val })}
          placeholder="Enter destination address"
        />

        {/* Date Selection (Popover + Calendar) */}
        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-white",
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
                onSelect={(newDate) => setFormData({ ...formData, date: newDate })}
                initialFocus
                // Prevent selecting dates in the past
                disabled={(d) => d < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Selection (Select) */}
        <div className="space-y-2">
          <Label>Pickup Time</Label>
          <Select
            value={time}
            onValueChange={(value) => setFormData({ ...formData, time: value })}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select pickup time">
                {time ? (
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    {timeSlots.find((slot) => slot.value === time)?.label}
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

      {/* Submit Button */}
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
