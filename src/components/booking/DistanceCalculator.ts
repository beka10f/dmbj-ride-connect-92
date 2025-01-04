import { DistanceCalculation } from "@/types/booking";
import { supabase } from "@/integrations/supabase/client";

// Function to load Google Maps API script
const loadGoogleMapsAPI = async (): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    if (window.google?.maps) {
      resolve();
      return;
    }

    try {
      // Call the Google Places Edge Function to get the API key
      const { data, error } = await supabase.functions.invoke('google-places', {
        method: 'GET',
      });

      if (error) throw error;

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${data.apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.addEventListener('load', () => resolve());
      script.addEventListener('error', () => reject(new Error('Failed to load Google Maps API')));

      document.head.appendChild(script);
    } catch (error) {
      console.error('Error loading Google Maps API:', error);
      reject(error);
    }
  });
};

export const calculateDistance = async (pickup: string, dropoff: string): Promise<DistanceCalculation> => {
  try {
    // Ensure Google Maps API is loaded
    await loadGoogleMapsAPI();

    return new Promise((resolve, reject) => {
      const service = new google.maps.DistanceMatrixService();
      
      service.getDistanceMatrix(
        {
          origins: [pickup],
          destinations: [dropoff],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.IMPERIAL,
        },
        (response, status) => {
          if (status === 'OK' && response) {
            const route = response.rows[0].elements[0];
            
            if (route.status === 'OK') {
              const distanceText = route.distance.text;
              const distanceValue = route.distance.value; // in meters
              const distanceInMiles = distanceValue / 1609.34;
              const rate = 5; // Rate per mile
              const baseFee = 15; // Base fee for all rides
              const totalCost = (distanceInMiles * rate + baseFee).toFixed(2);
              
              console.log('Distance calculation successful:', { distanceText, totalCost });
              
              resolve({ 
                distanceText, 
                totalCost: `$${totalCost}` 
              });
            } else {
              console.error('Route calculation failed:', route.status);
              reject(new Error('Unable to calculate distance. Please check addresses.'));
            }
          } else {
            console.error('Distance Matrix failed:', status);
            reject(new Error('Error calculating distance'));
          }
        }
      );
    });
  } catch (error) {
    console.error('Distance calculation error:', error);
    throw new Error('Failed to calculate distance');
  }
};