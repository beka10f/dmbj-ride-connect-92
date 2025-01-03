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
}

const AddressFields = ({
  pickup,
  dropoff,
  onPickupChange,
  onDropoffChange,
  errors,
}: AddressFieldsProps) => {
  return (
    <>
      <AddressInput
        id="pickup"
        label="Pickup Location"
        value={pickup}
        onChange={onPickupChange}
        placeholder="Enter pickup address"
        error={errors?.pickup}
        enableSuggestions={true}
      />
      <AddressInput
        id="dropoff"
        label="Drop-off Location"
        value={dropoff}
        onChange={onDropoffChange}
        placeholder="Enter destination address"
        error={errors?.dropoff}
        enableSuggestions={false}
      />
    </>
  );
};

export default AddressFields;