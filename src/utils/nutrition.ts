export type Macros = { kcal: number; protein_g: number; fat_g: number; carbs_g: number };

export const round = (n: number, d = 1) => {
  const p = Math.pow(10, d);
  return Math.round(n * p) / p;
};

// calcula macros para uma porção (g) a partir dos valores por 100g
export function macrosForServing(
  per100g: Partial<Macros>,
  grams: number
): Macros {
  const f = grams / 100;
  const carbs = Number(per100g.carbs_g ?? 0) * f;
  const prot  = Number(per100g.protein_g ?? 0) * f;
  const fat   = Number(per100g.fat_g ?? 0) * f;
  return {
    carbs_g: round(carbs),
    protein_g: round(prot),
    fat_g: round(fat),
    kcal: round(carbs * 4 + prot * 4 + fat * 9),
  };
}
