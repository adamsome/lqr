import { Control, FieldValues, useFieldArray } from 'react-hook-form'

import { Ingredient } from '@/app/specs/[id]/edit/ingredient'
import { SpecIngredientCommandDialogButton } from '@/components/spec-ingredient-command/command-dialog-button'
import { Label } from '@/components/ui/label'
import { SpecIngredient } from '@/lib/types'
import { cn } from '@/lib/utils'
import { z } from 'zod'
import { specSchema } from '@/lib/schema/spec'

type Schema = z.infer<typeof specSchema>

type Props = {
  className?: string
  control: Control<Schema>
}

export function IngredientsForm({ className, control }: Props) {
  const field = useFieldArray({ control, name: 'ingredients', keyName: 'uuid' })
  const { fields: ingredients, append, remove, update, move } = field
  const error = control.getFieldState('ingredients')?.error?.message
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <Label>Ingredients</Label>
      {error && <div className="text-destructive text-sm">{error}</div>}
      {ingredients.length > 0 && (
        <div className="flex flex-col gap-3">
          {ingredients.map((ingredient, i) => (
            <Ingredient
              key={`${i}_${ingredient.name ?? ingredient.id}`}
              ingredient={ingredient as SpecIngredient}
              index={i}
              total={ingredients.length}
              onUpdate={(it) => update(i, it)}
              onRemove={() => remove(i)}
              onMove={(dir) => move(i, i + dir)}
            />
          ))}
        </div>
      )}
      <SpecIngredientCommandDialogButton
        className="self-start"
        variant="secondary"
        openOnKey={(e) => (e.metaKey || e.ctrlKey) && e.key === 'j'}
        onSelect={append}
      >
        <p className="flex gap-2 text-sm text-muted-foreground">
          Add Ingredient
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>J
          </kbd>
        </p>
      </SpecIngredientCommandDialogButton>
    </div>
  )
}
