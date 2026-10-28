import { DescribeIt } from "@/components/glazes/DescribeIt";
import { GlazeCredits } from "@/components/glazes/GlazeCredits";
import { PageHeader } from "@/components/site/PageHeader";
import { GlazeNav } from "@/components/glazes/GlazeNav";
import { PHOTOS } from "@/components/site/photos";

export const metadata = {
  title: "Glazes | Le Four Argile",
  description: "Describe the glaze you want and find real recipes from Glazy and Digitalfire that do it.",
};

export default function GlazesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Recipes and materials"
        title="Glazes"
        lede="About 9,800 recipes from Glazy and Digitalfire. Say what you’re after in your own words, then adapt it to what’s on your shelf."
        photo={PHOTOS.shino}
        photoOnPhone={false}
      >
        <GlazeNav active="/glazes" />
      </PageHeader>

      <section className="wrap-narrow !max-w-[46rem] mt-8 md:mt-14">
        <DescribeIt />
      </section>

      <section className="wrap-narrow !max-w-[46rem] mt-16">
        <GlazeCredits className="border-t border-line pt-6" />
      </section>
    </div>
  );
}
