import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";

interface PersonalInfoFieldsProps {
  name: string;
  email: string;
  phone: string;
  passengers: string;
  onFieldChange: (field: string, value: string) => void;
  errors?: {
    name?: string;
    email?: string;
    phone?: string;
    passengers?: string;
  };
}

const PersonalInfoFields = ({
  name,
  email,
  phone,
  passengers,
  onFieldChange,
  errors,
}: PersonalInfoFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-base font-normal">
          Full Name
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onFieldChange("name", e.target.value)}
          placeholder="John Doe"
          className="h-14 text-gray-600 bg-white border border-gray-100 rounded-xl shadow-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-base font-normal">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onFieldChange("email", e.target.value)}
          placeholder="john@example.com"
          className="h-14 text-gray-600 bg-white border border-gray-100 rounded-xl shadow-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-base font-normal">
          Phone Number
        </Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => onFieldChange("phone", e.target.value)}
          placeholder="+1 (555) 000-0000"
          className="h-14 text-gray-600 bg-white border border-gray-100 rounded-xl shadow-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="passengers" className="text-base font-normal">
          Number of Passengers
        </Label>
        <Select
          value={passengers}
          onValueChange={(value) => onFieldChange("passengers", value)}
        >
          <SelectTrigger 
            id="passengers"
            className="h-14 text-gray-600 bg-white border border-gray-100 rounded-xl shadow-sm"
          >
            <SelectValue placeholder="Select passengers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Passenger</SelectItem>
            <SelectItem value="2">2 Passengers</SelectItem>
            <SelectItem value="3">3 Passengers</SelectItem>
            <SelectItem value="4">4 Passengers</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PersonalInfoFields;