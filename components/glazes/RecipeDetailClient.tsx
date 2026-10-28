"use client";

import { useCallback, useMemo } from "react";
import type { Ingredient } from "@/lib/glazes/types";
import { BatchCalculator } from "./BatchCalculator";
import { useGlossary, useShelf } from "./useShelf";

export function RecipeDetailClient({ ingredients }: { ingredients: Ingredient[] }) {
  const { shelf } = useShelf();
  const glossary = useGlossary();
  const groups = useMemo(() => new Map((glossary || []).map((m) => [m.id, m.group])), [glossary]);
  const groupOf = useCallback((id: string) => groups.get(id), [groups]);
  return <BatchCalculator ingredients={ingredients} shelf={shelf} groupOf={groupOf} />;
}
