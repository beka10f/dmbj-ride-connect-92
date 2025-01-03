import { useEffect, useRef, useCallback, memo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

interface AddressInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

const AddressInput = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
}: AddressInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const isPlaceSelectionRef = useRef(false);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPlaceSelectionRef.current) {
      console.log(`Manual input change for ${id}:`, e.target.value);
      onChange(e.target.value);
    }
    isPlaceSelectionRef.current = false;
  }, [onChange, id]);

  // Initialize and cleanup Autocomplete
  useEffect(() => {
    if (!inputRef.current || !window.google) return;

    // Cleanup previous instance
    if (autocompleteRef.current) {
      google.maps.event.clearInstanceListeners(autocompleteRef.current);
      autocompleteRef.current = null;
    }

    // Initialize new autocomplete instance
    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["address"],
        componentRestrictions: { country: "us" },
        fields: ["formatted_address"],
      }
    );

    const listener = autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace();
      if (place?.formatted_address) {
        console.log(`Place selected for ${id}:`, place.formatted_address);
        isPlaceSelectionRef.current = true;
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
  }, [onChange, id]);

  // Sync input value with state
  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== value) {
      console.log(`Syncing input value for ${id}:`, value);
      inputRef.current.value = value;
    }
  }, [value, id]);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          id={id}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`pl-10 ${error ? "border-red-500" : ""}`}
          autoComplete="off"
        />
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default memo(AddressInput);