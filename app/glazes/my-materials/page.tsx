import Link from "next/link";
import { MaterialsInventory } from "@/components/glazes/MaterialsInventory";

export const metadata = {
  title: "My Materials | Le Four Argile",
  description: "Track your glaze materials inventory",
};

export default function MyMaterialsPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-16 border-b border-warm-100">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h1 className="font-serif text-3xl md:text-4xl tracking-tight mb-4">
            My Materials
          </h1>
          <p className="text-warm-500">
            Track your glaze materials inventory to find recipes you can make
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-8">
          <MaterialsInventory />
        </div>
      </section>

      {/* Back Link */}
      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-8">
          <Link
            href="/glazes"
            className="text-sm text-warm-500 hover:text-charcoal transition-colors"
          >
            ← Back to Glazes
          </Link>
        </div>
      </section>
    </div>
  );
}
