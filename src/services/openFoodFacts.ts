export type FoodItem = {
  id: string;
  name: string;
  brand?: string;
  imageUrl?: string;
  ingredients?: string;
  // valores por 100g
  nutrientsPer100g: {
    kcal?: number;
    protein_g?: number;
    fat_g?: number;
    carbs_g?: number;
  };
};

type OffSearchResponse = {
  products: Array<{
    code?: string;
    product_name?: string;
    brands?: string;
    image_front_url?: string;
    ingredients_text?: string;
    nutriments?: Record<string, number | string>;
  }>;
  page?: number;
  page_count?: number;
};

export async function searchFoodsByName(
  q: string,
  page = 1,
  pageSize = 24,
  signal?: AbortSignal
): Promise<{ items: FoodItem[]; page: number; pageCount: number }> {
  const params = new URLSearchParams({
    search_terms: q,
    search_simple: "1",
    action: "process",
    json: "1",
    page: String(page),
    page_size: String(pageSize),
    lc: "pt",
    fields: "code,product_name,brands,image_front_url,ingredients_text,nutriments",
  });

  const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?${params}`, { signal });
  if (!res.ok) throw new Error(`OFF ${res.status}`);

  const data = (await res.json()) as OffSearchResponse;
  return {
    items: (data.products ?? []).map(mapProduct),
    page: data.page ?? page,
    pageCount: data.page_count ?? page,
  };
}

const mapProduct = (p: any): FoodItem => {
  const n = p?.nutriments ?? {};
  const toNum = (v: unknown) => (v == null || v === "" ? undefined : Number(v));
  return {
    id: p.code ?? Math.random().toString(36).slice(2),
    name: p.product_name || "Produto sem nome",
    brand: p.brands || undefined,
    imageUrl: p.image_front_url || undefined,
    ingredients: p.ingredients_text || undefined,
    nutrientsPer100g: {
      kcal: toNum(n["energy-kcal_100g"]),
      protein_g: toNum(n["proteins_100g"]),
      fat_g: toNum(n["fat_100g"]),
      carbs_g: toNum(n["carbohydrates_100g"]),
    },
  };
};
