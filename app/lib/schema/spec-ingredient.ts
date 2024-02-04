import { z } from 'zod'

export const specIngredientSchema = z.object({
  id: z.string().optional(),
  bottleID: z.string().optional(),
  name: z.string().optional(),
  productionMethod: z.enum(['column', 'pot', 'blended', 'coffey']).optional(),
  aging: z.enum(['none', 'medium', 'light', 'long']).array().optional(),
  black: z.boolean().optional(),
  overproof: z.boolean().optional(),
  infusion: z.string().optional(),
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
})
