import { SubNav, Switch } from "@/components/site/PageHeader";

/** Explore = Opportunities + Inspiration. */
export function ExploreNav({ active }: { active: "/opportunities" | "/inspirations" | "/highlights" }) {
  return (
    <SubNav
      label="Explore"
      active={active}
      items={[
        { href: "/highlights", label: "Highlights" },
        { href: "/opportunities/map", label: "Opportunities" },
        { href: "/inspirations", label: "Inspiration" },
      ]}
    />
  );
}

const ListIcon = (
  <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
    <path d="M2.5 4h11M2.5 8h11M2.5 12h11" />
  </svg>
);
const MapIcon = (
  <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round">
    <path d="M1.5 3.5l4-1.5 5 2 4-1.5v10l-4 1.5-5-2-4 1.5z" />
    <path d="M5.5 2v10M10.5 4v10" />
  </svg>
);

/** The List | Map switch at the top of Opportunities. */
export function ListMapSwitch({ active, query = "" }: { active: "list" | "map"; query?: string }) {
  const list = `/opportunities${query}`;
  const map = `/opportunities/map${query}`;
  return (
    <Switch
      label="View"
      active={active === "list" ? list : map}
      items={[
        { href: list, label: "List", icon: ListIcon },
        { href: map, label: "Map", icon: MapIcon },
      ]}
    />
  );
}
