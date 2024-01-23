import { z } from 'zod'

export const specIngredientSchema = z.object({
  id: z.string().optional(),
  bottleID: z.string().optional(),
  name: z.string().optional(),
  quantity: z.number().optional(),
  unit: z.enum(['oz', 'tsp', 'dash', 'cube']).optional(),
  usage: z
    .enum([
      'rim',
      'twist',
      'grated',
      'wheel',
      'wedge',
      'whole',
      'float',
      'top',
      'rinse',
      'muddled',
    ])
    .optional(),
  productionMethod: z.string().optional(),
  aging: z.string().array().optional(),
  black: z.boolean().optional(),
  overproof: z.boolean().optional(),
  infusion: z.string().optional(),
})
