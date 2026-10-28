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
        {/* Slot for the photo / receipt import (wired up in a later task) */}
        <section
          aria-labelledby="from-photo"
          className="flex flex-wrap sm:flex-nowrap items-center gap-x-4 gap-y-3 p-4 md:p-5 border border-dashed border-line-strong bg-paper-soft/60"
        >
          <span className="shrink-0 w-11 h-11 rounded-full bg-oat flex items-center justify-center text-ink-3" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round">
              <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" />
              <circle cx="12" cy="13" r="3.5" />
            </svg>
          </span>
          <div className="min-w-0 flex-1 basis-[12rem]">
            <p id="from-photo" className="text-body-md text-ink">
              Add from a photo or receipt
            </p>
            <p className="text-caption text-ink-3">Snap your shelf or a supplier receipt and the materials fill in.</p>
          </div>
          <button type="button" disabled aria-disabled="true" className="btn-secondary w-full sm:w-auto shrink-0 !px-4">
            Coming soon
          </button>
        </section>

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
