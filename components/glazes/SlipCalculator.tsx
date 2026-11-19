"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CLAY_DENSITY,
  DEFAULT_SG,
  DEFLOCCULANTS,
  type DeflocKey,
  absorption,
  batch,
  correction,
  deflocDose,
  dryingShrinkage,
  sgFromCup,
  shrinkage,
  wetSizeFor,
} from "@/lib/slip/math";
import { round } from "@/lib/glazes/math";

/** Values another page can pre-fill through the URL (see app/glazes/slip/page.tsx). */
export interface SlipInitial {
  powder?: string;
  sg?: string;
  density?: string;
  measured?: string;
  defloc?: string;
  line?: string;
  dry?: string;
  fired?: string;
  want?: string;
  weight?: string;
  boiled?: string;
}

const SIZES = [1, 5, 10, 25];

/** Accepts "1,78" as well as "1.78"; empty or nonsense becomes NaN. */
const num = (s: string) => (s.trim() ? Number(s.replace(",", ".")) : NaN);
const clean = (s: string) => s.replace(/[^\d.,]/g, "");
const start = (v: string | undefined, fallback = "") => (v && Number.isFinite(num(v)) && num(v) > 0 ? clean(v) : fallback);

const fmtMl = (ml: number) => (ml >= 1000 ? `${round(ml / 1000, 2)} litres` : `${Math.round(ml)} ml`);
const fmtG = (g: number) => (g >= 1000 ? `${round(g / 1000, 2)} kg` : `${g < 20 ? round(g, 1) : Math.round(g)} g`);
const fmtDrops = (d: number) => String(d < 20 ? Math.round(d) : Math.round(d / 5) * 5);
const pct = (x: number) => `${round(x, 1)}%`;

