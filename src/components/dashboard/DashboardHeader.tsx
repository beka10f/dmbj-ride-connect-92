import { QuickBookingButton } from "./QuickBookingButton";

interface DashboardHeaderProps {
  firstName: string | null;
  role: string;
}

export const DashboardHeader = ({ firstName, role }: DashboardHeaderProps) => {
  return (
    <div className="border-b">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Welcome, {firstName || "User"}</h2>
          <p className="text-muted-foreground">
            {role === "admin" ? "Admin Dashboard" : "Your Dashboard"}
          </p>
        </div>
        {role === "client" && <QuickBookingButton />}
      </div>
    </div>
  );
};