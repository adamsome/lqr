import baseIngredients from '@/json/base-ingredients.json'
import tree from '@/json/category-filter.json'
import ingredients from '@/json/ingredients.json'
import { StaticData } from '@/app/lib/types'

import 'server-only'

// Bundled at build time (no file reads or HTTP self-fetch at runtime)
const STATIC_DATA = {
  baseIngredients,
  ingredients,
  tree,
} as unknown as StaticData

// Returns a fresh copy: callers build per-user data by mutating these objects
export async function getStaticData(): Promise<StaticData> {
  return structuredClone(STATIC_DATA)
}
