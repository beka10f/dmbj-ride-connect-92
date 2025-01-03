import { supabase } from "@/integrations/supabase/client";

export const getGoogleSuggestions = async (input: string): Promise<string[]> => {
  if (!input || input.length < 3) return [];

  try {
    console.log('Fetching Google Places suggestions for:', input);
    
    const { data, error } = await supabase.functions.invoke('google-places', {
      body: { input }
    });

    if (error) {
      console.error('Error from Google Places function:', error);
      return [];
    }

    console.log('Google Places response:', data);

    if (!data?.predictions) {
      console.warn('No predictions in response:', data);
      return [];
    }

    return data.predictions.map((prediction: any) => prediction.description);
  } catch (error) {
    console.error('Error fetching Google Places suggestions:', error);
    return [];
  }
};