import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
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
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Full Name
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            id="name"
            value={name}
            onChange={(e) => onFieldChange("name", e.target.value)}
            placeholder="John Doe"
            className={cn(
              "pl-10 bg-white",
              errors?.name ? "border-red-500" : ""
            )}
          />
        </div>
        {errors?.name && (
          <p className="text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onFieldChange("email", e.target.value)}
            placeholder="john@example.com"
            className={cn(
              "pl-10 bg-white",
              errors?.email ? "border-red-500" : ""
            )}
          />
        </div>
        {errors?.email && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium">
          Phone Number
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => onFieldChange("phone", e.target.value)}
            placeholder="+1 (555) 000-0000"
            className={cn(
              "pl-10 bg-white",
              errors?.phone ? "border-red-500" : ""
            )}
          />
        </div>
        {errors?.phone && (
          <p className="text-sm text-red-500">{errors.phone}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="passengers" className="text-sm font-medium">
          Number of Passengers
        </Label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Select
            value={passengers}
            onValueChange={(value) => onFieldChange("passengers", value)}
          >
            <SelectTrigger 
              id="passengers" 
              className={cn(
                "pl-10 bg-white",
                errors?.passengers && "border-red-500"
              )}
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
        {errors?.passengers && (
          <p className="text-sm text-red-500">{errors.passengers}</p>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoFields;