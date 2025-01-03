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
  setFormData: (dataOrField: BookingFormData | keyof BookingFormData, value?: any) => void;
  onSubmit: () => void;
  loading: boolean;
  distance: string;
  cost: string;
  errors?: Partial<Record<keyof BookingFormData, string>>;
  showTripDetails?: boolean;
}

const BookingFormFields = ({
  formData,
  setFormData,
  onSubmit,
  loading,
  distance,
  cost,
  errors,
  showTripDetails = false,
}: BookingFormFieldsProps) => {
  const handleFieldChange = (field: keyof BookingFormData, value: any) => {
    setFormData(field, value);
  };

  return (
    <div className="space-y-6">
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

      {showTripDetails && distance && cost && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <p className="text-sm text-gray-600">Trip Details:</p>
          <div className="flex justify-between">
            <span className="text-sm">Distance:</span>
            <span className="font-medium">{distance}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Estimated Cost:</span>
            <span className="font-medium">{cost}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-12 justify-start text-left font-normal bg-white border border-gray-100 rounded-xl shadow-sm w-full",
                !formData.date && "text-gray-500"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
              {formData.date ? format(formData.date, "MMMM do, yyyy") : "Select date"}
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

        <Select
          value={formData.time}
          onValueChange={(value) => handleFieldChange("time", value)}
        >
          <SelectTrigger className="h-12 bg-white border border-gray-100 rounded-xl shadow-sm">
            <div className="flex items-center text-gray-500">
              <Clock className="mr-2 h-4 w-4 text-gray-400" />
              {formData.time ? (
                timeSlots.find((slot) => slot.value === formData.time)?.label
              ) : (
                "Select pickup time"
              )}
            </div>
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

      <Button
        type="button"
        className="w-full h-12 bg-[#B69F80] hover:bg-[#A38E6F] text-white rounded-xl transition-all duration-200 ease-in-out shadow-sm"
        disabled={loading || !formData.pickup || !formData.dropoff}
        onClick={onSubmit}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            <span>Processing...</span>
          </div>
        ) : (
          "Book Now"
        )}
      </Button>
    </div>
  );
};

export default memo(BookingFormFields);