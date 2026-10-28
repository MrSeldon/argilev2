import glossary from "@/data/materials/glossary.json";
import type { MatchableMaterial } from "./match";

/** The canonical materials glossary, bundled into the route (no runtime file reads, no glaze index). */
export const GLOSSARY: MatchableMaterial[] = (glossary as { materials: MatchableMaterial[] }).materials;
