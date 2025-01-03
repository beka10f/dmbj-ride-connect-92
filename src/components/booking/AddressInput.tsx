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
  disabled?: boolean;
}

const AddressInput = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  disabled,
}: AddressInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const initializeAutocomplete = useCallback(() => {
    if (!inputRef.current || !window.google) return;

    // Cleanup previous instance
    if (autocompleteRef.current) {
      google.maps.event.clearInstanceListeners(autocompleteRef.current);
    }

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["address"],
        componentRestrictions: { country: "us" },
        fields: ["formatted_address"],
      }
    );

    const listener = autocompleteRef.current.addListener(
      "place_changed",
      () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.formatted_address) {
          console.log(`Place selected for ${id}:`, place.formatted_address);
          onChange(place.formatted_address);
        }
      }
    );

    return () => {
      if (listener) google.maps.event.removeListener(listener);
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [id, onChange]);

  // Initialize Autocomplete
  useEffect(() => {
    const cleanup = initializeAutocomplete();
    return () => cleanup?.();
  }, [initializeAutocomplete]);

  // Sync input value with state
  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== value) {
      inputRef.current.value = value;
    }
  }, [value]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(`Manual input change for ${id}:`, e.target.value);
      onChange(e.target.value);
    },
    [onChange, id]
  );

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
          disabled={disabled}
          autoComplete="off"
        />
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default memo(AddressInput);