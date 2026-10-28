import Image from "next/image";

export interface PhotoLike {
  src: string;
  alt: string;
  credit?: string;
  creditUrl?: string;
  license?: string;
  position?: string;
  width?: number;
  height?: number;
}

/**
 * A photograph in a fixed-ratio frame (no layout shift), optionally with a
 * small credit line underneath.
 */
export function Photo({
  photo,
  ratio = "4 / 3",
  sizes,
  priority = false,
  credit = true,
  className = "",
  frameClassName = "",
  zoom = false,
  wholeIfTall = false,
}: {
  photo: PhotoLike;
  ratio?: string;
  sizes: string;
  priority?: boolean;
  credit?: boolean;
  className?: string;
  frameClassName?: string;
  zoom?: boolean;
  /** Detail pages: a portrait-shaped photo is shown whole at its own shape (capped in height) instead of cropped to `ratio`. */
  wholeIfTall?: boolean;
}) {
  const tall = wholeIfTall && photo.width && photo.height && photo.height > photo.width * 1.05;
  if (tall) {
    return (
      <figure className={className}>
        <div
          className="relative overflow-hidden bg-oat mx-auto max-w-full"
          style={{ aspectRatio: `${photo.width} / ${photo.height}`, height: "min(78vh, 900px)" }}
        >
          <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 60vw, 100vw" priority={priority} className="object-cover" style={{ objectPosition: photo.position || "50% 50%" }} />
        </div>
        {credit && photo.credit && <Credit photo={photo} className="mt-2 text-center" />}
      </figure>
    );
  }
  return (
    <figure className={className}>
      <div className={`relative overflow-hidden bg-oat ${frameClassName}`} style={{ aspectRatio: ratio }}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover ${zoom ? "photo-zoom" : ""}`}
          style={{ objectPosition: photo.position || "50% 50%" }}
        />
      </div>
      {credit && photo.credit && <Credit photo={photo} className="mt-2" />}
    </figure>
  );
}

export function Credit({ photo, className = "", light = false }: { photo: PhotoLike; className?: string; light?: boolean }) {
  if (!photo.credit) return null;
  const tone = light ? "text-paper/70" : "text-ink-3";
  return (
    <figcaption className={`text-[11px] leading-snug ${tone} ${className}`}>
      Photo{" "}
      {photo.creditUrl ? (
        <a href={photo.creditUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-current/30 underline-offset-2 hover:decoration-current">
          {photo.credit}
        </a>
      ) : (
        photo.credit
      )}
      {photo.license ? `, ${photo.license}` : ""}
    </figcaption>
  );
}
