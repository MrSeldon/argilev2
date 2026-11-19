import { SlipCalculator, type SlipInitial } from "@/components/glazes/SlipCalculator";
import { GlazeNav } from "@/components/glazes/GlazeNav";
import { PageHeader } from "@/components/site/PageHeader";

export const metadata = {
  title: "Slip casting | Le Four Argile",
  description: "Water for a casting slip from dry powder, deflocculant dose, shrinkage and absorption.",
};

// Another page can link here with the numbers already filled in, e.g.
// /glazes/slip?powder=10&sg=1.8#batch or /glazes/slip?dry=94&fired=88&want=120#shrinkage
const PARAMS = ["powder", "sg", "density", "measured", "defloc", "line", "dry", "fired", "want", "weight", "boiled"] as const;

export default async function SlipPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const initial: SlipInitial = {};
  for (const k of PARAMS) {
    const v = sp[k];
    if (typeof v === "string" && v.length <= 12) initial[k] = v;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Glazes"
        title="Slip casting"
        lede="Mixing casting slip from dry powder: how much water, how much deflocculant, and how much the clay shrinks."
      >
        <GlazeNav active="/glazes/slip" />
      </PageHeader>

      <div className="wrap-narrow !max-w-[46rem] mt-6 md:mt-10 pb-12">
        <SlipCalculator initial={initial} />
      </div>
    </div>
  );
}
