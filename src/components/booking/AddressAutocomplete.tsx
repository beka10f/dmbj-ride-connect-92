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
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const autocompleteListener = useRef<google.maps.MapsEventListener | null>(null);

  useEffect(() => {
    if (!inputRef.current || !window.google) return;

    // Cleanup previous instance
    if (autocomplete) {
      google.maps.event.clearInstanceListeners(autocomplete);
    }

    const newAutocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
      componentRestrictions: { country: "us" },
      fields: ["formatted_address"],
    });

    // Add place_changed listener
    autocompleteListener.current = newAutocomplete.addListener("place_changed", () => {
      const place = newAutocomplete.getPlace();
      if (place.formatted_address) {
        // Directly call onChange with the formatted address
        onChange(place.formatted_address);
        
        // Update the input value to match the selected address
        if (inputRef.current) {
          inputRef.current.value = place.formatted_address;
        }
      }
    });

    setAutocomplete(newAutocomplete);

    return () => {
      if (autocompleteListener.current) {
        google.maps.event.removeListener(autocompleteListener.current);
      }
      if (autocomplete) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [onChange]);

  // Handle manual input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        ref={inputRef}
        id={id}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="bg-white"
        autoComplete="off"
      />
    </div>
  );
};

export default memo(AddressAutocomplete);