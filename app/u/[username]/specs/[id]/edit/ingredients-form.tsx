import { Control, useFieldArray } from 'react-hook-form'
import { z } from 'zod'

import { Ingredient } from '@/app/u/[username]/specs/[id]/edit/ingredient'
import { SpecIngredientCommandDialogButton } from '@/app/components/spec-ingredient-command/command-dialog-button'
import { Label } from '@/app/components/ui/label'
import { specSchema } from '@/app/lib/schema/spec'
import { SpecIngredient } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'

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
    <div className={cn('flex flex-col gap-4 w-full', className)}>
      <Label>Ingredients</Label>
      {error && <div className="text-destructive text-sm">{error}</div>}
      {ingredients.length > 0 && (
        <div className="flex flex-col gap-3 w-full">
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
        className="self-start max-w-full text-sm text-muted-foreground"
        variant="secondary"
        openOnKey={(e) => (e.metaKey || e.ctrlKey) && e.key === 'j'}
        onSelect={append}
      >
        <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
          Add Ingredient
        </span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>J
        </kbd>
      </SpecIngredientCommandDialogButton>
    </div>
  )
}
