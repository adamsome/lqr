import { z } from 'zod'

export const SpecIngredientStockSchema = z.object({
  type: z.enum(['bottle', 'category', 'custom', 'ignore']),
  stock: z.number(),
  bottles: z
    .object({
      id: z.string(),
      stock: z.number(),
    })
    .array()
    .optional(),
})
