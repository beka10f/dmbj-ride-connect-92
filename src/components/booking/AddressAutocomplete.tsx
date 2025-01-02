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
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  // Keep a reference to the listener for cleanup
  const autocompleteListener = useRef<google.maps.MapsEventListener | null>(null);

  useEffect(() => {
    if (!inputRef.current || !window.google) return;

    // Clean up any previous instance
    if (autocomplete) {
      google.maps.event.clearInstanceListeners(autocomplete);
    }

    const newAutocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
      componentRestrictions: { country: "us" },
      fields: ["formatted_address"],
    });

    // Register the place_changed listener
    autocompleteListener.current = newAutocomplete.addListener("place_changed", () => {
      const place = newAutocomplete.getPlace();
      if (place.formatted_address) {
        // Update parent state
        onChange(place.formatted_address);

        // Also update the raw input field
        if (inputRef.current) {
          inputRef.current.value = place.formatted_address;
        }
      }
    });

    setAutocomplete(newAutocomplete);

    // Cleanup when component unmounts or re-inits
    return () => {
      if (autocompleteListener.current) {
        google.maps.event.removeListener(autocompleteListener.current);
      }
      if (autocomplete) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [onChange]);

  // Also handle manual typing in the input
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
