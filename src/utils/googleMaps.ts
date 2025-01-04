import { supabase } from "@/integrations/supabase/client";

let googleMapsLoaded = false;

export const initGoogleMaps = async (): Promise<void> => {
  if (googleMapsLoaded) return;

  try {
    const { data, error } = await supabase.functions.invoke('get-google-maps-key');
    
    if (error) throw error;
    if (!data?.apiKey) throw new Error('No API key received');

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${data.apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    // Create a promise to wait for the script to load
    const loadPromise = new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = reject;
    });

    document.head.appendChild(script);
    await loadPromise;
    googleMapsLoaded = true;
  } catch (error) {
    console.error('Error loading Google Maps:', error);
    throw error;
  }
};