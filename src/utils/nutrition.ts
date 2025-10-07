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
  altura: number;
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

// ✅ Calcula meta de macros com base no perfil do usuário
export function calcMacroTargets(profile: UserProfile): MacroTargets {
  const peso = profile.peso;
  let fator = 1.2;
  if (profile.atividade === "leve") fator = 1.375;
  else if (profile.atividade === "moderado") fator = 1.55;
  else if (profile.atividade === "ativo") fator = 1.725;

  // TMB (Harris-Benedict)
  const tmb =
    profile.sexo === "masculino"
      ? 88.36 + 13.4 * peso + 4.8 * profile.altura - 5.7 * profile.idade
      : 447.6 + 9.2 * peso + 3.1 * profile.altura - 4.3 * profile.idade;

  let calorias = tmb * fator;

  if (profile.objetivo === "emagrecimento") calorias -= 300;
  else if (profile.objetivo === "ganho_massa") calorias += 300;

  return {
    carbs_g: (calorias * 0.50) / 4,
    protein_g: (calorias * 0.25) / 4,
    fat_g: (calorias * 0.25) / 9,
    calories: calorias,
  };
}

// ✅ Arredonda valores para exibir
export function round1(n: number) {
  return Math.round(n * 10) / 10;
}
