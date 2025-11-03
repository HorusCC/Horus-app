// src/utils/nutrition.ts
export type Nutrients = {
  carbs_g?: number;
  protein_g?: number;
  fat_g?: number;
  kcal?: number;
};

export type LoggedFood = {
  id: string;
  name: string;
  grams: number;
  nutrientsPer100g: Nutrients;
};

export type MacroTargets = {
  carbs_g: number;
  protein_g: number;
  fat_g: number;
  calories: number;
};

export type UserProfile = {
  idade: number;
  altura: number; // já em cm
  peso: number;
  sexo: "masculino" | "feminino";
  atividade: "sedentario" | "leve" | "moderado" | "ativo";
  objetivo: "emagrecimento" | "manutencao" | "ganho_massa";
};

// ✅ Função que calcula macros para uma porção (ex: 150g)
export function macrosForServing(nutrients: Nutrients, grams: number) {
  const f = grams / 100;
  const carbs_g = (nutrients.carbs_g ?? 0) * f;
  const protein_g = (nutrients.protein_g ?? 0) * f;
  const fat_g = (nutrients.fat_g ?? 0) * f;
  const kcal = carbs_g * 4 + protein_g * 4 + fat_g * 9;

  return { carbs_g, protein_g, fat_g, kcal };
}

// ✅ Soma total de tudo que o usuário comeu
export function sumConsumed(foods: LoggedFood[]) {
  return foods.reduce(
    (acc, f) => {
      const p = macrosForServing(f.nutrientsPer100g, f.grams);
      acc.carbs_g += p.carbs_g;
      acc.protein_g += p.protein_g;
      acc.fat_g += p.fat_g;
      acc.calories += p.kcal;
      return acc;
    },
    { carbs_g: 0, protein_g: 0, fat_g: 0, calories: 0 }
  );
}

// ✅ Calcula quanto ainda falta consumir hoje
export function remainingForToday(
  targets: MacroTargets,
  consumed: ReturnType<typeof sumConsumed>
) {
  return {
    carbs_g: Math.max(0, targets.carbs_g - consumed.carbs_g),
    protein_g: Math.max(0, targets.protein_g - consumed.protein_g),
    fat_g: Math.max(0, targets.fat_g - consumed.fat_g),
    calories: Math.max(0, targets.calories - consumed.calories),
  };
}

// ✅ Calcula meta de macros com base no perfil do usuário (altura já em cm)
export function calcMacroTargets(profile: UserProfile): MacroTargets {
  const peso = profile.peso;
  const alturaCm = profile.altura; // já está em centímetros
  const idade = profile.idade;

  // Fórmula Mifflin–St Jeor (BMR)
  const bmr =
    profile.sexo === "masculino"
      ? 10 * peso + 6.25 * alturaCm - 5 * idade + 5
      : 10 * peso + 6.25 * alturaCm - 5 * idade - 161;

  // Nível de atividade (PAL)
  const pal =
    profile.atividade === "leve"
      ? 1.375
      : profile.atividade === "moderado"
      ? 1.55
      : profile.atividade === "ativo"
      ? 1.725
      : 1.2; // sedentário

  // TDEE (gasto total diário)
  let calorias = bmr * pal;

  // Ajuste por objetivo
  if (profile.objetivo === "emagrecimento") calorias *= 0.85; // -15%
  else if (profile.objetivo === "ganho_massa") calorias *= 1.15; // +15%

  // Piso mínimo para valores realistas
  const caloriasMinimas = profile.sexo === "masculino" ? 1600 : 1200;
  calorias = Math.max(calorias, caloriasMinimas);

  // Distribuição padrão 50% carbs, 25% proteína, 25% gordura
  const carbs_g = (calorias * 0.5) / 4;
  const protein_g = (calorias * 0.25) / 4;
  const fat_g = (calorias * 0.25) / 9;

  return { carbs_g, protein_g, fat_g, calories: calorias };
}

// ✅ Arredonda valores para exibir
export function round1(n: number) {
  return Math.round(n * 10) / 10;
}
