'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import * as z from 'zod'

import { Ingredient } from '@/app/spec/[id]/edit/ingredient'
import { IngredientCommandDialogButton } from '@/components/ingredient-command/ingredient-command-dialog-button'
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
import { useRefresh } from '@/hooks/use-refresh'
import { specSchema } from '@/lib/schema/spec'
import { Spec, SpecIngredient } from '@/lib/types'
import { cn } from '@/lib/utils'

type Schema = z.infer<typeof specSchema>

type Props = {
  spec: Spec
}

export function Spec({ spec }: Props) {
  const router = useRouter()
  const { refresh } = useRefresh()
  const [fetching, setFetching] = useState(false)
  const { id, name, ingredients, source, sourcePage } = spec

  const form = useForm<Schema>({
    resolver: zodResolver(specSchema),
    defaultValues: {
      name,
      source,
      sourcePage,
      ingredients,
    },
  })
  const { fields, append, remove, update, move } = useFieldArray({
    control: form.control,
    name: 'ingredients',
    keyName: 'uuid',
  })

  function handleClose() {
    router.push(`/spec/${id}`)
  }

  async function handleSubmit(values: Schema) {
    setFetching(true)
    const updatedAt = new Date().toISOString()
    const change: Spec = { ...spec, ...(values as Spec), updatedAt }
    try {
      await fetch(`/api/specs/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ spec: change }),
      })
    } catch (err: any) {
      console.error(`Error updating spec '${name}'`, err?.data ?? err)
    }
    refresh()
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
              <ResponsizeButton variant="secondary" onClick={handleClose}>
                Cancel
              </ResponsizeButton>
              <ResponsizeButton disabled={fetching} type="submit">
                Submit
              </ResponsizeButton>
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
              "[grid-template-areas:'meta'_'list']",
              "md:[grid-template-areas:'list_meta']",
              'md:grid-cols-[1fr,theme(spacing.72)]',
              'lg:grid-cols-[1fr,theme(spacing.96)]'
            )}
          >
            <div className="flex flex-col gap-3 [grid-area:meta]">
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4">
                    <FormLabel className="w-24 md:text-right">Source</FormLabel>
                    <FormControl>
                      <Input placeholder="Source..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sourcePage"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4">
                    <FormLabel className="w-24 md:text-right">Page #</FormLabel>
                    <FormControl>
                      <Input
                        type="numeric"
                        placeholder="Pg..."
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-6 [grid-area:list] md:mt-3">
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
            </div>
            <div>
              <IngredientCommandDialogButton
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
              </IngredientCommandDialogButton>
            </div>
          </div>
        </form>
      </Form>
    </FullScreen>
  )
}

function ResponsizeButton({ children, ...props }: ButtonProps) {
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
