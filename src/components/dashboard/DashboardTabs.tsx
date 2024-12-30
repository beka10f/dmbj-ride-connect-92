import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingsTable } from "./BookingsTable";
import { ApplicationsTable } from "./ApplicationsTable";

interface DashboardTabsProps {
  isAdmin: boolean;
  bookings: any[];
  driverApplications: any[];
  onBookingUpdated: () => void;
}

export const DashboardTabs = ({ isAdmin, bookings, driverApplications, onBookingUpdated }: DashboardTabsProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4">
      <Tabs defaultValue="bookings" className="space-y-6">
        <TabsList className="w-full flex space-x-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
          <TabsTrigger 
            value="bookings"
            className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:shadow-sm"
          >
            Bookings
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger 
              value="applications"
              className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:shadow-sm"
            >
              Applications
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="bookings" className="space-y-4 pt-2">
          <BookingsTable 
            bookings={bookings} 
            onBookingUpdated={onBookingUpdated}
          />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="applications" className="space-y-4 pt-2">
            <ApplicationsTable applications={driverApplications} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};