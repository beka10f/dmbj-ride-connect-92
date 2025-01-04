import { DistanceCalculation } from "@/types/booking";

const loadGoogleMapsScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps API'));
    document.head.appendChild(script);
  });
};

export const calculateDistance = async (pickup: string, dropoff: string): Promise<DistanceCalculation> => {
  try {
    await loadGoogleMapsScript();

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
              
              resolve({ 
                distanceText, 
                totalCost: `$${totalCost}` 
              });
            } else {
              reject(new Error('Unable to calculate distance. Please check addresses.'));
            }
          } else {
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