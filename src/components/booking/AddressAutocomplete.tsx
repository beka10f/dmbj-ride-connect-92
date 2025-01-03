import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

interface AddressAutocompleteProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
}

const AddressAutocomplete = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
}: AddressAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [localValue, setLocalValue] = useState(value);

  // Sync local state with prop value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (!inputRef.current || !window.google) return;

    // Create new autocomplete instance
    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["address"],
        componentRestrictions: { country: "us" },
        fields: ["formatted_address"],
      }
    );

    // Add place_changed listener
    const listener = autocompleteRef.current.addListener("place_changed", () => {
      if (!autocompleteRef.current) return;
      
      const place = autocompleteRef.current.getPlace();
      if (place.formatted_address) {
        setLocalValue(place.formatted_address);
        onChange(place.formatted_address);
      }
    });

    // Cleanup function
    return () => {
      if (listener) {
        google.maps.event.removeListener(listener);
      }
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
      autocompleteRef.current = null;
    };
  }, [onChange]);

  // Handle manual input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    // Only update parent state if user is typing manually
    if (!autocompleteRef.current?.getPlace()) {
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          ref={inputRef}
          id={id}
          value={localValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`bg-white pl-10 ${error ? 'border-red-500' : ''}`}
          autoComplete="off"
        />
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default AddressAutocomplete;