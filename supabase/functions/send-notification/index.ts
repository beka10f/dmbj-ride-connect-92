import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: "booking" | "driver";
  data: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const emailRequest: EmailRequest = await req.json();
    
    // Get all drivers if it's a booking notification
    let driversToNotify: any[] = [];
    if (emailRequest.type === "booking") {
      const { data: drivers } = await supabase
        .from("profiles")
        .select("email")
        .eq("role", "driver");
      driversToNotify = drivers || [];
    }

    // Prepare email content based on type
    let emailContent;
    if (emailRequest.type === "booking") {
      emailContent = {
        from: "DMBJ Ride Connect <onboarding@resend.dev>",
        to: ["your-email@example.com", ...driversToNotify.map(d => d.email)],
        subject: "New Booking Request",
        html: `
          <h2>New Booking Request</h2>
          <p>Pickup: ${emailRequest.data.pickup_location}</p>
          <p>Dropoff: ${emailRequest.data.dropoff_location}</p>
          <p>Date: ${new Date(emailRequest.data.pickup_date).toLocaleString()}</p>
          ${emailRequest.data.special_instructions ? 
            `<p>Special Instructions: ${emailRequest.data.special_instructions}</p>` : ''}
        `,
      };
    } else {
      emailContent = {
        from: "DMBJ Ride Connect <onboarding@resend.dev>",
        to: ["your-email@example.com"],
        subject: "New Driver Application",
        html: `
          <h2>New Driver Application</h2>
          <p>Years of Experience: ${emailRequest.data.years_experience}</p>
          <p>License Number: ${emailRequest.data.license_number}</p>
          ${emailRequest.data.about_text ? 
            `<p>About: ${emailRequest.data.about_text}</p>` : ''}
        `,
      };
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailContent),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);