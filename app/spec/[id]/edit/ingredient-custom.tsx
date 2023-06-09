import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { specSchema } from '@/lib/schema/spec'
import { AmountSelect } from '@/app/spec/[id]/edit/amount-select'

type Schema = z.infer<typeof specSchema>

type Props = {
  form: UseFormReturn<Schema>
  index: number
}

export function IngredientCustom({ form, index }: Props) {
  return (
    <div className="flex gap-2">
      <FormField
        control={form.control}
        name={`ingredients.${index}.amount`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <AmountSelect {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`ingredients.${index}.name`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Input placeholder="Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
