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
  const [inputValue, setInputValue] = useState(value);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (!inputRef.current || !window.google) return;

    const newAutocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["address"],
        componentRestrictions: { country: "us" },
        fields: ["formatted_address"],
      }
    );

    autocompleteRef.current = newAutocomplete;

    const listener = newAutocomplete.addListener("place_changed", () => {
      const place = newAutocomplete.getPlace();
      if (place.formatted_address) {
        setInputValue(place.formatted_address);
        onChange(place.formatted_address);
      }
    });

    return () => {
      if (listener) {
        google.maps.event.removeListener(listener);
      }
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onChange]);

  // Sync input value with parent state
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Handle manual input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        ref={inputRef}
        id={id}
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="bg-white"
        autoComplete="off"
      />
    </div>
  );
};

export default memo(AddressAutocomplete);