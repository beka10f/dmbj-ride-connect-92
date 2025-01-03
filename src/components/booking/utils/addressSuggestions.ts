import { supabase } from "@/integrations/supabase/client";

export const getSuggestions = async (input: string): Promise<string[]> => {
  try {
    console.log('Fetching suggestions for:', input);
    
    const { data, error } = await supabase.functions.invoke('google-places', {
      body: { input }
    });
    
    if (error) {
      console.error('Error fetching Google Places suggestions:', error);
      return [];
    }

    if (!data.predictions) {
      console.error('Invalid response format:', data);
      return [];
    }

    const suggestions = data.predictions.map((prediction: any) => prediction.description);
    console.log('Received suggestions:', suggestions);
    return suggestions;
  } catch (error) {
    console.error('Error in Google Places API call:', error);
    return [];
  }
};