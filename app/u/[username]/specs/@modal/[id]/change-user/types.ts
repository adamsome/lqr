import { z } from 'zod'

import { SpecSchema } from '@/app/lib/schema/spec'

export const SpecChangeUserSchema = SpecSchema.pick({
  id: true,
  userID: true,
}).extend({
  prevUserID: z.string(),
  username: z.string(),
})

export const specUserIDParam = 'spec-user-id'

export const localStorageKey = 'spec.changeUser'
