import { supabase } from "@/integrations/supabase/client";

export const getSuggestions = async (input: string): Promise<string[]> => {
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
};