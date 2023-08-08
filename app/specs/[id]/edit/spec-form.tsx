'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { IngredientsForm } from '@/app/specs/[id]/edit/ingredients-form'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { getGlassTypeItems } from '@/lib/glass-type'
import { getMixTypeItems } from '@/lib/mix-type'
import { specSchema } from '@/lib/schema/spec'
import { getSpecCategoryItems } from '@/lib/spec-category'
import { Spec } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'

type Schema = z.infer<typeof specSchema>

type Props = {
  spec?: Partial<Spec>
  showDelete?: boolean
  mutating?: boolean
  onSubmit(values: Schema): void
  onClose(): void
  onDelete?: () => void
}

const CATEGORY_ITEMS = getSpecCategoryItems()
const MIX_ITEMS = getMixTypeItems()
const GLASS_ITEMS = getGlassTypeItems()

export function SpecForm({
  spec,
  showDelete,
  mutating,
  onSubmit,
  onClose,
  onDelete,
}: Props) {
  const form = useForm<Schema>({
    resolver: zodResolver(specSchema),
    defaultValues: spec ?? {
      ingredients: [],
      name: '',
      notes: '',
    },
  })

  useEffect(() => {
    form.setFocus('name')
  }, [form])

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
              'md:grid-cols-[1fr,auto]',
            )}
          >
            <div className="flex justify-between gap-4 [grid-area:actions]">
              <ResponsiveButton
                type="button"
                variant="secondary"
                onClick={onClose}
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
              'md:grid-rows-[min-content,1fr]',
            )}
          >
            <div className="flex flex-col gap-3 [grid-area:meta]">
              <FormField
                control={form.control}
                name="year"
                render={({ field, fieldState }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Year..."
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const val = e.target.value
                          return field.onChange(val ? +val : undefined)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Category..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORY_ITEMS.map(({ value, label }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mix"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel>Method</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Shaken or stirred..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MIX_ITEMS.map(({ value, label }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="glass"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel>Glass</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Glass..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {GLASS_ITEMS.map(({ value, label }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-6 [grid-area:notes]">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel>Instructions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Instructions..."
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value || undefined)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {showDelete && (
                <Button
                  variant="destructive"
                  disabled={mutating}
                  onClick={onDelete}
                >
                  Delete
                </Button>
              )}
            </div>
            <IngredientsForm
              className="[grid-area:list]"
              control={form.control}
            />
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
