import { z } from 'zod'

import { SpecIngredientStockSchema } from '@/app/lib/schema/spec-ingredient-stock'

export const SpecStockSchema = z.object({
  count: z.number(),
  total: z.number(),
  ingredients: z.array(SpecIngredientStockSchema),
})
