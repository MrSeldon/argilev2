"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ListMapSwitch } from "./ExploreNav";

const KEEP = ["scope", "making", "city"];

function carried(search: string) {
  const sp = new URLSearchParams(search);
  const keep = new URLSearchParams();
  for (const k of KEEP) {
    const v = sp.get(k);
    if (v) keep.set(k, v);
  }
  const qs = keep.toString();
  return qs ? `?${qs}` : "";
}

/**
 * List | Map that carries the region and craft across, so switching views keeps what you chose.
 * The map changes its address with history.replaceState (no reload), so the query is read again at the moment of the tap.
 */
export function ViewSwitch({ active }: { active: "list" | "map" }) {
  const router = useRouter();
  const sp = useSearchParams();
  return (
    <div
      className="contents"
      onClickCapture={(e) => {
        const a = (e.target as HTMLElement).closest("a");
        if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        router.push(new URL(a.href).pathname + carried(window.location.search));
      }}
    >
      <ListMapSwitch active={active} query={carried(sp.toString())} />
    </div>
  );
}
