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

    // Prevent form submission on enter
    inputRef.current.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    });

    autocompleteListener.current = newAutocomplete.addListener("place_changed", () => {
      const place = newAutocomplete.getPlace();
      if (place.formatted_address) {
        onChange(place.formatted_address);
        // Force update input value
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

  // Ensure input value stays in sync with parent state
  useEffect(() => {
    if (inputRef.current && value !== inputRef.current.value) {
      inputRef.current.value = value;
    }
  }, [value]);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        ref={inputRef}
        id={id}
        defaultValue={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-white"
        autoComplete="off"
      />
    </div>
  );
};

export default memo(AddressAutocomplete);