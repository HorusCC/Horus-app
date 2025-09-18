// src/services/openFoodFacts.ts

export type Nutrients = {
  carbs_g?: number;
  protein_g?: number;
  fat_g?: number;
  kcal?: number;
};

export type FoodItem = {
  id: string;
  name: string;
  brand?: string;
  imageUrl?: string;

  // base por 100 g
  nutrientsPer100g: Nutrients;

  // por porção/unidade (quando disponível ou inferida)
  serving?: {
    sizeText?: string; // ex.: "1 unidade (50 g)" | "45 g" | "1 porção (30 g)"
    grams?: number; // número em g quando der pra inferir
  };
  nutrientsPerServing?: Nutrients; // valores nativos por porção
};

type SearchResponse = { items: FoodItem[]; pageCount: number };

// campos extras para melhorar a inferência de porção
const FIELDS = [
  "code",
  "product_name",
  "generic_name",
  "brands",
  "brands_tags",
  "image_front_small_url",
  "image_url",
  "serving_size",
  "serving_quantity",
  "number_of_servings",
  "quantity", // string tipo "2 x 50 g" | "45 g"
  "product_quantity", // número (ex.: 180)
  "product_quantity_unit", // "g", "ml", etc.
  "nutriments",
].join(",");

// ---------- helpers de parsing ----------
function toNumber(s?: string | number): number | undefined {
  if (s == null) return undefined;
  const n = typeof s === "number" ? s : Number(String(s).replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
}

function pickFirst<T>(...vals: (T | undefined)[]): T | undefined {
  return vals.find((v) => v !== undefined);
}

// extrai "NN g" do texto (primeira ocorrência)
function extractGrams(text?: string): number | undefined {
  if (!text) return undefined;
  const m = /(\d+(?:[.,]\d+)?)\s*g\b/i.exec(text);
  if (!m) return undefined;
  return toNumber(m[1]);
}

// lida com padrões "2 x 50 g", "6×27 g", "3x 30g"
function extractUnitFromMultipack(quantity?: string): {
  perUnitG?: number;
  totalG?: number;
} {
  if (!quantity) return {};
  // 2 x 50 g  |  6×27 g
  const multi = /(\d+)\s*[x×]\s*(\d+(?:[.,]\d+)?)\s*g\b/i.exec(quantity);
  if (multi) {
    const units = toNumber(multi[1]);
    const per = toNumber(multi[2]);
    if (units && per) return { perUnitG: per, totalG: units * per };
  }
  // simples "45 g"
  const single = /(\d+(?:[.,]\d+)?)\s*g\b/i.exec(quantity);
  if (single) {
    const total = toNumber(single[1]);
    return { totalG: total };
  }
  return {};
}

function buildServing(
  sizeText?: string,
  grams?: number
): FoodItem["serving"] | undefined {
  if (!sizeText && grams == null) return undefined;
  return { sizeText, grams };
}

// ---------- conversão principal ----------
function productToItem(p: any): FoodItem {
  const n = p?.nutriments ?? {};

  const per100g: Nutrients = {
    carbs_g: n.carbohydrates_100g,
    protein_g: n.proteins_100g,
    fat_g: n.fat_100g,
    kcal: n["energy-kcal_100g"] ?? n.energy_kcal_100g,
  };

  // 1) porção nativa (melhor cenário)
  const perServing: Nutrients | undefined =
    n.carbohydrates_serving != null ||
    n.proteins_serving != null ||
    n.fat_serving != null ||
    n["energy-kcal_serving"] != null ||
    n.energy_kcal_serving != null
      ? {
          carbs_g: n.carbohydrates_serving,
          protein_g: n.proteins_serving,
          fat_g: n.fat_serving,
          kcal: n["energy-kcal_serving"] ?? n.energy_kcal_serving,
        }
      : undefined;

  // 2) tentar derivar serving_size textual + grams
  //    ordem de preferência:
  //    a) serving_size/serving_quantity
  //    b) quantity (ex.: "2 x 50 g", "45 g")
  //    c) product_quantity/number_of_servings
  //    d) (fallback fraco) grams no product_name
  const servingSizeText: string | undefined =
    p.serving_size || p.serving_quantity || undefined;

  // a) direto do serving_size
  let gramsFromServing = extractGrams(servingSizeText);

  // b) de quantity (multipack)
  const { perUnitG, totalG } = extractUnitFromMultipack(p.quantity);
  let gramsFromQuantity = perUnitG ?? totalG;

  // c) de product_quantity / number_of_servings
  let gramsFromPQ: number | undefined;
  const pq = toNumber(p.product_quantity);
  const pqUnit = String(p.product_quantity_unit || "").toLowerCase();
  const nos = toNumber(p.number_of_servings);
  if (pq && nos && nos > 0 && (pqUnit === "g" || pqUnit === "")) {
    gramsFromPQ = pq / nos;
  }

  // d) do nome
  const gramsFromName =
    extractGrams(p.product_name) ?? extractGrams(p.generic_name);

  // decidir a gramagem final
  const grams = pickFirst(
    gramsFromServing,
    gramsFromQuantity,
    gramsFromPQ,
    gramsFromName
  );

  // montar sizeText amigável
  let sizeText: string | undefined = servingSizeText;
  if (!sizeText) {
    if (perUnitG) sizeText = `1 unidade (${perUnitG} g)`;
    else if (grams != null) sizeText = `${grams} g`;
    else if (totalG) sizeText = `${totalG} g (total)`;
    else if (p.quantity) sizeText = p.quantity;
  }

  return {
    id: p.code ?? p._id ?? p.id,
    name: p.product_name || p.generic_name || "Produto",
    brand: p.brands_tags?.[0] || p.brands || undefined,
    imageUrl: p.image_front_small_url || p.image_url || undefined,
    nutrientsPer100g: per100g,
    serving: buildServing(sizeText, grams),
    nutrientsPerServing: perServing,
  };
}

// ---------- busca ----------
export async function searchFoodsByName(
  query: string,
  page: number = 1,
  pageSize: number = 24,
  signal?: AbortSignal
): Promise<SearchResponse> {
  const url = new URL("https://world.openfoodfacts.org/cgi/search.pl");
  url.searchParams.set("json", "1");
  url.searchParams.set("search_terms", query);
  url.searchParams.set("page", String(page));
  url.searchParams.set("page_size", String(pageSize));
  url.searchParams.set("fields", FIELDS);

  const res = await fetch(url.toString(), { signal });
  if (!res.ok) throw new Error("Falha ao buscar alimentos");

  const data = await res.json();
  const products = Array.isArray(data.products) ? data.products : [];
  const count = typeof data.count === "number" ? data.count : 0;
  const pageCount = Math.max(1, Math.ceil(count / pageSize));

  return { items: products.map(productToItem), pageCount };
}
