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
import { Card } from "@/components/ui/card";

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
  setFormData: (dataOrField: BookingFormData | keyof BookingFormData, value?: any) => void;
  onSubmit: () => void;
  loading: boolean;
  distance: string;
  cost: string;
  errors?: Partial<Record<keyof BookingFormData, string>>;
}

const BookingFormFields = ({
  formData,
  setFormData,
  onSubmit,
  loading,
  distance,
  cost,
  errors,
}: BookingFormFieldsProps) => {
  const handleFieldChange = (field: keyof BookingFormData, value: any) => {
    setFormData(field, value);
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
          errors={errors}
        />

        <AddressFields
          pickup={formData.pickup}
          dropoff={formData.dropoff}
          onPickupChange={(value) => handleFieldChange("pickup", value)}
          onDropoffChange={(value) => handleFieldChange("dropoff", value)}
          errors={errors}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-white",
                  !formData.date && "text-muted-foreground",
                  errors?.date && "border-red-500"
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
                onSelect={(newDate) => handleFieldChange("date", newDate || new Date())}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
          {errors?.date && (
            <p className="text-sm text-red-500">{errors.date}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Pickup Time</label>
          <Select
            value={formData.time}
            onValueChange={(value) => handleFieldChange("time", value)}
          >
            <SelectTrigger className={cn(
              "bg-white",
              errors?.time && "border-red-500"
            )}>
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
          {errors?.time && (
            <p className="text-sm text-red-500">{errors.time}</p>
          )}
        </div>
      </div>

      {(distance || cost) && (
        <Card className="p-4 bg-gray-50">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Trip Details</h3>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Distance:</span>
              <span className="font-medium">{distance}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Estimated Cost:</span>
              <span className="font-medium">{cost}</span>
            </div>
          </div>
        </Card>
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