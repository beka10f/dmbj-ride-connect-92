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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          type="text"
          id={id}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`pl-10 ${error ? "border-red-500" : ""}`}
          disabled={disabled}
        />
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default AddressInput;