import { supabase } from "@/integrations/supabase/client";

export const getSuggestions = async (input: string): Promise<string[]> => {
  if (!input || input.length < 3) {
    return [];
  }

  try {
    console.log('Fetching suggestions for:', input);
    
    const { data, error } = await supabase.functions.invoke('google-places', {
      body: { input }
    });
    
    if (error) {
      console.error('Error fetching Google Places suggestions:', error);
      return [];
    }

    console.log('Google Places API response:', data);

    if (!data?.predictions || !Array.isArray(data.predictions)) {
      console.warn('Invalid response format:', data);
      return [];
    }

    return data.predictions.map((prediction: any) => prediction.description);
  } catch (error) {
    console.error('Error in Google Places API call:', error);
    return [];
  }
};