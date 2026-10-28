"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase/client";
import { useAuth } from "./useAuth";

/** Choose a new password, after arriving signed in from the emailed reset link. */
export function ResetForm() {
  const router = useRouter();
  const { ready, user } = useAuth();
  const [pw, setPw] = useState("");
  const [again, setAgain] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!ready) return <div className="py-8" aria-hidden />;
  if (!user) {
    return (
      <div className="space-y-4">
        <p className="text-body-md text-ink-2">This reset link has expired or was opened on a different device. Ask for a new one.</p>
        <Link href="/forgot-password" className="btn-primary inline-flex">
          Send a new link
        </Link>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (pw.length < 8) return setError("Use at least 8 characters.");
    if (pw !== again) return setError("The two passwords don’t match.");
    const sb = getSupabase();
    if (!sb) return;
    setBusy(true);
    const { error: err } = await sb.auth.updateUser({ password: pw });
    setBusy(false);
    if (err) {
      if (/same|different from the old/i.test(err.message)) return setError("That’s your current password. Choose a new one.");
      if (/weak|short|characters/i.test(err.message)) return setError("That password is too weak. Make it longer, or mix in numbers.");
      return setError("Couldn’t save it: " + err.message);
    }
    setDone(true);
    setTimeout(() => {
      router.replace("/glazes/my-materials");
      router.refresh();
    }, 1500);
  }

  if (done) return <p className="text-body-md text-celadon-deep">Saved. You’re signed in with your new password.</p>;

  const field = "w-full min-h-12 px-3 text-base bg-paper-soft border border-line-strong focus:outline-none focus:border-ink";
  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <p className="text-body-sm text-ink-3">
        For <strong className="text-ink-2">{user.email}</strong>
      </p>
      <div>
        <label htmlFor="new-pw" className="block text-body-sm text-ink-2 mb-1.5">
          New password
        </label>
        <input id="new-pw" type={show ? "text" : "password"} autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} className={field} />
      </div>
      <div>
        <label htmlFor="new-pw-2" className="block text-body-sm text-ink-2 mb-1.5">
          Same again
        </label>
        <input id="new-pw-2" type={show ? "text" : "password"} autoComplete="new-password" value={again} onChange={(e) => setAgain(e.target.value)} className={field} />
      </div>
      <label className="flex items-center gap-2 text-body-sm text-ink-2 min-h-11">
        <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} /> Show passwords
      </label>
      {error && (
        <p role="alert" className="text-body-sm text-rust bg-terracotta-wash p-3">
          {error}
        </p>
      )}
      <button type="submit" disabled={busy} className="btn-primary w-full justify-center min-h-[52px] disabled:opacity-60">
        {busy ? "Saving…" : "Save new password"}
      </button>
    </form>
  );
}
