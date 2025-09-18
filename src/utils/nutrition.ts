// src/utils/nutrition.ts
import type { Nutrients } from "../services/openFoodFacts";

export type Macros = {
  carbs_g: number;
  protein_g: number;
  fat_g: number;
  kcal: number;
};

export function macrosForServing(per100g: Nutrients, grams: number): Macros {
  const factor = grams / 100;
  const carbs = (per100g.carbs_g ?? 0) * factor;
  const prot  = (per100g.protein_g ?? 0) * factor;
  const fat   = (per100g.fat_g ?? 0) * factor;
  const kcal =
    per100g.kcal != null
      ? Math.round(per100g.kcal * factor)
      : Math.round(carbs * 4 + prot * 4 + fat * 9);

  return {
    carbs_g: round1(carbs),
    protein_g: round1(prot),
    fat_g: round1(fat),
    kcal
  };
}

export function round1(n: number) { return Math.round(n * 10) / 10; }
