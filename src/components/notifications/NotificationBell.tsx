import { useState, useEffect } from "react";
import { Bell, BellDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const NotificationBell = () => {
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Listen for new bookings
    const bookingsChannel = supabase
      .channel('bookings_channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bookings' },
        (payload) => {
          setHasNewNotifications(true);
          toast({
            title: "New Booking",
            description: `New booking received from ${payload.new.pickup_location} to ${payload.new.dropoff_location}`,
          });
          setNotifications(prev => [{
            type: 'booking',
            data: payload.new,
            time: new Date().toISOString()
          }, ...prev]);
        }
      )
      .subscribe();

    // Listen for new driver applications
    const applicationsChannel = supabase
      .channel('applications_channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'driver_applications' },
        (payload) => {
          setHasNewNotifications(true);
          toast({
            title: "New Driver Application",
            description: "A new driver has applied to join the platform",
          });
          setNotifications(prev => [{
            type: 'application',
            data: payload.new,
            time: new Date().toISOString()
          }, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(bookingsChannel);
      supabase.removeChannel(applicationsChannel);
    };
  }, [toast]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative" size="icon" onClick={() => setHasNewNotifications(false)}>
          {hasNewNotifications ? <BellDot className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {notifications.length === 0 ? (
          <DropdownMenuItem className="text-center text-muted-foreground">
            No new notifications
          </DropdownMenuItem>
        ) : (
          notifications.map((notification, index) => (
            <DropdownMenuItem key={index} className="flex flex-col items-start p-4">
              <div className="font-semibold">
                {notification.type === 'booking' ? 'New Booking' : 'New Driver Application'}
              </div>
              <div className="text-sm text-muted-foreground">
                {notification.type === 'booking' 
                  ? `From ${notification.data.pickup_location} to ${notification.data.dropoff_location}`
                  : 'New driver application received'}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {new Date(notification.time).toLocaleString()}
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};