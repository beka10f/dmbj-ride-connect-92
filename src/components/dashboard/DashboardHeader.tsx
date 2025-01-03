import { QuickBookingButton } from "./QuickBookingButton";

interface DashboardHeaderProps {
  firstName: string | null;
  role: string;
}

export const DashboardHeader = ({ firstName, role }: DashboardHeaderProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Welcome, {firstName || "User"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {role === "admin" ? "Admin Dashboard" : "Your Dashboard"}
          </p>
        </div>
        {role === "client" && <QuickBookingButton />}
      </div>
    </div>
  );
};