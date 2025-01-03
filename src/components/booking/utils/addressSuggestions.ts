const NOMINATIM_API = "https://nominatim.openstreetmap.org/search";

export const getSuggestions = async (input: string): Promise<string[]> => {
  if (!input || input.length < 3) return [];
  
  try {
    const params = new URLSearchParams({
      q: input,
      format: 'json',
      limit: '5',
      addressdetails: '1',
      countrycodes: 'us', // Limit to US addresses
      featuretype: 'street,house,building,residential', // Specific types of locations
    });

    const response = await fetch(`${NOMINATIM_API}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'RideBooking_App'
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch suggestions:', response.statusText);
      return [];
    }

    const data = await response.json();
    
    // Format the addresses to be more specific and readable
    return data.map((result: any) => {
      const { address } = result;
      const parts = [];
      
      // Build address string with specific components
      if (address.house_number) parts.push(address.house_number);
      if (address.road) parts.push(address.road);
      if (address.suburb) parts.push(address.suburb);
      if (address.city || address.town) parts.push(address.city || address.town);
      if (address.state) parts.push(address.state);
      if (address.postcode) parts.push(address.postcode);
      
      return parts.join(', ');
    }).filter(Boolean); // Remove any empty strings
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};