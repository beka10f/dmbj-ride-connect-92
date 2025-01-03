import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Phone, Users } from "lucide-react";

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="relative">
        <Label htmlFor="name" className="text-sm font-medium">
          Full Name
        </Label>
        <div className="relative mt-1">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="name"
            value={name}
            onChange={(e) => onFieldChange("name", e.target.value)}
            placeholder="John Doe"
            className="h-12 pl-10 text-gray-600 bg-white border border-gray-100 rounded-xl shadow-sm"
          />
        </div>
        {errors?.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div className="relative">
        <Label htmlFor="email" className="text-sm font-medium">
          Email Address
        </Label>
        <div className="relative mt-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onFieldChange("email", e.target.value)}
            placeholder="john@example.com"
            className="h-12 pl-10 text-gray-600 bg-white border border-gray-100 rounded-xl shadow-sm"
          />
        </div>
        {errors?.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
      </div>

      <div className="relative">
        <Label htmlFor="phone" className="text-sm font-medium">
          Phone Number
        </Label>
        <div className="relative mt-1">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => onFieldChange("phone", e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="h-12 pl-10 text-gray-600 bg-white border border-gray-100 rounded-xl shadow-sm"
          />
        </div>
        {errors?.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
      </div>

      <div className="relative">
        <Label htmlFor="passengers" className="text-sm font-medium">
          Passengers
        </Label>
        <div className="relative mt-1">
          <Select
            value={passengers}
            onValueChange={(value) => onFieldChange("passengers", value)}
          >
            <SelectTrigger 
              id="passengers"
              className="h-12 pl-10 text-gray-600 bg-white border border-gray-100 rounded-xl shadow-sm"
            >
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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
        {errors?.passengers && <p className="text-xs text-red-500 mt-1">{errors.passengers}</p>}
      </div>
    </div>
  );
};

export default PersonalInfoFields;