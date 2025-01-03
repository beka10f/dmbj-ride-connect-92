import { memo, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressAutocompleteProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const AddressAutocomplete = ({
  id,
  label,
  value,
  onChange,
  placeholder,
}: AddressAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [localValue, setLocalValue] = useState(value);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (!inputRef.current || !window.google) return;

    // Create a new autocomplete instance for this specific input
    const newAutocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["address"],
        componentRestrictions: { country: "us" },
        fields: ["formatted_address"],
      }
    );

    // Store the autocomplete instance
    autocompleteRef.current = newAutocomplete;

    // Add place_changed listener specific to this instance
    const listener = newAutocomplete.addListener("place_changed", () => {
      const place = newAutocomplete.getPlace();
      if (place.formatted_address) {
        const newAddress = place.formatted_address;
        setLocalValue(newAddress);
        onChange(newAddress);
      }
    });

    // Cleanup on unmount
    return () => {
      if (listener) {
        google.maps.event.removeListener(listener);
      }
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
      autocompleteRef.current = null;
    };
  }, [onChange, id]); // Include id in dependencies to ensure unique instances

  // Sync with parent value when it changes
  useEffect(() => {
    if (value !== localValue) {
      setLocalValue(value);
    }
  }, [value]);

  // Handle manual input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        ref={inputRef}
        id={id}
        value={localValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="bg-white"
        autoComplete="off"
      />
    </div>
  );
};

// Ensure component only rerenders when props actually change
export default memo(AddressAutocomplete);