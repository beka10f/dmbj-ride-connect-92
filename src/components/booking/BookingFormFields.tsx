import { memo } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddressFields from "./form-fields/AddressFields";
import PersonalInfoFields from "./form-fields/PersonalInfoFields";
import { BookingFormData } from "./useBookingForm";

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
  formData: BookingFormData;
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
  distance,
  cost,
}: BookingFormFieldsProps) => {
  const handleFieldChange = (field: keyof BookingFormData, value: string) => {
    setFormData((prev: BookingFormData) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <PersonalInfoFields
          name={formData.name}
          email={formData.email}
          phone={formData.phone}
          passengers={formData.passengers}
          onFieldChange={handleFieldChange}
        />

        <AddressFields
          pickup={formData.pickup}
          dropoff={formData.dropoff}
          onPickupChange={(value) => handleFieldChange("pickup", value)}
          onDropoffChange={(value) => handleFieldChange("dropoff", value)}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">Date</label>
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
                {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={(newDate) =>
                  setFormData((prev: BookingFormData) => ({
                    ...prev,
                    date: newDate || new Date(),
                  }))
                }
                initialFocus
                disabled={(d) => d < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Pickup Time</label>
          <Select
            value={formData.time}
            onValueChange={(value) =>
              setFormData((prev: BookingFormData) => ({
                ...prev,
                time: value,
              }))
            }
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

      {(distance || cost) && (
        <div className="flex justify-between text-sm">
          <span>Distance: {distance}</span>
          <span>Estimated Cost: {cost}</span>
        </div>
      )}

      <Button
        type="button"
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