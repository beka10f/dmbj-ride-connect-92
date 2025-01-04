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
import { useQueryClient } from "@tanstack/react-query";
import { RealtimeChannel } from "@supabase/supabase-js";

type BookingNotification = {
  pickup_location: string;
  dropoff_location: string;
  status: string;
  special_instructions: string;
}

interface NotificationData {
  type: 'payment' | 'booking';
  data: any;
  time: string;
}

export const NotificationBell = () => {
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const bookingsChannel: RealtimeChannel = supabase
      .channel('bookings_channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        (payload) => {
          console.log("Received booking update:", payload);
          const newBooking = payload.new as BookingNotification;
          
          if (newBooking && 
              newBooking.pickup_location === 'NOTIFICATION' && 
              newBooking.status === 'notification') {
            try {
              const notificationData = JSON.parse(newBooking.special_instructions);
              if (notificationData.type === 'payment_confirmation') {
                setHasNewNotifications(true);
                toast({
                  title: "Payment Confirmed",
                  description: `Payment of $${notificationData.amount} received for booking from ${notificationData.customerName}`,
                });
                setNotifications(prev => [{
                  type: 'payment',
                  data: notificationData,
                  time: new Date().toISOString()
                }, ...prev]);
                
                queryClient.invalidateQueries({ queryKey: ['bookings'] });
              }
            } catch (e) {
              console.error("Error parsing notification data:", e);
            }
          } else if (newBooking) {
            setHasNewNotifications(true);
            toast({
              title: "New Booking",
              description: `New booking received from ${newBooking.pickup_location} to ${newBooking.dropoff_location}`,
            });
            setNotifications(prev => [{
              type: 'booking',
              data: newBooking,
              time: new Date().toISOString()
            }, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(bookingsChannel);
    };
  }, [toast, queryClient]);

  const formatNotificationMessage = (notification: NotificationData) => {
    if (notification.type === 'payment') {
      return `Payment of $${notification.data.amount} received from ${notification.data.customerName}`;
    }
    return `Booking from ${notification.data.pickup_location} to ${notification.data.dropoff_location}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative" 
          size="icon" 
          onClick={() => setHasNewNotifications(false)}
        >
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
                {notification.type === 'payment' ? 'Payment Confirmed' : 'New Booking'}
              </div>
              <div className="text-sm text-muted-foreground">
                {formatNotificationMessage(notification)}
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