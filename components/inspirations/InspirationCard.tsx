import Link from "next/link";
import Image from "next/image";
import { imageOf } from "@/components/media/image";
import { categoryColor, tint } from "@/components/design/palette";
import { categoryLabel, type Located } from "./model";

/**
 * With a photograph: the photo, then name and origin.
 * Without: a typographic plate in a wash of the category colour, carrying the
 * entry's own one-line caption in italic serif and a swatch of its colour, so
 * the card reads as a designed object rather than a missing picture.
 */
export function InspirationCard({ item, priority = false }: { item: Located; priority?: boolean }) {
  const img = imageOf(item);
  const color = categoryColor(item.category);
  const swatch = item.fallbackColor || color;
  const meta = [item.origin, item.period].filter(Boolean).join(" · ");

  return (
    <Link href={`/inspirations/${item.category}/${item.id}`} className="group block">
      <div className="relative overflow-hidden" style={{ aspectRatio: "4 / 5", background: tint(color, 0.13) }}>
        {img ? (
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="(min-width: 1024px) 30vw, 46vw"
            priority={priority}
            className="object-cover photo-zoom"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col p-3.5 sm:p-5 md:p-6">
            <div className="flex items-center justify-between">
              <span className="eyebrow text-ink-2 inline-flex items-center gap-2">
                <span className="block w-1.5 h-1.5 rounded-full" style={{ background: color }} aria-hidden="true" />
                {categoryLabel(item.category, true)}
              </span>
            </div>
            {/* a small glaze tile in the entry's colour */}
            <span
              className="block mt-5 sm:mt-7 w-[34%] aspect-square rounded-full shadow-subtle transition-transform duration-1200 ease-soft group-hover:scale-[1.04]"
              style={{
                background: `radial-gradient(circle at 34% 30%, ${tint(swatch, 0.7, "#FFFFFF")} 0%, ${swatch} 52%, ${tint(swatch, 0.86, "#1A1917")} 100%)`,
              }}
              aria-hidden="true"
            />
            <p className="mt-auto font-serif italic font-light text-[1.12rem] sm:text-[1.5rem] lg:text-[1.65rem] leading-[1.15] text-ink/85 text-balance transition-colors duration-700 group-hover:text-ink">
              {item.visualCaption || item.story?.hook || item.name}
            </p>
            {meta && <p className="mt-3 sm:mt-4 text-[11px] sm:text-caption text-ink-3 line-clamp-2">{meta}</p>}
          </div>
        )}
      </div>
      <div className="pt-3.5">
        <h3 className="font-serif text-[1.15rem] sm:text-[1.35rem] leading-tight transition-colors duration-400 group-hover:text-terracotta-deep">
          {item.name}
        </h3>
        {img && meta && <p className="mt-1 text-caption text-ink-3">{meta}</p>}
      </div>
    </Link>
  );
}
