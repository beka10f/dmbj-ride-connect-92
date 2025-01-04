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
    const { input } = await req.json()
    const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY')

    if (!GOOGLE_MAPS_API_KEY) {
      console.error('Google Maps API key not configured')
      throw new Error('Google Maps API key not configured')
    }

    if (!input || input.length < 3) {
      return new Response(
        JSON.stringify({ predictions: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Fetching suggestions for:', input)

    const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json')
    url.searchParams.append('input', input)
    url.searchParams.append('components', 'country:us')
    url.searchParams.append('key', GOOGLE_MAPS_API_KEY)

    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      console.error('Google Places API error:', data)
      throw new Error('Failed to fetch suggestions from Google Places API')
    }

    console.log('Google Places API response:', data)

    if (!data.predictions) {
      console.error('Invalid response format:', data)
      throw new Error('Invalid response from Google Places API')
    }

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        status: 'error'
      }),
      { 
        status: 200, // Return 200 even for errors to prevent CORS issues
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})