import { ShelfIntake } from "@/components/glazes/ShelfIntake";
import { Shelf } from "@/components/glazes/Shelf";
import { GlazeCredits } from "@/components/glazes/GlazeCredits";
import { GlazeNav } from "@/components/glazes/GlazeNav";
import { PageHeader } from "@/components/site/PageHeader";

export const metadata = {
  title: "My shelf | Le Four Argile",
  description: "The glaze materials you have, what you can make now, and the one material that unlocks the most.",
};

export default function MyMaterialsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Glazes"
        title="My shelf"
        lede="What you have, what you can make with it today, and the one material that would open up the most."
      >
        <GlazeNav active="/glazes/my-materials" />
      </PageHeader>

      <div className="wrap-narrow !max-w-[46rem] mt-8 md:mt-12">
        <ShelfIntake />

        <div className="mt-10">
          <Shelf />
        </div>
      </div>

      <section className="wrap-narrow !max-w-[46rem] mt-16">
        <GlazeCredits className="border-t border-line pt-6" />
      </section>
    </div>
  );
}
