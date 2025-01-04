import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as OTPAuth from 'https://esm.sh/otpauth@9.1.4'

serve(async (req) => {
  try {
    // Generate new TOTP secret
    const totp = new OTPAuth.TOTP({
      issuer: "YourApp",
      label: "YourApp",
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.generate()
    });

    // Generate QR code URL
    const qrCode = totp.toString();

    return new Response(
      JSON.stringify({
        secret: totp.secret.base32,
        qrCode
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})