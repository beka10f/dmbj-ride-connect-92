import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
}

interface SignUpFormFieldsProps {
  formData: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  error?: string;
}

export const SignUpFormFields = ({ formData, onChange, error }: SignUpFormFieldsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-gray-700">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            className="block w-full rounded-lg border-gray-300 shadow-sm"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-gray-700">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            className="block w-full rounded-lg border-gray-300 shadow-sm"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700">Email address</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
          className="block w-full rounded-lg border-gray-300 shadow-sm"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-700">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => onChange("password", e.target.value)}
          className="block w-full rounded-lg border-gray-300 shadow-sm"
          required
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        <p className="text-xs text-muted-foreground mt-1">
          Password must be at least 8 characters long and contain numbers, special characters, and uppercase letters.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          className="block w-full rounded-lg border-gray-300 shadow-sm"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role" className="text-gray-700">I want to</Label>
        <Select
          value={formData.role}
          onValueChange={(value) => onChange("role", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="client">Book Rides</SelectItem>
            <SelectItem value="driver">Become a Driver</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};