"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useAuth } from "./useAuth";

/**
 * Small "Sign in" / "email · Sign out" control. Not placed in the nav yet:
 * drop <AccountControl /> wherever the navigation wants it. `tone="light"`
 * suits the dark nav bar, `tone="dark"` suits cream pages.
 */
export function AccountControl({ tone = "light", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  const { ready, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const color = tone === "light" ? "text-white" : "text-charcoal";
  if (!ready) return <span className={`inline-block min-w-[64px] ${className}`} aria-hidden />;
  if (!user) {
    const next = pathname && pathname !== "/login" ? `?next=${encodeURIComponent(pathname)}` : "";
    return (
      <Link href={`/login${next}`} className={`inline-flex items-center min-h-[44px] underline-offset-4 hover:underline ${color} ${className}`}>
        Sign in
      </Link>
    );
  }
  return (
    <span className={`inline-flex items-center gap-3 ${color} ${className}`}>
      <span className="truncate max-w-[12rem] opacity-80" title={user.email || undefined}>
        {user.email}
      </span>
      <button
        type="button"
        onClick={() => signOut().then(() => router.refresh())}
        className="min-h-[44px] underline underline-offset-4"
      >
        Sign out
      </button>
    </span>
  );
}
