'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useFieldArray, useForm } from 'react-hook-form'
import * as z from 'zod'

import { Ingredient } from '@/app/spec/[id]/edit/ingredient'
import { IngredientSelect } from '@/app/spec/[id]/edit/ingredient-select'
import { Button, Props as ButtonProps } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { specSchema } from '@/lib/schema/spec'
import { Spec, SpecIngredient } from '@/lib/types'
import { cn } from '@/lib/utils'
import { FullScreen } from '@/components/ui/full-screen'

type Schema = z.infer<typeof specSchema>

type Props = {
  spec: Spec
}

export function Spec({ spec }: Props) {
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
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'ingredients',
    keyName: 'uuid',
  })

  function onSubmit(values: Schema) {
    console.log(values)
  }

  return (
    <FullScreen onlySm>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
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
              <ResponsizeButton asChild variant="secondary">
                <Link href={`/spec/${id}`}>
                  <p className="text-muted-foreground">Cancel</p>
                </Link>
              </ResponsizeButton>
              <ResponsizeButton type="submit">Submit</ResponsizeButton>
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="[grid-area:title]">
                  <FormControl>
                    <Input
                      className="text-xl"
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
              <div className="flex flex-col gap-2">
                {fields.map((ingredient, i) => (
                  <Ingredient
                    key={`${i}_${ingredient.name ?? ingredient.id}`}
                    ingredient={ingredient as SpecIngredient}
                  />
                ))}
              </div>
            </div>
            <div>
              <IngredientSelect onSelect={append} />
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
