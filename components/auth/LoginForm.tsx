"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase/client";
import { signOut, useAuth } from "./useAuth";

/** Only same-site paths, so ?next= can't bounce anyone to another website. */
export function safeNext(next: string | null | undefined, fallback = "/glazes/my-materials") {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}

function friendly(message: string, status?: number): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "That email and password don’t match. Check for typos (and caps lock), or use “Forgot your password?” below.";
  if (m.includes("email not confirmed")) return "This account hasn’t been confirmed yet. Ask Devin to confirm it.";
  if (status === 429 || m.includes("rate limit") || m.includes("too many")) return "Too many tries in a row. Wait a minute, then try again.";
  if (m.includes("fetch") || m.includes("network") || m.includes("failed to")) return "Couldn’t reach the server. Check your connection and try again.";
  return "Sign-in didn’t work: " + message;
}

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const { ready, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dest = safeNext(next);
  const sb = getSupabase();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!sb) {
      setError("Sign-in isn’t set up on this site yet.");
      return;
    }
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setBusy(true);
    try {
      const { error: err } = await sb.auth.signInWithPassword({ email: email.trim(), password });
      if (err) {
        setError(friendly(err.message, err.status));
        setBusy(false);
        return;
      }
      router.replace(dest);
      router.refresh();
    } catch (err) {
      setError(friendly(err instanceof Error ? err.message : String(err)));
      setBusy(false);
    }
  }

  if (ready && user) {
    return (
      <div className="space-y-4">
        <p className="text-body-md">
          You’re signed in as <strong>{user.email}</strong>.
        </p>
        <div className="flex flex-col gap-3">
          <a href={dest} className="min-h-[48px] flex items-center justify-center bg-ink text-paper text-body-md">
            Go to my shelf
          </a>
          <button
            type="button"
            onClick={() => signOut().then(() => router.refresh())}
            className="min-h-[48px] border border-line-strong bg-white text-body-md"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="login-email" className="block text-body-sm text-ink-2 mb-1.5">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          inputMode="email"
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full min-h-[48px] px-3 text-base bg-paper-soft border border-line-strong focus:outline-none focus:border-ink"
        />
      </div>
      <div>
        <label htmlFor="login-password" className="block text-body-sm text-ink-2 mb-1.5">
          Password
        </label>
        <div className="flex">
          <input
            id="login-password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 min-w-0 min-h-[48px] px-3 text-base bg-paper-soft border border-line-strong border-r-0 focus:outline-none focus:border-ink"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-pressed={show}
            aria-controls="login-password"
            className="min-h-[48px] min-w-[72px] px-3 text-body-sm border border-line-strong bg-oat"
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      {error && (
        <p role="alert" className="text-body-sm text-rust bg-terracotta-wash p-3">
          {error}
        </p>
      )}
      <button type="submit" disabled={busy} className="w-full min-h-[52px] bg-ink text-paper text-body-md disabled:opacity-60">
        {busy ? "Signing in…" : "Sign in"}
      </button>
      <a href="/forgot-password" className="link-quiet text-ink-3 block min-h-11 py-2">
        Forgot your password?
      </a>
    </form>
  );
}
