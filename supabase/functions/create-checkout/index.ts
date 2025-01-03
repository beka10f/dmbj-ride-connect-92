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

    console.log('Received request:', { amount, customerDetails, bookingDetails });

    if (!amount || !customerDetails || !bookingDetails) {
      throw new Error('Missing required fields');
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Create booking in database first
    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .insert([
        {
          pickup_location: bookingDetails.pickup,
          dropoff_location: bookingDetails.dropoff,
          pickup_date: bookingDetails.dateTime,
          status: 'pending_payment',
          special_instructions: bookingDetails.special_instructions,
          payment_status: 'pending',
          payment_amount: parseFloat(amount)
        },
      ])
      .select()
      .single();

    if (bookingError) {
      console.error('Booking creation error:', bookingError);
      throw bookingError;
    }

    console.log('Created booking:', booking);

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
      success_url: `${req.headers.get('origin')}/dashboard?success=true&booking_id=${booking.id}`,
      cancel_url: `${req.headers.get('origin')}/?canceled=true`,
      metadata: {
        booking_id: booking.id,
        customer_name: customerDetails.name,
        customer_email: customerDetails.email,
        customer_phone: customerDetails.phone,
      },
    });

    console.log('Created checkout session:', session.id);

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