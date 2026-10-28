"use client";

import Link from "next/link";
import { useState } from "react";
import { getSupabase } from "@/lib/supabase/client";

/** "Forgot password?": Supabase emails a one-time link; it lands on /auth/callback, then /reset-password to choose a new one. */
export function ForgotForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const sb = getSupabase();
    if (!sb) return setError("Sign-in isn’t set up on this site yet.");
    if (!email.trim()) return setError("Enter the email you sign in with.");
    setBusy(true);
    const { error: err } = await sb.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    setBusy(false);
    if (err && (err.status === 429 || /rate|too many/i.test(err.message))) {
      return setError("Too many reset emails in a short time. Wait an hour, then try again.");
    }
    if (err && /fetch|network/i.test(err.message)) return setError("Couldn’t reach the server. Check your connection and try again.");
    setSent(true); // same answer whether or not the email has an account
  }

  if (sent) {
    return (
      <div className="space-y-4">
        <p className="text-body-md text-ink-2">
          If <strong className="text-ink">{email.trim()}</strong> has an account, a link to choose a new password is on its way. It comes from
          “Supabase Auth” and can land in spam. Open it on this same phone or computer.
        </p>
        <Link href="/login" className="link-quiet text-ink-3">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="forgot-email" className="block text-body-sm text-ink-2 mb-1.5">
          Email
        </label>
        <input
          id="forgot-email"
          type="email"
          inputMode="email"
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full min-h-12 px-3 text-base bg-paper-soft border border-line-strong focus:outline-none focus:border-ink"
        />
      </div>
      {error && (
        <p role="alert" className="text-body-sm text-rust bg-terracotta-wash p-3">
          {error}
        </p>
      )}
      <button type="submit" disabled={busy} className="btn-primary w-full justify-center min-h-[52px] disabled:opacity-60">
        {busy ? "Sending…" : "Email me a link"}
      </button>
      <Link href="/login" className="link-quiet text-ink-3 block">
        Back to sign in
      </Link>
    </form>
  );
}
