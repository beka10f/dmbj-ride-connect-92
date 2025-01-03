import AddressAutocomplete from "../AddressAutocomplete";
import { BookingFormData } from "../useBookingForm";

interface AddressFieldsProps {
  pickup: string;
  dropoff: string;
  onPickupChange: (value: string) => void;
  onDropoffChange: (value: string) => void;
}

const AddressFields = ({
  pickup,
  dropoff,
  onPickupChange,
  onDropoffChange,
}: AddressFieldsProps) => {
  return (
    <>
      <AddressAutocomplete
        id="pickup"
        label="Pickup Location"
        value={pickup}
        onChange={onPickupChange}
        placeholder="Enter pickup address"
      />
      <AddressAutocomplete
        id="dropoff"
        label="Drop-off Location"
        value={dropoff}
        onChange={onDropoffChange}
        placeholder="Enter destination address"
      />
    </>
  );
};

export default AddressFields;