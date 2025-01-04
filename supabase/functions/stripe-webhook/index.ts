import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      throw new Error('No Stripe signature found');
    }

    const body = await req.text();
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new Error('Webhook secret not configured');
    }

    console.log('Processing webhook event...');
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    console.log('Webhook event type:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const bookingId = session.metadata?.booking_id;
      const paymentAmount = session.amount_total ? (session.amount_total / 100).toFixed(2) : '0.00';

      if (bookingId) {
        console.log(`Updating booking ${bookingId} with completed payment`);
        
        // First, get the booking details to include in the notification
        const { data: bookingData, error: bookingError } = await supabaseClient
          .from('bookings')
          .select('*, profiles:user_id(first_name, last_name)')
          .eq('id', bookingId)
          .single();

        if (bookingError) {
          console.error('Error fetching booking details:', bookingError);
          throw bookingError;
        }

        // Update the booking status
        const { error: updateError } = await supabaseClient
          .from('bookings')
          .update({ 
            payment_status: 'completed',
            payment_amount: paymentAmount,
            status: 'confirmed'
          })
          .eq('id', bookingId);

        if (updateError) {
          console.error('Error updating booking:', updateError);
          throw updateError;
        }

        // Get admin users to notify them
        const { data: adminUsers, error: adminError } = await supabaseClient
          .from('profiles')
          .select('id')
          .eq('role', 'admin');

        if (adminError) {
          console.error('Error fetching admin users:', adminError);
          throw adminError;
        }

        // Broadcast the payment confirmation to the admin channel
        const { error: broadcastError } = await supabaseClient
          .from('bookings')
          .insert({
            id: crypto.randomUUID(),
            user_id: adminUsers[0]?.id, // Send to first admin
            pickup_location: 'NOTIFICATION',
            dropoff_location: 'NOTIFICATION',
            pickup_date: new Date().toISOString(),
            status: 'notification',
            special_instructions: JSON.stringify({
              type: 'payment_confirmation',
              bookingId: bookingId,
              amount: paymentAmount,
              customerName: `${bookingData.profiles.first_name} ${bookingData.profiles.last_name}`,
              pickupLocation: bookingData.pickup_location,
              dropoffLocation: bookingData.dropoff_location
            })
          });

        if (broadcastError) {
          console.error('Error broadcasting notification:', broadcastError);
          throw broadcastError;
        }
        
        console.log(`Successfully updated booking ${bookingId} and sent notifications`);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Webhook error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});