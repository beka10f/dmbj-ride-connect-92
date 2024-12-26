import { User } from "lucide-react";

interface CustomerInfoProps {
  profile: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone: string | null;
  } | null;
}

export const CustomerInfo = ({ profile }: CustomerInfoProps) => {
  if (!profile) return null;
  
  return (
    <div className="space-y-2">
      <h3 className="font-medium flex items-center gap-2">
        <User className="h-4 w-4" />
        Customer Information
      </h3>
      <div className="pl-6 space-y-1">
        <p className="text-sm text-gray-600">
          Name: {profile.first_name} {profile.last_name}
        </p>
        <p className="text-sm text-gray-600">
          Email: {profile.email}
        </p>
        <p className="text-sm text-gray-600">
          Phone: {profile.phone || "Not provided"}
        </p>
      </div>
    </div>
  );
};