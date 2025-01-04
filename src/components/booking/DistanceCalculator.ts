import { DistanceCalculation } from "@/types/booking";

export const calculateDistance = async (pickup: string, dropoff: string): Promise<DistanceCalculation> => {
  return new Promise((resolve, reject) => {
    try {
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
    } catch (error) {
      console.error('Distance calculation error:', error);
      reject(new Error('Failed to calculate distance'));
    }
  });
};