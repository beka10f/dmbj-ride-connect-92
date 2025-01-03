import { memo } from "react";
import AddressInput from "../AddressInput";

interface AddressFieldsProps {
  pickup: string;
  dropoff: string;
  onPickupChange: (value: string) => void;
  onDropoffChange: (value: string) => void;
  errors?: {
    pickup?: string;
    dropoff?: string;
  };
  disabled?: boolean;
}

const AddressFields = ({
  pickup,
  dropoff,
  onPickupChange,
  onDropoffChange,
  errors,
  disabled,
}: AddressFieldsProps) => {
  return (
    <div className="space-y-4">
      <AddressInput
        id="pickup"
        label="Pickup Location"
        value={pickup}
        onChange={onPickupChange}
        placeholder="Enter pickup address"
        error={errors?.pickup}
        disabled={disabled}
        enableSuggestions={true}
      />
      <AddressInput
        id="dropoff"
        label="Drop-off Location"
        value={dropoff}
        onChange={onDropoffChange}
        placeholder="Enter destination address"
        error={errors?.dropoff}
        disabled={disabled}
        enableSuggestions={true}
      />
    </div>
  );
};

export default memo(AddressFields);