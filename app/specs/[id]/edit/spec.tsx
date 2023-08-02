'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useFieldArray, useForm } from 'react-hook-form'
import * as z from 'zod'

import { Ingredient } from '@/app/specs/[id]/edit/ingredient'
import { SpecIngredientCommandDialogButton } from '@/components/spec-ingredient-command/command-dialog-button'
import { Button, Props as ButtonProps } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { FullScreen } from '@/components/ui/full-screen'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMutate } from '@/hooks/use-mutate'
import { toSpec } from '@/lib/routes'
import { specSchema } from '@/lib/schema/spec'
import { Spec, SpecIngredient } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'

type Schema = z.infer<typeof specSchema>

type Props = {
  spec: Spec
}

export function Spec({ spec }: Props) {
  const { id, name, year, ingredients, notes } = spec

  const router = useRouter()
  const [mutating, mutate] = useMutate(`/api/specs/${id}`)

  const form = useForm<Schema>({
    resolver: zodResolver(specSchema),
    defaultValues: {
      name,
      year,
      ingredients,
      notes,
    },
  })
  const { fields, append, remove, update, move } = useFieldArray({
    control: form.control,
    name: 'ingredients',
    keyName: 'uuid',
  })

  function handleClose() {
    router.push(toSpec(id))
  }

  async function handleSubmit(values: Schema) {
    const updatedAt = new Date().toISOString()
    const change: Spec = { ...spec, ...(values as Spec), updatedAt }
    await mutate({
      method: 'PUT',
      body: JSON.stringify({ spec: change }),
    })
    handleClose()
  }

  return (
    <FullScreen onlySm>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-6 py-4 md:py-6"
        >
          <div
            className={cn(
              'grid gap-6',
              "[grid-template-areas:'actions'_'title']",
              "md:[grid-template-areas:'title_actions']",
              'md:grid-cols-[1fr,auto]'
            )}
          >
            <div className="flex justify-between gap-4 [grid-area:actions]">
              <ResponsiveButton
                type="button"
                variant="secondary"
                onClick={handleClose}
              >
                Cancel
              </ResponsiveButton>
              <ResponsiveButton type="submit" disabled={mutating}>
                Submit
              </ResponsiveButton>
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="[grid-area:title]">
                  <FormControl>
                    <Input
                      className="text-xl font-bold"
                      placeholder="Name..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div
            className={cn(
              'grid gap-6',
              "[grid-template-areas:'meta'_'list'_'notes']",
              "md:[grid-template-areas:'list_meta'_'list_notes']",
              'md:grid-cols-[1fr,1fr]',
              'md:grid-rows-[min-content,1fr]'
            )}
          >
            <div className="flex flex-col gap-3 [grid-area:meta]">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input placeholder="Year..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-3 [grid-area:notes]">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel>Instructions</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Instructions..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-4 [grid-area:list]">
              <Label>Ingredients</Label>
              <div className="flex flex-col gap-3">
                {fields.map((ingredient, i) => (
                  <Ingredient
                    key={`${i}_${ingredient.name ?? ingredient.id}`}
                    ingredient={ingredient as SpecIngredient}
                    index={i}
                    total={fields.length}
                    onUpdate={(it) => update(i, it)}
                    onRemove={() => remove(i)}
                    onMove={(dir) => move(i, i + dir)}
                  />
                ))}
              </div>
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
          </div>
        </form>
      </Form>
    </FullScreen>
  )
}

function ResponsiveButton({ children, ...props }: ButtonProps) {
  return (
    <>
      <Button className="md:hidden" {...props} size="sm">
        {children}
      </Button>
      <Button className="hidden md:block" {...props}>
        {children}
      </Button>
    </>
  )
}
