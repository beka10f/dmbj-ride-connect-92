import { supabase } from "@/integrations/supabase/client";

export const getSuggestions = async (input: string, type: 'osm' | 'google' = 'osm'): Promise<string[]> => {
  if (type === 'google') {
    try {
      const { data, error } = await supabase.functions.invoke('google-places', {
        body: { input }
      });
      
      if (error) {
        console.error('Error fetching Google Places suggestions:', error);
        return [];
      }

      return data.predictions.map((prediction: any) => prediction.description);
    } catch (error) {
      console.error('Error in Google Places API call:', error);
      return [];
    }
  } else {
    // OSM suggestions
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          input
        )}&limit=5`
      );
      const data = await response.json();
      return data.map(
        (item: any) =>
          `${item.address.road || ''}, ${item.address.city || ''}, ${
            item.address.state || ''
          }, ${item.address.country || ''}, ${item.address.postcode || ''}`
      );
    } catch (error) {
      console.error('Error in OSM API call:', error);
      return [];
    }
  }
};