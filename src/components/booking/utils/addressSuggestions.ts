const NOMINATIM_API = "https://nominatim.openstreetmap.org/search";

export const getSuggestions = async (input: string): Promise<string[]> => {
  if (!input || input.length < 3) return [];
  
  try {
    const params = new URLSearchParams({
      q: input,
      format: 'json',
      limit: '5',
      addressdetails: '1',
    });

    const response = await fetch(`${NOMINATIM_API}?${params}`, {
      headers: {
        'Accept': 'application/json',
        // Add a user agent as requested by Nominatim's usage policy
        'User-Agent': 'RideBooking_App'
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch suggestions:', response.statusText);
      return [];
    }

    const data = await response.json();
    
    // Format the addresses from the response
    return data.map((result: any) => {
      const { address } = result;
      const parts = [
        address.road,
        address.house_number,
        address.city,
        address.state,
        address.country
      ].filter(Boolean);
      
      return parts.join(', ');
    });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};