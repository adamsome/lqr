'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons'
import { useEffect } from 'react'
import { FieldErrors, useForm } from 'react-hook-form'
import * as z from 'zod'

import { IngredientsForm } from '@/app/u/[username]/specs/[id]/edit/ingredients-form'
import * as Layout from '@/components/responsive-layout'
import { Button, IconButton } from '@/components/ui/button'
import { FullWidthContainer } from '@/components/ui/container'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { getGlassTypeItems } from '@/lib/glass-type'
import { getMixTypeItems } from '@/lib/mix-type'
import { specSchema } from '@/lib/schema/spec'
import { getSpecCategoryItems } from '@/lib/spec-category'
import { Spec } from '@/lib/types'
import { cn } from '@/lib/utils'

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
  const { toast } = useToast()
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

  function handleInvalid(err: FieldErrors<Schema>) {
    console.error(err)
    toast({ title: `Invalid Spec`, variant: 'destructive' })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, handleInvalid)}>
        <Layout.Root>
          <Layout.Header>
            <Button
              type="button"
              className="hidden sm:block ms-4"
              variant="secondary"
              size="sm"
              onClick={onClose}
            >
              <span>Cancel</span>
            </Button>
            <Layout.Actions>
              <Button type="submit" size="sm" disabled={mutating}>
                Save
              </Button>
            </Layout.Actions>
          </Layout.Header>

          <FullWidthContainer>
            <div className="flex flex-col gap-6 py-4 md:py-6">
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
              <div
                className={cn(
                  'grid gap-6 w-full',
                  'grid-cols-1',
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
                            rows={4}
                            {...field}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reference"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1">
                        <FormLabel>Reference</FormLabel>
                        <FormControl>
                          <Input
                            className=""
                            placeholder="Name..."
                            {...field}
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
            </div>
          </FullWidthContainer>

          <Layout.Footer>
            <IconButton onClick={onClose}>
              <Cross2Icon className="w-6 h-6" />
            </IconButton>
            <Button
              type="submit"
              className="h-8 gap-1.5 me-2 px-3"
              variant="default"
              size="xs"
              disabled={mutating}
            >
              Save
            </Button>
          </Layout.Footer>
        </Layout.Root>
      </form>
    </Form>
  )
}
