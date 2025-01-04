import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { initGoogleMaps } from "@/utils/googleMaps";
import { getSuggestions } from "./utils/addressSuggestions";

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  id?: string;
  error?: string;
  disabled?: boolean;
}

const AddressInput = ({ 
  value, 
  onChange, 
  placeholder, 
  label,
  id,
  error,
  disabled 
}: AddressInputProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    initGoogleMaps()
      .then(() => setIsLoading(false))
      .catch(console.error);
  }, []);

  if (isLoading) {
    return <Input value={value} disabled placeholder="Loading Google Maps..." />;
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (newValue.length >= 3) {
      const newSuggestions = await getSuggestions(newValue);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      {label && <label className="block text-sm font-medium mb-1" htmlFor={id}>{label}</label>}
      <Input
        type="text"
        id={id}
        value={value}
        onChange={handleInputChange}
        onFocus={() => value.length >= 3 && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder={placeholder}
        className={`w-full ${error ? 'border-red-500' : ''}`}
        disabled={disabled}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { AddressInput };