import { supabase } from "@/integrations/supabase/client";

export const getGoogleSuggestions = async (input: string): Promise<string[]> => {
  if (!input) return [];

  try {
    const { data, error } = await supabase.functions.invoke('google-places', {
      body: { input }
    });

    if (error) throw error;

    return data.predictions.map((prediction: any) => prediction.description);
  } catch (error) {
    console.error('Error fetching Google Places suggestions:', error);
    return [];
  }
}