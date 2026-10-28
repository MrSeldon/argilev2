import { MentorChat } from "@/components/mentor/MentorChat";
import { PageHeader } from "@/components/site/PageHeader";
import { PHOTOS } from "@/components/site/photos";

export const metadata = {
  title: "Ask | Le Four Argile",
  description: "Ask a ceramics mentor about technique, materials, glazes and firing.",
};

export default function MentorPage() {
  return (
    <div className="min-h-[calc(100dvh-var(--chrome))] flex flex-col">
      <PageHeader
        eyebrow="Ask"
        title="The mentor"
        lede="Technique, materials, glazes, firing, or the studio itself. Ask the way you would ask someone at the next wheel."
        photo={PHOTOS.hands}
        photoOnPhone={false}
      />
      <section className="wrap flex-1 flex flex-col">
        <div className="max-w-3xl w-full flex-1 flex flex-col">
          <MentorChat />
        </div>
      </section>
    </div>
  );
}
