"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Material {
  name: string;
  inStock: boolean;
}

// Common glaze materials
const COMMON_MATERIALS = [
  "Silica",
  "Kaolin",
  "Feldspar",
  "Whiting",
  "Dolomite",
  "Talc",
  "Zinc Oxide",
  "Titanium Dioxide",
  "Iron Oxide",
  "Cobalt Oxide",
  "Cobalt Carbonate",
  "Copper Carbonate",
  "Copper Oxide",
  "Manganese Dioxide",
  "Rutile",
  "Tin Oxide",
  "Zircopax",
  "Gerstley Borate",
  "Ferro Frit 3110",
  "Ferro Frit 3134",
  "Ferro Frit 3195",
  "Nepheline Syenite",
  "Wollastonite",
  "Spodumene",
  "Ball Clay",
  "Bentonite",
  "Bone Ash",
  "Barium Carbonate",
  "Lithium Carbonate",
  "Strontium Carbonate",
  "Magnesium Carbonate",
  "Red Iron Oxide",
  "Yellow Iron Oxide",
  "Chrome Oxide",
  "Nickel Oxide",
  "Vanadium Pentoxide",
];

export function MaterialsInventory() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [newMaterial, setNewMaterial] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("argil-materials");
    if (stored) {
      setMaterials(JSON.parse(stored));
    } else {
      // Initialize with common materials, all unchecked
      setMaterials(
        COMMON_MATERIALS.map((name) => ({ name, inStock: false }))
      );
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when materials change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("argil-materials", JSON.stringify(materials));
    }
  }, [materials, isLoaded]);

  const toggleMaterial = (name: string) => {
    setMaterials((prev) =>
      prev.map((m) =>
        m.name === name ? { ...m, inStock: !m.inStock } : m
      )
    );
  };

  const addMaterial = () => {
    const trimmed = newMaterial.trim();
    if (trimmed && !materials.find((m) => m.name.toLowerCase() === trimmed.toLowerCase())) {
      setMaterials((prev) => [...prev, { name: trimmed, inStock: true }]);
      setNewMaterial("");
    }
  };

  const removeMaterial = (name: string) => {
    setMaterials((prev) => prev.filter((m) => m.name !== name));
  };

  const inStockCount = materials.filter((m) => m.inStock).length;

  if (!isLoaded) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-clay-100 rounded w-48 mb-6" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-12 bg-clay-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="card p-6 bg-glaze-50 border border-glaze-200">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-body-sm text-glaze-600 mb-1">Materials in stock</p>
            <p className="text-display-sm text-glaze-700">
              {inStockCount} <span className="text-body-lg text-glaze-500">/ {materials.length}</span>
            </p>
          </div>
          <Link href="/glazes" className="btn-primary">
            Find Recipes
          </Link>
        </div>
      </div>

      {/* Add Material */}
      <div className="card p-6">
        <h2 className="text-heading-sm mb-4">Add Material</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={newMaterial}
            onChange={(e) => setNewMaterial(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addMaterial()}
            placeholder="Material name..."
            className="input flex-1 min-w-0 text-base"
          />
          <button onClick={addMaterial} className="btn-primary shrink-0">
            Add
          </button>
        </div>
      </div>

      {/* Materials List */}
      <div>
        <h2 className="text-heading-sm mb-4">Your Materials</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {materials.map((material) => (
            <div
              key={material.name}
              className={`card pl-4 pr-2 py-1 flex items-center justify-between transition-colors ${
                material.inStock ? "bg-glaze-50 border-glaze-200" : ""
              }`}
            >
              <label className="flex items-center gap-3 cursor-pointer flex-1 min-h-12">
                <input
                  type="checkbox"
                  checked={material.inStock}
                  onChange={() => toggleMaterial(material.name)}
                  className="w-5 h-5 rounded border-ash-300 text-glaze-600 focus:ring-glaze-500"
                />
                <span
                  className={`text-body-md ${
                    material.inStock ? "text-clay-900" : "text-clay-500"
                  }`}
                >
                  {material.name}
                </span>
              </label>
              <button
                onClick={() => removeMaterial(material.name)}
                className="text-clay-400 hover:text-clay-600 w-11 h-11 shrink-0 flex items-center justify-center"
                title="Remove material"
                aria-label={`Remove ${material.name}`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Note */}
      <p className="text-body-sm text-clay-500 text-center">
        Your inventory is saved locally in your browser
      </p>
    </div>
  );
}
