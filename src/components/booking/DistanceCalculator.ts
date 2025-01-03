export const calculateDistance = async (
  pickup: string,
  dropoff: string
): Promise<{ distance: string; cost: string }> => {
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
        if (status === "OK" && response) {
          const route = response.rows[0].elements[0];

          if (route.status === "OK") {
            const distance = route.distance.text;
            const distanceInMiles = route.distance.value / 1609.34;
            const rate = 5;
            const baseFee = 15;
            const cost = (distanceInMiles * rate + baseFee).toFixed(2);

            resolve({ 
              distance,
              cost: `$${cost}`
            });
          } else {
            reject(new Error("Unable to calculate distance"));
          }
        } else {
          reject(new Error("Error calculating distance"));
        }
      }
    );
  });
};