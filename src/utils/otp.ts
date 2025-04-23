
import { supabase } from "@/integrations/supabase/client";

// Generates a 6-digit random OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Sends OTP: stores it in Supabase 'otp_verification' table
export async function sendOTP(phoneNumber: string) {
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

  const { error } = await supabase
    .from("otp_verification")
    .insert([
      {
        phone_number: phoneNumber,
        otp,
        expires_at: expiresAt.toISOString(),
      },
    ]);

  if (error) throw new Error("Could not send OTP. Try again.");

  // In real app, send SMS here. For demo, just log OTP.
  console.log(`OTP for ${phoneNumber}: ${otp}`);

  return otp;
}

// Verifies OTP by checking against Supabase
export async function verifyOTP(phoneNumber: string, otp: string) {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("otp_verification")
    .select("*")
    .eq("phone_number", phoneNumber)
    .eq("otp", otp)
    .eq("verified", false)
    .lte("expires_at", new Date(Date.now() + 1 * 60 * 1000).toISOString()) // allow up to 1 minute after expiry for clock drift
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return false;

  // Mark OTP as used for security
  await supabase
    .from("otp_verification")
    .update({ verified: true })
    .eq("id", data.id);

  return true;
}
