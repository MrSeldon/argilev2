import Link from "next/link";
import Image from "next/image";
import type { Opportunity } from "@/lib/types";
import { imageOf } from "@/components/media/image";
import { tint, typeColor } from "@/components/design/palette";
import { LocationMark } from "@/components/design/LocationMark";
import { factsOf, isUnconfirmed, typeLabel } from "./facts";

/**
 * Phones: a compact row (square thumbnail + text) so a long list stays easy to
 * scan. Wider screens: a card with a 4:3 plate.
 *
 * Without a photograph the plate is typographic: a wash of the type's colour,
 * the type, the country, the city in large italic serif and a small graticule
 * with a dot where the place is.
 */
export function OpportunityCard({ opportunity: o, priority = false }: { opportunity: Opportunity; priority?: boolean }) {
  const img = imageOf(o);
  const f = factsOf(o);
  const color = typeColor(o.type);
  const summary = [f.deadline && `Deadline ${f.deadline.value}`, f.when?.value].filter(Boolean).join(" · ");
  const unconfirmed = isUnconfirmed(o);
  const place = f.place.local || f.place.line;

  return (
    <Link href={`/opportunities/${o.id}`} className="group flex gap-4 sm:block py-4 sm:py-0 border-b border-line sm:border-0">
      {/* Plate */}
      <div
        className="relative shrink-0 w-[5.25rem] h-[5.25rem] sm:w-auto sm:h-auto sm:aspect-[4/3] overflow-hidden"
        style={{ background: tint(color, 0.1) }}
      >
        {img ? (
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 84px"
            priority={priority}
            className="object-cover photo-zoom"
            style={{ objectPosition: img.position || "50% 50%" }}
          />
        ) : (
          <>
            {/* phone thumb: just the mark */}
            <div className="sm:hidden absolute inset-0 flex items-center justify-center p-2 text-ink-3">
              <LocationMark lat={f.place.lat} lng={f.place.lng} color={color} className="w-full" />
            </div>
            {/* card plate */}
            <div className="hidden sm:flex absolute inset-0 flex-col p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="eyebrow text-ink-2 inline-flex items-center gap-2">
                  <span className="block w-1.5 h-1.5 rounded-full" style={{ background: color }} aria-hidden="true" />
                  {typeLabel(o.type)}
                </span>
                {f.place.country && <span className="eyebrow text-ink-3">{f.place.country}</span>}
              </div>
              {typeof f.place.lat === "number" && (
                <LocationMark
                  lat={f.place.lat}
                  lng={f.place.lng}
                  color={color}
                  className="w-[74%] mt-4 self-end text-ink-3"
                />
              )}
              <p className="mt-auto font-serif italic font-light text-[1.9rem] leading-tight text-ink/85 line-clamp-1 pb-0.5">
                {f.place.city || place}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1 sm:pt-4">
        <p className="eyebrow sm:hidden inline-flex items-center gap-2">
          <span className="block w-1.5 h-1.5 rounded-full" style={{ background: color }} aria-hidden="true" />
          {typeLabel(o.type)}
          {f.place.country && <span className="text-ink-3">· {f.place.country}</span>}
        </p>
        <h3 className="font-serif text-[1.3rem] sm:text-[1.4rem] leading-tight mt-1 sm:mt-0 transition-colors duration-400 group-hover:text-terracotta-deep text-pretty">
          {o.name}
        </h3>
        {o.nameEnglish && <p className="text-caption italic text-ink-3 mt-0.5">{o.nameEnglish}</p>}
        <p className="text-body-sm text-ink-3 mt-1">{f.place.line}</p>
        {summary && <p className="text-caption text-ink-2 mt-1.5">{summary}</p>}
        {unconfirmed && <p className="text-caption text-ink-3 mt-1.5 italic">Not recently confirmed</p>}
      </div>
    </Link>
  );
}
