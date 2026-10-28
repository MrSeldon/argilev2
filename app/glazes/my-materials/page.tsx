import { Shelf } from "@/components/glazes/Shelf";
import { GlazeCredits } from "@/components/glazes/GlazeCredits";
import { GlazeHero } from "@/components/glazes/GlazeHero";

export const metadata = {
  title: "My Shelf | Le Four Argile",
  description: "The glaze materials you have, what you can make now, and the one material that unlocks the most.",
};

export default function MyMaterialsPage() {
  return (
    <div className="min-h-screen">
      <GlazeHero title="My shelf" subtitle="What you have, what you can make, what to get next" link={{ href: "/glazes", label: "← Describe" }} />
      <section className="py-8 md:py-12">
        <div className="max-w-narrow mx-auto px-4 md:px-8">
          <Shelf />
        </div>
      </section>
      <section className="pb-16">
        <div className="max-w-narrow mx-auto px-4 md:px-8 border-t border-warm-100 pt-6">
          <GlazeCredits />
        </div>
      </section>
    </div>
  );
}
