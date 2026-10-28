import Link from "next/link";

// Compact dark band: keeps the site's (white, fixed) navigation legible and
// leaves the describe box above the fold on a phone.
export function GlazeHero({
  title,
  subtitle,
  link,
}: {
  title: string;
  subtitle?: string;
  link?: { href: string; label: string };
}) {
  return (
    <section className="bg-gradient-to-br from-slate-700 via-stone-700 to-stone-800 text-white">
      <div className="max-w-narrow mx-auto px-4 md:px-8 pt-32 pb-6 md:pt-32 md:pb-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-display-sm md:text-display-lg tracking-tight text-white">{title}</h1>
            {subtitle && <p className="text-body-sm text-white/70 mt-1">{subtitle}</p>}
          </div>
          {link && (
            <Link href={link.href} className="text-label uppercase text-white/80 hover:text-white shrink-0 pb-1">
              {link.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
