import { memo } from "react";
import { AddressInput } from "../AddressInput";

interface LocationFieldsProps {
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

const LocationFields = ({
  pickup,
  dropoff,
  onPickupChange,
  onDropoffChange,
  errors,
  disabled,
}: LocationFieldsProps) => {
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
      />
      <AddressInput
        id="dropoff"
        label="Drop-off Location"
        value={dropoff}
        onChange={onDropoffChange}
        placeholder="Enter destination address"
        error={errors?.dropoff}
        disabled={disabled}
      />
    </div>
  );
};

export default memo(LocationFields);