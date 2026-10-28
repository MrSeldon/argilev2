import Link from "next/link";
import Image from "next/image";
import type { Highlight } from "@/lib/highlights";
import { imageOf } from "@/components/media/image";
import { tint, typeColor } from "@/components/design/palette";
import { factsOf } from "@/components/opportunities/facts";

/** One find: the photograph (or a quiet colour plate), the small tag, the name and why it's worth her time. */
export function HighlightCard({ h }: { h: Highlight }) {
  const o = h.opportunity;
  const img = imageOf(o);
  const f = factsOf(o);
  const place = f.place.local || f.place.line;
  return (
    <Link href={`/opportunities/${o.id}`} className="group block">
      <div className="relative overflow-hidden aspect-[4/3]" style={{ background: tint(typeColor(o.type), 0.12) }}>
        {img ? (
          <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw" className="object-cover photo-zoom"
            style={{ objectPosition: img.position || "50% 50%" }} />
        ) : (
          <div className="absolute inset-0 flex items-end p-5">
            <span className="font-serif italic text-[1.9rem] leading-none text-ink/70">{place?.split(",")[0]}</span>
          </div>
        )}
        <span className="absolute left-3 top-3 bg-paper/95 text-ink-2 text-label uppercase px-2.5 py-1.5">{h.tag}</span>
      </div>
      <div className="pt-4">
        <p className="text-caption text-ink-3">{place}</p>
        <h3 className="font-serif text-[1.55rem] leading-tight mt-1 transition-colors duration-400 group-hover:text-terracotta-deep">{o.name}</h3>
        <p className="text-body-md text-ink-2 mt-2 leading-relaxed">{h.line}</p>
      </div>
    </Link>
  );
}
