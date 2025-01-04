import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY')

    if (!GOOGLE_MAPS_API_KEY) {
      console.error('Google Maps API key not found in environment variables');
      return new Response(
        JSON.stringify({ error: 'Google Maps API key not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // If it's a GET request, return the API key
    if (req.method === 'GET') {
      console.log('Returning API key for Google Maps initialization');
      return new Response(
        JSON.stringify({ apiKey: GOOGLE_MAPS_API_KEY }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // For POST requests, expect input for place suggestions
    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      const input = body?.input;

      if (!input || input.length < 3) {
        console.log('Invalid or missing input parameter');
        return new Response(
          JSON.stringify({ 
            predictions: [],
            message: 'Input must be at least 3 characters long'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('Fetching suggestions for:', input);

      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input
      )}&components=country:us&key=${GOOGLE_MAPS_API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      console.log('Google Places API response status:', response.status);

      if (!data.predictions) {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response from Google Places API');
      }

      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // If neither GET nor POST
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in google-places function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})