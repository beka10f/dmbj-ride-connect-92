import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import * as OTPAuth from 'https://esm.sh/otpauth@9.1.4'

serve(async (req) => {
  try {
    const { token, secret } = await req.json()

    if (!token || !secret) {
      throw new Error('Token and secret are required')
    }

    const totp = new OTPAuth.TOTP({
      issuer: "YourApp",
      label: "YourApp",
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: secret
    });

    const isValid = totp.validate({ token, window: 1 }) !== null;

    if (!isValid) {
      throw new Error('Invalid token')
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})