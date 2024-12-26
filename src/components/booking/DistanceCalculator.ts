export const calculateDistance = async (pickup: string, dropoff: string) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${encodeURIComponent(
        pickup
      )}&destinations=${encodeURIComponent(
        dropoff
      )}&key=AIzaSyB46w_yxT1TE3wbnUntUVPh32SVyEecjN8`
    );

    if (!response.ok) {
      throw new Error("Error calculating distance");
    }

    const data = await response.json();
    if (data.rows[0].elements[0].status !== "OK") {
      throw new Error("Unable to calculate distance. Please check addresses.");
    }

    const distanceText = data.rows[0].elements[0].distance.text;
    const distanceValue = data.rows[0].elements[0].distance.value; // in meters
    const distanceInMiles = distanceValue / 1609.34;
    const rate = 3; // Rate per mile
    const totalCost = (distanceInMiles * rate).toFixed(2);

    return { distanceText, totalCost };
  } catch (error) {
    console.error("Error calculating distance:", error);
    throw error;
  }
};