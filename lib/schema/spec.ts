import { z } from 'zod'

import { specIngredientSchema } from '@/lib/schema/spec-ingredient'

export const specSchema = z.object({
  name: z.string().min(2).max(50),
  year: z.number().gt(1000).optional(),
  ingredients: z.array(specIngredientSchema),
  notes: z.string().min(2).max(500).optional(),
})
