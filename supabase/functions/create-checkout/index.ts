import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, customerDetails, bookingDetails } = await req.json();

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Get user session if available
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabaseClient.auth.getUser(token);
      if (user) {
        userId = user.id;
      }
    }

    // Create booking in database
    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .insert([
        {
          user_id: userId,
          pickup_location: bookingDetails.pickup,
          dropoff_location: bookingDetails.dropoff,
          pickup_date: new Date(bookingDetails.dateTime).toISOString(),
          status: 'pending_payment',
          special_instructions: `Guest Booking - Name: ${customerDetails.name}, Phone: ${customerDetails.phone}`,
        },
      ])
      .select()
      .single();

    if (bookingError) {
      throw bookingError;
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: customerDetails.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Ride Booking',
              description: `From ${bookingDetails.pickup} to ${bookingDetails.dropoff}`,
            },
            unit_amount: Math.round(parseFloat(amount) * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/?success=true&booking_id=${booking.id}`,
      cancel_url: `${req.headers.get('origin')}/?canceled=true`,
      metadata: {
        booking_id: booking.id,
        customer_name: customerDetails.name,
        customer_email: customerDetails.email,
        customer_phone: customerDetails.phone,
      },
    });

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});