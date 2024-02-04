import { z } from 'zod'

import { GLASS_TYPES } from '@/app/lib/glass-type'
import { MIX_TYPES } from '@/app/lib/mix-type'
import { specIngredientSchema } from '@/app/lib/schema/spec-ingredient'
import { SpecStockSchema } from '@/app/lib/schema/spec-stock'
import { SPEC_CATEGORIES } from '@/app/lib/spec-category'

export const SpecSchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(50),
  userID: z.string(),
  username: z.string(),
  userDisplayName: z.string().optional(),
  updatedAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  year: z.number().gt(1000).optional(),
  category: z.enum(SPEC_CATEGORIES).optional(),
  ingredients: z.array(specIngredientSchema).min(1),
  glass: z.enum(GLASS_TYPES).optional(),
  mix: z.enum(MIX_TYPES).optional(),
  notes: z.string().max(500).optional(),
  reference: z.string().max(250).optional(),
  referenceHtml: z.string().max(500).optional(),
  source: z.string().max(250).optional(),
  sourcePage: z.number().positive().optional(),
  basis: z.string().optional(),
  stock: SpecStockSchema.optional(),
})

export const SpecEditSchema = SpecSchema.pick({
  name: true,
  year: true,
  category: true,
  mix: true,
  glass: true,
  ingredients: true,
  notes: true,
  reference: true,
})
