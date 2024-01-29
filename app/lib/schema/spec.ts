import { z } from 'zod'

import { GLASS_TYPES } from '@/app/lib/glass-type'
import { MIX_TYPES } from '@/app/lib/mix-type'
import { specIngredientSchema } from '@/app/lib/schema/spec-ingredient'
import { SPEC_CATEGORIES } from '@/app/lib/spec-category'

export const specSchema = z.object({
  name: z.string().min(2).max(50),
  year: z.number().gt(1000).optional(),
  category: z.enum(SPEC_CATEGORIES).optional(),
  mix: z.enum(MIX_TYPES).optional(),
  glass: z.enum(GLASS_TYPES).optional(),
  ingredients: z.array(specIngredientSchema).min(1),
  notes: z.string().max(500).optional(),
  reference: z.string().max(250).optional(),
})