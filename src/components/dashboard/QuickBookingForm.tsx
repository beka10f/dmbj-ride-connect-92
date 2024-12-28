import { AddressAutocomplete } from "@/components/booking/AddressAutocomplete";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuickBooking } from "./useQuickBooking";
import { BookingConfirmationDialog } from "../booking/BookingConfirmationDialog";

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

interface QuickBookingFormProps {
  onSuccess?: () => void;
}

export const QuickBookingForm = ({ onSuccess }: QuickBookingFormProps) => {
  const {
    formData,
    setFormData,
    loading,
    showConfirmation,
    setShowConfirmation,
    bookingDetails,
    handleSubmit,
    handleConfirmBooking,
  } = useQuickBooking(onSuccess);

  return (
    <>
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
                <SelectValue placeholder="Select time">
                  {formData.time ? (
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      {timeSlots.find((slot) => slot.value === formData.time)?.label}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>Select time</span>
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
          className="w-full bg-primary hover:bg-primary/90"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creating Booking..." : "Create Booking"}
        </Button>
      </div>

      <BookingConfirmationDialog
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowConfirmation}
        bookingDetails={bookingDetails}
        onConfirm={handleConfirmBooking}
      />
    </>
  );
};