import { z } from 'zod'

import { specIngredientSchema } from '@/lib/schema/spec-ingredient'

export const specSchema = z.object({
  name: z.string().min(2).max(50),
  source: z.string().min(2).max(50).optional(),
  sourcePage: z.number().gte(0).optional(),
  ingredients: z.array(specIngredientSchema),
})
