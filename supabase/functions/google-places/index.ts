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
    console.log('Request method:', req.method)

    if (!GOOGLE_MAPS_API_KEY) {
      console.error('Google Maps API key not found')
      return new Response(
        JSON.stringify({ 
          error: 'Google Maps API key not configured',
          success: false 
        }),
        { 
          status: 500,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          }
        }
      )
    }

    // Handle GET request for API key
    if (req.method === 'GET') {
      console.log('Processing GET request for API key')
      return new Response(
        JSON.stringify({ 
          success: true,
          apiKey: GOOGLE_MAPS_API_KEY 
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      )
    }

    // Handle POST request for place suggestions
    if (req.method === 'POST') {
      console.log('Processing POST request for place suggestions')
      const body = await req.json()
      const input = body?.input

      if (!input || input.length < 3) {
        return new Response(
          JSON.stringify({ 
            success: false,
            predictions: [],
            message: 'Input must be at least 3 characters long' 
          }),
          { 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        )
      }

      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input
      )}&components=country:us&key=${GOOGLE_MAPS_API_KEY}`

      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) {
        console.error('Google Places API error:', data)
        throw new Error('Failed to fetch places data')
      }

      if (!data.predictions) {
        console.error('Invalid response format:', data)
        throw new Error('Invalid response from Google Places API')
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          ...data 
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      )
    }

    // Handle unsupported methods
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Method not allowed' 
      }),
      { 
        status: 405,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    )
  }
})