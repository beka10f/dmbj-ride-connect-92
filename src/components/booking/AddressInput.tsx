import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { getSuggestions } from "./utils/addressSuggestions";
import { useDebounce } from "@/hooks/useDebounce";

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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debouncedValue = useDebounce(value, 300);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedValue.length >= 3) {
        setLoading(true);
        try {
          console.log('Fetching suggestions for:', debouncedValue);
          const newSuggestions = await getSuggestions(debouncedValue);
          console.log('Received suggestions:', newSuggestions);
          setSuggestions(newSuggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error getting suggestions:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [debouncedValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  return (
    <div className="space-y-2" ref={wrapperRef}>
      <Label htmlFor={id} className="text-base font-normal">
        {label}
      </Label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <MapPin className="h-5 w-5" />
        </div>
        <Input
          type="text"
          id={id}
          value={value}
          onChange={handleInputChange}
          onFocus={() => value.length >= 3 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="h-14 pl-12 text-gray-600 bg-white border border-gray-100 rounded-xl shadow-sm"
          disabled={disabled}
        />
        
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        )}
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg max-h-60 overflow-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-600 text-sm transition-colors"
                onClick={() => {
                  onChange(suggestion);
                  setShowSuggestions(false);
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default AddressInput;