import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { event_type, action, details, user_id, timestamp } = await req.json();

    // Store audit log in the database
    const { error } = await supabaseClient
      .from('audit_logs')
      .insert([
        {
          event_type,
          action,
          details,
          user_id,
          timestamp,
        },
      ]);

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ message: 'Audit log recorded successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error recording audit log:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to record audit log' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});