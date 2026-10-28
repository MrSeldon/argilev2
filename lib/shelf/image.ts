/**
 * Browser-side: turn a picked photo (JPEG, PNG, WebP, and HEIC where the browser
 * can decode it, e.g. Safari) into a ~1600px JPEG for upload and reading.
 * iPhones usually hand the page a JPEG already when picking from the camera/library.
 */

export class ImagePrepError extends Error {}

const isHeic = (f: File) => /image\/hei[cf]/i.test(f.type) || /\.(heic|heif)$/i.test(f.name);

async function decode(file: File): Promise<{ src: CanvasImageSource; w: number; h: number; done: () => void }> {
  if (typeof createImageBitmap === "function") {
    try {
      const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
      return { src: bmp, w: bmp.width, h: bmp.height, done: () => bmp.close() };
    } catch {
      /* fall through to <img>, which some browsers decode more formats with */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode();
    return { src: img, w: img.naturalWidth, h: img.naturalHeight, done: () => URL.revokeObjectURL(url) };
  } catch {
    URL.revokeObjectURL(url);
    throw new ImagePrepError(
      isHeic(file)
        ? "This iPhone photo (HEIC) can’t be opened in this browser. Try picking it on your phone, take a screenshot of it, or set Camera → Formats → Most Compatible."
        : "This file couldn’t be opened as a photo. Try another photo or a screenshot."
    );
  }
}

export async function toUploadJpeg(file: File, maxSide = 1600): Promise<Blob> {
  const { src, w, h, done } = await decode(file);
  try {
    if (!w || !h) throw new ImagePrepError("This photo looks empty. Try again.");
    const scale = Math.min(1, maxSide / Math.max(w, h));
    const cw = Math.max(1, Math.round(w * scale));
    const ch = Math.max(1, Math.round(h * scale));
    const canvas = document.createElement("canvas");
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new ImagePrepError("This browser couldn’t prepare the photo.");
    ctx.fillStyle = "#fff"; // transparent PNGs -> white, not black
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(src, 0, 0, cw, ch);
    for (const q of [0.85, 0.72, 0.6]) {
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", q));
      if (blob && blob.size < 4 * 1024 * 1024) return blob;
    }
    throw new ImagePrepError("This photo is too large to send. Try again closer to the label.");
  } finally {
    done();
  }
}
