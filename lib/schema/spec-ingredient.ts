import { z } from 'zod'

export const specIngredientSchema = z.object({
  id: z.string().optional(),
  bottleID: z.string().optional(),
  name: z.string().optional(),
  amount: z.number().optional(),
  amountType: z.string().optional(),
  productionMethod: z.string().optional(),
  aging: z.string().array().optional(),
  black: z.boolean().optional(),
  overproof: z.boolean().optional(),
  infusion: z.string().optional(),
})
