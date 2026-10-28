"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseConfigured } from "@/lib/supabase/env";
import { signOut } from "@/components/auth/useAuth";
import { shelfStore } from "./shelfSync";
import { useShelf } from "./useShelf";

/** Where the shelf is saved, sync state, and the sign-in invitation / sign-out link. */
export function ShelfSyncNote() {
  const { mode, status, email, loaded } = useShelf();
  const router = useRouter();
  if (!loaded) return <p className="mt-3 text-caption text-warm-500">&nbsp;</p>;

  if (mode === "local") {
    return (
      <p className="mt-3 text-caption text-warm-500">
        Saved in this browser only.
        {supabaseConfigured && (
          <>
            {" "}
            <Link href="/login?next=%2Fglazes%2Fmy-materials" className="underline text-warm-700 inline-block py-2">
              Sign in
            </Link>{" "}
            to keep your shelf on your phone and laptop.
          </>
        )}
      </p>
    );
  }

  const state =
    status === "syncing"
      ? "Saving…"
      : status === "offline"
      ? "Offline: your changes are kept on this device and will sync when you’re back online."
      : status === "error"
      ? "Couldn’t sync just now."
      : "Saved to your account, on all your devices.";
  return (
    <p className="mt-3 text-caption text-warm-500" aria-live="polite">
      {state}
      {status === "error" && (
        <>
          {" "}
          <button type="button" onClick={() => void shelfStore.retry()} className="underline text-warm-700 py-2">
            Try again
          </button>
        </>
      )}
      <span className="block">
        {email}
        {" · "}
        <button type="button" onClick={() => signOut().then(() => router.refresh())} className="underline py-2">
          Sign out
        </button>
      </span>
    </p>
  );
}