export function SlipCalculator({ initial = {} }: { initial?: SlipInitial }) {
  const [powder, setPowder] = useState(start(initial.powder, "5"));
  const [sg, setSg] = useState(start(initial.sg, String(DEFAULT_SG)));
  const [density, setDensity] = useState(start(initial.density, String(CLAY_DENSITY)));
  const [measured, setMeasured] = useState(start(initial.measured));
  const [defloc, setDefloc] = useState<DeflocKey>(initial.defloc === "darvan" ? "darvan" : "silicate");
  const [line, setLine] = useState(start(initial.line, "100"));
  const [dry, setDry] = useState(start(initial.dry));
  const [fired, setFired] = useState(start(initial.fired));
  const [want, setWant] = useState(start(initial.want));
  const [weight, setWeight] = useState(start(initial.weight));
  const [boiled, setBoiled] = useState(start(initial.boiled));

  const dryGrams = num(powder) * 1000;
  const target = num(sg);
  const rho = num(density);

  const b = batch(dryGrams, target, rho);
  const cupSG = sgFromCup(num(measured));
  const fix = cupSG ? correction(cupSG, target, rho, dryGrams) : null;
  const dose = deflocDose(dryGrams, DEFLOCCULANTS[defloc].density);
  const shr = shrinkage(num(dry), num(fired), num(line));
  const dryOnly = shr ? null : dryingShrinkage(num(dry), num(line));
  const wet = shr ? wetSizeFor(num(want), num(fired), num(line)) : null;
  const abs = absorption(num(weight), num(boiled));

  const sgBad = sg.trim() !== "" && density.trim() !== "" && !(target > 1 && target < rho);
  const kg = Number.isFinite(dryGrams) && dryGrams > 0 ? `${round(dryGrams / 1000, 2)} kg` : null;

  return (
    <div>
      <nav aria-label="On this page" className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5 md:mx-0 md:px-0">
        {[
          ["#batch", "Water"],
          ["#check", "Check a cup"],
          ["#deflocculant", "Deflocculant"],
          ["#shrinkage", "Shrinkage"],
          ["#absorption", "Absorption"],
        ].map(([href, label]) => (
          <a key={href} href={href} className="chip chip-off">
            {label}
          </a>
        ))}
      </nav>

      {/* 1. Batch ---------------------------------------------------------- */}
      <Section id="batch" title="How much water" first>
        <p className="text-body-md text-ink-2 max-w-prose">
          Weigh the dry powder. This gives the water to add so the slip comes out at the weight you want.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2" role="group" aria-label="Common batch sizes">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setPowder(String(s))}
              aria-pressed={num(powder) === s}
              className={`min-h-11 min-w-11 px-3 text-body-sm border rounded-full transition-colors duration-400 ${
                num(powder) === s ? "bg-ink text-paper border-ink" : "border-line text-ink-2 bg-paper-soft hover:border-line-strong"
              }`}
            >
              {s} kg
            </button>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <Field label="Dry powder" unit="kg" value={powder} onChange={setPowder} />
          <Field label="Target specific gravity" value={sg} onChange={setSg} />
        </div>
        <p className="mt-2 text-caption text-ink-3">
          Specific gravity is how heavy the slip is next to water. 1.78 means 100 ml of slip weighs 178 g. Most casting slips sit between 1.75 and 1.80.
        </p>

        <Result>
          {b ? (
            <>
              <Big label="Add water" value={fmtMl(b.water)} note={b.water >= 1000 ? `${Math.round(b.water)} ml, or ${Math.round(b.water)} g on the scale` : `${Math.round(b.water)} g on the scale`} />
              <p className="mt-3 text-body-sm text-ink-2">
                Makes about {fmtMl(b.volumeMl)} of slip weighing {fmtG(b.totalGrams)}. The water is {pct(b.waterPctOfDry)} of the powder weight.
              </p>
              <p className="mt-2 text-body-sm text-ink-2">
                Put the water in the bucket first, with the deflocculant, then add the powder a little at a time while mixing.
              </p>
            </>
          ) : (
            <Empty>{sgBad ? `The target must be between 1 (water) and ${density || CLAY_DENSITY} (solid clay).` : "Enter the powder weight and a target."}</Empty>
          )}
        </Result>

        <label className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-caption text-ink-3">
          <span>Assumes the clay particles weigh</span>
          <input
            inputMode="decimal"
            value={density}
            onChange={(e) => setDensity(clean(e.target.value))}
            aria-label="Particle density of the dry clay, grams per cubic centimetre"
            className="w-16 min-h-11 px-2 text-center text-base text-ink bg-paper-soft border border-line rounded-full focus:outline-none focus:border-ink"
          />
          <span>g per cm³ (2.6 is typical for clay). Change it only if your supplier gives another figure.</span>
        </label>
      </Section>

      {/* 1b. Check ---------------------------------------------------------- */}
      <Section id="check" title="Check a cup">
        <p className="text-body-md text-ink-2 max-w-prose">
          Put a measuring cup on the scale, set it to zero, fill it to exactly 100 ml with slip and read the weight.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-4">
          <Field label="100 ml of slip weighs" unit="g" value={measured} onChange={setMeasured} placeholder="178" />
        </div>
        <Result>
          {cupSG && fix ? (
            <>
              <Big label="Specific gravity" value={round(cupSG, 2).toFixed(2)} note={`Target ${sg}`} />
              {fix.kind === "ok" && <p className="mt-3 text-body-md text-celadon-deep">On target. Nothing to add.</p>}
              {fix.kind === "water" && (
                <p className="mt-3 text-body-md text-ink">
                  Too thick. Add <strong className="font-medium">{fmtMl(fix.perLitre)} of water</strong> for each litre of slip
                  {fix.forBatch !== null && kg && (
                    <>
                      : about <strong className="font-medium">{fmtMl(fix.forBatch)}</strong> for a batch made with {kg} of powder
                    </>
                  )}
                  .
                </p>
              )}
              {fix.kind === "powder" && (
                <p className="mt-3 text-body-md text-ink">
                  Too thin. Add <strong className="font-medium">{fmtG(fix.perLitre)} of powder</strong> for each litre of slip
                  {fix.forBatch !== null && kg && (
                    <>
                      : about <strong className="font-medium">{fmtG(fix.forBatch)}</strong> for a batch made with {kg} of powder
                    </>
                  )}
                  .
                </p>
              )}
              {fix.kind !== "ok" && <p className="mt-2 text-body-sm text-ink-2">Add half, mix well, and weigh a cup again.</p>}
            </>
          ) : (
            <Empty>
              {measured.trim() && cupSG && !fix
                ? `That gives ${round(cupSG, 2)}, which cannot be a slip. It must be between 100 g (water) and ${Math.round((rho || CLAY_DENSITY) * 100)} g. Check the cup is 100 ml and the scale was at zero.`
                : "Enter the weight to see the specific gravity and what to add."}
            </Empty>
          )}
        </Result>
      </Section>

      {/* 2. Deflocculant ---------------------------------------------------- */}
      <Section id="deflocculant" title="Deflocculant">
        <p className="text-body-md text-ink-2 max-w-prose">
          A few drops make the slip runny without more water, which is what keeps shrinkage down. A starting dose is 0.25 to 0.5% of the dry powder weight.
        </p>
        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Which deflocculant">
          {(Object.keys(DEFLOCCULANTS) as DeflocKey[]).map((k) => (
            <button key={k} type="button" onClick={() => setDefloc(k)} aria-pressed={defloc === k} className={`chip ${defloc === k ? "chip-on" : "chip-off"}`}>
              {DEFLOCCULANTS[k].label}
            </button>
          ))}
        </div>
        <Result>
          {dose && kg ? (
            <>
              <Big label={`For ${kg} of dry powder`} value={`${fmtG(dose.low.grams)} to ${fmtG(dose.high.grams)}`} />
              <p className="mt-3 text-body-sm text-ink-2">
                That is about {round(dose.low.ml, 1)} to {round(dose.high.ml, 1)} ml
                {dose.high.drops <= 300
                  ? `, or roughly ${fmtDrops(dose.low.drops)} to ${fmtDrops(dose.high.drops)} drops.`
                  : ". Too many drops to count: use a syringe or the scale."}
              </p>
            </>
          ) : (
            <Empty>Enter the powder weight above.</Empty>
          )}
        </Result>
        <div className="mt-4 border-l-2 border-terracotta pl-4 text-body-sm text-ink-2 space-y-2 max-w-prose">
          <p>
            <strong className="font-medium text-ink">Add a little at a time.</strong> Start with half the low figure in the water, mix in the powder, then add a few drops at a time and stir until it pours like cream.
          </p>
          <p>
            <strong className="font-medium text-ink">Too much makes the slip thick again</strong>, and it cannot be taken back out. Stop as soon as more drops make no difference.
          </p>
          <p>If the bag is a ready-made casting slip powder, it may already contain deflocculant. Check before adding any.</p>
        </div>
        <p className="mt-3 text-caption text-ink-3">
          Drops are a rough guide ({DEFLOCCULANTS[defloc].label.toLowerCase()} taken as {DEFLOCCULANTS[defloc].density} g per ml, 20 drops per ml). Every clay needs a different amount, so go by how the slip pours.
        </p>
      </Section>

      {/* 3. Shrinkage ------------------------------------------------------- */}
      <Section id="shrinkage" title="Shrinkage">
        <p className="text-body-md text-ink-2 max-w-prose">
          Cast a flat bar, mark a 100 mm line on it while it is still wet, then measure the same line when it is bone dry and again after firing.
        </p>
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Field label="Line when wet" unit="mm" value={line} onChange={setLine} />
          <Field label="Line when dry" unit="mm" value={dry} onChange={setDry} placeholder="94" />
          <Field label="Line when fired" unit="mm" value={fired} onChange={setFired} placeholder="88" />
        </div>
        <Result>
          {shr ? (
            <>
              <div className="grid grid-cols-3 gap-3">
                <Big label="Drying" value={pct(shr.dryingPct)} small />
                <Big label="Firing" value={pct(shr.firingPct)} small />
                <Big label="Total" value={pct(shr.totalPct)} small />
              </div>
              <p className="mt-3 text-body-sm text-ink-2">
                Make everything {round(shr.wetPerFired, 3)} times the size you want after firing.
              </p>
            </>
          ) : dryOnly !== null ? (
            <>
              <Big label="Drying" value={pct(dryOnly)} small />
              <p className="mt-3 text-body-sm text-ink-2">Add the fired length for firing and total shrinkage.</p>
            </>
          ) : (
            <Empty>
              {dry.trim() && (num(dry) > num(line) || (fired.trim() && num(fired) > num(dry)))
                ? "The line should get shorter each time: wet, then dry, then fired."
                : "Enter the dry and fired lengths."}
            </Empty>
          )}
        </Result>
        <div className="mt-5 grid grid-cols-2 gap-4">
          <Field label="Size wanted after firing" unit="mm" value={want} onChange={setWant} placeholder="100" />
        </div>
        {wet !== null && (
          <Result>
            <Big label="Make the mould or wet piece" value={`${round(wet, 1)} mm`} note={`to get ${want} mm after firing`} />
          </Result>
        )}
        <p className="mt-3 text-caption text-ink-3">
          Drying and total are a share of the wet length; firing is a share of the dry length. This holds for one clay, one slip recipe and one firing temperature: test again if any of them changes.
        </p>
      </Section>

      {/* 4. Absorption ------------------------------------------------------ */}
      <Section id="absorption" title="Absorption">
        <p className="text-body-md text-ink-2 max-w-prose">
          How much water the fired clay still takes in. Weigh a fired, unglazed, dry piece. Boil it in water for two hours, let it cool in the water, wipe the surface and weigh it again.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-4">
          <Field label="Fired and dry" unit="g" value={weight} onChange={setWeight} placeholder="100" />
          <Field label="After boiling" unit="g" value={boiled} onChange={setBoiled} placeholder="104" />
        </div>
        <Result>
          {abs !== null ? (
            <>
              <Big label="Absorption" value={pct(abs)} />
              <p className="mt-3 text-body-sm text-ink-2">
                {abs < 1
                  ? "Very tight: the clay is fully fired and will not take in water."
                  : abs < 3
                    ? "Tight enough for tableware and vases that hold water."
                    : abs < 6
                      ? "Still a little open. It can seep over time; a hotter or longer firing would close it up."
                      : "Porous. Fine for planters and decorative work, but it will take in water unless the glaze seals it completely."}
              </p>
            </>
          ) : (
            <Empty>{weight.trim() && boiled.trim() && num(boiled) < num(weight) ? "The piece should weigh more after boiling, not less." : "Enter both weights."}</Empty>
          )}
        </Result>
      </Section>

      <p className="mt-12 pt-6 border-t border-line text-body-sm text-ink-2">
        Slip not behaving?{" "}
        <Link href={`/mentor?q=${encodeURIComponent("My casting slip is at the right specific gravity but it is still too thick to pour well. What should I check?")}`} className="link">
          Ask the mentor
        </Link>
        .
      </p>
    </div>
  );
}

