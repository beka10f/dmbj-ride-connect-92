import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export const useDashboardData = (profileId: string | undefined, role: string | undefined) => {
  const queryClient = useQueryClient();

  // Set up real-time subscription for data updates
  useEffect(() => {
    if (!profileId) return;

    const channel = supabase
      .channel('dashboard_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings'
      }, () => {
        // Invalidate and refetch queries when data changes
        queryClient.invalidateQueries({ queryKey: ['bookings', profileId, role] });
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'driver_applications'
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['driverApplications', profileId, role] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profileId, role, queryClient]);

  const bookingsQuery = useQuery({
    queryKey: ['bookings', profileId, role],
    queryFn: async () => {
      if (!profileId) {
        console.log("No profile ID available, skipping bookings fetch");
        return [];
      }

      console.log("Fetching bookings for profile:", profileId, "with role:", role);
      let query = supabase.from("bookings").select("*");

      if (role === 'client') {
        query = query.eq('user_id', profileId);
      } else if (role === 'driver') {
        query = query.eq('assigned_driver_id', profileId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Bookings fetch error:", error);
        throw error;
      }
      
      console.log("Fetched bookings:", data);
      return data || [];
    },
    enabled: !!profileId,
    staleTime: 1000 * 30, // Consider data fresh for 30 seconds
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const applicationsQuery = useQuery({
    queryKey: ['driverApplications', profileId, role],
    queryFn: async () => {
      if (role !== "admin") {
        console.log("User is not admin, skipping applications fetch");
        return [];
      }
      
      console.log("Fetching driver applications");
      const { data, error } = await supabase
        .from("driver_applications")
        .select("*");

      if (error) {
        console.error("Applications fetch error:", error);
        throw error;
      }
      
      console.log("Fetched applications:", data);
      return data || [];
    },
    enabled: role === "admin",
    staleTime: 1000 * 30, // Consider data fresh for 30 seconds
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  return {
    bookings: bookingsQuery.data || [],
    applications: applicationsQuery.data || [],
    isLoading: bookingsQuery.isLoading || applicationsQuery.isLoading,
    bookingsError: bookingsQuery.error,
    applicationsError: applicationsQuery.error,
    refetchBookings: bookingsQuery.refetch,
  };
};