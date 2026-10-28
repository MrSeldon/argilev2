import { SubNav } from "@/components/site/PageHeader";

export function GlazeNav({ active }: { active: "/glazes" | "/glazes/my-materials" }) {
  return (
    <SubNav
      label="Glazes"
      active={active}
      items={[
        { href: "/glazes", label: "Describe a glaze" },
        { href: "/glazes/my-materials", label: "My shelf" },
      ]}
    />
  );
}
