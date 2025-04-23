
import { supabase } from "@/integrations/supabase/client";

// Generates a 6-digit random OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Sends OTP: stores it in Supabase 'otp_verification' table
export async function sendOTP(email: string) {
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

  const { error } = await supabase
    .from("otp_verification")
    .insert({
      email,
      otp,
      expires_at: expiresAt.toISOString(),
    });

  if (error) throw new Error("Could not send OTP. Try again.");

  // In real app, send Email OTP here. For demo, just log OTP.
  console.log(`OTP for ${email}: ${otp}`);

  return otp;
}

// Verifies OTP by checking against Supabase
export async function verifyOTP(email: string, otp: string): Promise<boolean> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("otp_verification")
    .select()
    .eq("email", email)
    .eq("otp", otp)
    .eq("verified", false)
    .lte("expires_at", new Date(Date.now() + 1 * 60 * 1000).toISOString())
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
