import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

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
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onFieldChange("name", e.target.value)}
          placeholder="John Doe"
          className={errors?.name ? "border-red-500" : ""}
        />
        {errors?.name && (
          <p className="text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onFieldChange("email", e.target.value)}
          placeholder="john@example.com"
          className={errors?.email ? "border-red-500" : ""}
        />
        {errors?.email && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => onFieldChange("phone", e.target.value)}
          placeholder="+1 (555) 000-0000"
          className={errors?.phone ? "border-red-500" : ""}
        />
        {errors?.phone && (
          <p className="text-sm text-red-500">{errors.phone}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="passengers">Number of Passengers</Label>
        <Select
          value={passengers}
          onValueChange={(value) => onFieldChange("passengers", value)}
        >
          <SelectTrigger 
            id="passengers" 
            className={cn(
              "bg-white",
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
        {errors?.passengers && (
          <p className="text-sm text-red-500">{errors.passengers}</p>
        )}
      </div>
    </>
  );
};

export default PersonalInfoFields;