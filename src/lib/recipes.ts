import type { ProductType } from '../data/products';

export type Recipe = {
  id: string;
  title: string;
  image: string;
  sourceUrl: string;
  source: 'forkify' | 'mealdb';
};

const toHumanUrl = (title: string, preferred?: string) => {
  if (preferred && /^https?:\/\//i.test(preferred)) return preferred;
  return `https://duckduckgo.com/?q=${encodeURIComponent(`${title} recipe`)}`;
};

export function deriveIngredient(productName: string): string {
  const name = productName.toLowerCase();
  const known = [
    'apple',
    'banana',
    'orange',
    'lemon',
    'lime',
    'strawberry',
    'blueberry',
    'raspberry',
    'avocado',
    'tomato',
    'cucumber',
    'carrot',
    'lettuce',
    'potato',
    'milk',
    'yogurt',
    'cheese',
    'butter',
    'egg',
    'eggs',
  ];
  for (const k of known) if (name.includes(k)) return k;
  const token = name.match(/[a-z]+/g)?.[0];
  return token ?? name.trim();
}

async function fetchForkify(q: string, limit = 3): Promise<Recipe[]> {
  const url = `https://forkify-api.herokuapp.com/api/v2/recipes?search=${encodeURIComponent(
    q
  )}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Forkify request failed');
  const json = await res.json();
  const list: any[] = json?.data?.recipes ?? [];
  return list.slice(0, limit).map((r) => {
    const title = String(r.title);
    const srcUrl = toHumanUrl(title, r.source_url);
    return {
      id: String(r.id),
      title,
      image: String(r.image_url),
      sourceUrl: srcUrl,
      source: 'forkify' as const,
    };
  });
}

async function fetchMealDB(q: string, limit = 3): Promise<Recipe[]> {
  const filterUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(
    q
  )}`;
  const res = await fetch(filterUrl);
  if (!res.ok) throw new Error('TheMealDB filter failed');
  const json = await res.json();
  const meals: any[] = json?.meals ?? [];
  const chosen = meals.slice(0, limit);

  if (chosen.length === 0) return [];

  const details = await Promise.all(
    chosen.map(async (m) => {
      const id = m.idMeal;
      try {
        const detRes = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        if (!detRes.ok) throw new Error('lookup failed');
        const detJson = await detRes.json();
        const meal = detJson?.meals?.[0];
        const title = String(meal?.strMeal ?? m.strMeal);
        const srcUrl = toHumanUrl(title, meal?.strSource || meal?.strYoutube);
        return {
          id: String(id),
          title,
          image: String(meal?.strMealThumb ?? m.strMealThumb),
          sourceUrl: srcUrl,
          source: 'mealdb' as const,
        } as Recipe;
      } catch {
        const title = String(m.strMeal);
        return {
          id: String(id),
          title,
          image: String(m.strMealThumb),
          sourceUrl: toHumanUrl(title),
          source: 'mealdb' as const,
        } as Recipe;
      }
    })
  );

  return details;
}

export async function fetchRecipes(params: {
  type: ProductType;
  ingredient: string;
  limit?: number;
}): Promise<Recipe[]> {
  const { ingredient, limit = 3 } = params;
  const q = ingredient.trim();
  if (!q) return [];
  try {
    const a = await fetchForkify(q, limit);
    if (a.length) return a;
  } catch {}
  try {
    return await fetchMealDB(q, limit);
  } catch {}
  return [];
}
