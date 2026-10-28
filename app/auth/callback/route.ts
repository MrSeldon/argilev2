import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseServer } from "@/lib/supabase/server";

/** Where emailed links land (password reset): trade the one-time code for a session, then go on to `next`. */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const raw = url.searchParams.get("next") || "/";
  const next = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";
  const sb = await createSupabaseServer();
  if (sb) {
    const code = url.searchParams.get("code");
    const tokenHash = url.searchParams.get("token_hash");
    const type = url.searchParams.get("type") as EmailOtpType | null;
    const { error } = code
      ? await sb.auth.exchangeCodeForSession(code)
      : tokenHash && type
      ? await sb.auth.verifyOtp({ token_hash: tokenHash, type })
      : { error: new Error("missing code") };
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
  }
  return NextResponse.redirect(new URL("/reset-password?expired=1", url.origin));
}
