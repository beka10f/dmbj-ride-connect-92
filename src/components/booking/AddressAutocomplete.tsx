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
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (!inputRef.current || !window.google || isInitialized) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["address"],
        componentRestrictions: { country: "us" },
        fields: ["formatted_address"],
      }
    );

    const placeChangedListener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        onChange(place.formatted_address);
      }
    });

    autocompleteRef.current = autocomplete;
    setIsInitialized(true);

    return () => {
      if (placeChangedListener) {
        google.maps.event.removeListener(placeChangedListener);
      }
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
      autocompleteRef.current = null;
      setIsInitialized(false);
    };
  }, [id, onChange]);

  // Keep input value in sync with prop
  useEffect(() => {
    if (inputRef.current && value !== inputRef.current.value) {
      inputRef.current.value = value;
    }
  }, [value]);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          ref={inputRef}
          id={id}
          defaultValue={value}
          placeholder={placeholder}
          className={`bg-white pl-10 ${error ? "border-red-500" : ""}`}
          autoComplete="off"
        />
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default AddressAutocomplete;