function Section({ id, title, first, children }: { id: string; title: string; first?: boolean; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`scroll-mt-6 md:scroll-mt-24 ${first ? "mt-8" : "mt-12 pt-8 border-t border-line"}`}>
      <h2 id={`${id}-title`} className="font-serif text-heading-lg mb-2">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({
  label,
  unit,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  unit?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block min-w-0">
      <span className="block text-caption text-ink-3 mb-1.5">{label}</span>
      <span className="flex items-center gap-2">
        <input
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(clean(e.target.value))}
          placeholder={placeholder}
          className="w-full min-w-0 min-h-12 px-4 text-base tabular-nums text-ink bg-paper-soft border border-line-strong rounded-full focus:outline-none focus:border-ink transition-colors duration-400 placeholder:text-ink-3/50"
        />
        {unit && <span className="text-body-sm text-ink-3 shrink-0 w-6">{unit}</span>}
      </span>
    </label>
  );
}

function Result({ children }: { children: React.ReactNode }) {
  return (
    <div aria-live="polite" className="mt-5 p-5 bg-paper-soft border border-line">
      {children}
    </div>
  );
}

function Big({ label, value, note, small }: { label: string; value: string; note?: string; small?: boolean }) {
  return (
    <div>
      <p className="text-caption uppercase tracking-wider text-ink-3">{label}</p>
      <p className={`font-serif text-ink leading-tight mt-1 ${small ? "text-heading-lg sm:text-display-sm" : "text-display-sm sm:text-display-md"}`}>{value}</p>
      {note && <p className="text-caption text-ink-3 mt-0.5">{note}</p>}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-body-sm text-ink-3">{children}</p>;
}
