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

  // Keep a local reference to the Google Autocomplete instance.
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  // Use a ref to store the place_changed event listener for cleanup.
  const autocompleteListener = useRef<google.maps.MapsEventListener | null>(null);

  useEffect(() => {
    // If there's no Google or no input, do nothing.
    if (!inputRef.current || !window.google) return;

    // Clear any previous listeners to avoid duplicates.
    if (autocomplete) {
      google.maps.event.clearInstanceListeners(autocomplete);
    }

    // Initialize a new Autocomplete instance.
    const newAutocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["address"],
        componentRestrictions: { country: "us" },
        fields: ["formatted_address"],
      }
    );

    // Register the 'place_changed' listener on the new instance.
    autocompleteListener.current = newAutocomplete.addListener(
      "place_changed",
      () => {
        const place = newAutocomplete.getPlace();
        // If a formatted address is available, update via onChange.
        if (place.formatted_address) {
          onChange(place.formatted_address);

          // Also update the actual DOM element to reflect the chosen address.
          if (inputRef.current) {
            inputRef.current.value = place.formatted_address;
          }
        }
      }
    );

    setAutocomplete(newAutocomplete);

    // Cleanup when effect re-runs or component unmounts.
    return () => {
      if (autocompleteListener.current) {
        google.maps.event.removeListener(autocompleteListener.current);
      }
      if (autocomplete) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
    // We only depend on `onChange` here
    // to avoid recreating the instance unnecessarily.
  }, [onChange]);

  /**
   * Handle user-typed input changes. This ensures the parent component
   * is updated immediately, maintaining a controlled component.
   */
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
