import { MakeStudio } from "@/components/make/MakeStudio";
import { PageHeader } from "@/components/site/PageHeader";
import { PHOTOS } from "@/components/site/photos";

export const metadata = {
  title: "Make | Le Four Argile",
  description: "Send a sketch and get it back rendered in clay and glaze, with the throwing or building sheet.",
};

export default function MakePage() {
  return (
    <div className="min-h-[calc(100dvh-var(--chrome))] flex flex-col">
      <PageHeader
        eyebrow="Make"
        title="From sketch to piece"
        lede="Send a photo of a sketch. I’ll ask a few questions, then show it rendered in your clay and glaze, with the sheet to throw or build it from."
        photo={PHOTOS.wheel}
        photoOnPhone={false}
      />
      <section className="wrap flex-1 flex flex-col">
        <div className="max-w-3xl w-full flex-1 flex flex-col">
          <MakeStudio />
        </div>
      </section>
    </div>
  );
}
