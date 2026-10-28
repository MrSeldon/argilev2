import { DescribeIt } from "@/components/glazes/DescribeIt";
import { GlazeCredits } from "@/components/glazes/GlazeCredits";
import { GlazeHero } from "@/components/glazes/GlazeHero";

export const metadata = {
  title: "Glazes | Le Four Argile",
  description: "Describe the glaze you want and find real recipes from Glazy and Digitalfire that do it.",
};

export default function GlazesPage() {
  return (
    <div className="min-h-screen">
      <GlazeHero title="Glazes" subtitle="9,800 recipes from Glazy & Digitalfire" link={{ href: "/glazes/my-materials", label: "My shelf →" }} />

      <section className="py-6 md:py-12">
        <div className="max-w-narrow mx-auto px-4 md:px-8">
          <DescribeIt />
        </div>
      </section>

      <section className="pb-16 pt-4">
        <div className="max-w-narrow mx-auto px-4 md:px-8 border-t border-warm-100 pt-6">
          <GlazeCredits />
        </div>
      </section>
    </div>
  );
}
