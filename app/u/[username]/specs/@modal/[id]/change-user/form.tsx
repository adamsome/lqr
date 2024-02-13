'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import { intlFormatDistance, parseISO } from 'date-fns/fp'
import { useRouter } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'
import { useFormStatus } from 'react-dom'
import {
  useForm,
  type Control,
  type FieldValues,
  type SubmitHandler,
  type UseFormProps,
} from 'react-hook-form'
import type { z } from 'zod'

import { Level } from '@/app/components/layout/level'
import { Stack } from '@/app/components/layout/stack'
import { Button } from '@/app/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form as FormRoot,
} from '@/app/components/ui/form'
import { Loader } from '@/app/components/ui/loader'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import { useToast } from '@/app/components/ui/use-toast'
import { UserAvatar } from '@/app/components/user/user-avatar'
import type { Spec, User } from '@/app/lib/types'
import {
  changeUser,
  type Response,
} from '@/app/u/[username]/specs/@modal/[id]/change-user/action'
import {
  SpecChangeUserSchema,
  localStorageKey,
} from '@/app/u/[username]/specs/@modal/[id]/change-user/types'

type Schema = z.infer<typeof SpecChangeUserSchema>

export function useFormAction<
  TResponse,
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined,
>(props?: UseFormProps<TFieldValues, TContext>) {
  const form = useForm<TFieldValues, TContext, TTransformedValues>(props)

  const handleAction = async (onAction: SubmitHandler<TFieldValues>) => {
    const valid = await form.trigger()
    if (valid) {
      return onAction(form.getValues()) as TResponse
    }
  }

  return { ...form, handleAction }
}

type Props = {
  spec: Spec
  username: string
  currentUser: User
  specUser: User
  users: User[]
}

export function Form({ spec, username, currentUser, specUser, users }: Props) {
  const router = useRouter()
  const { toast } = useToast()

  const isUserSpec = spec.userID === currentUser.id
  const userOptions = [...(!isUserSpec ? [currentUser] : []), ...users]

  const lastUserID = localStorage.getItem(localStorageKey)
  const defaultUser = userOptions.find(({ id }) => id === lastUserID)
  const defaultValues = {
    id: spec.id,
    userID: defaultUser?.id ?? (isUserSpec ? users[0]?.id : currentUser.id),
    prevUserID: spec.userID,
    username,
  }

  const form = useFormAction<Response, Schema>({
    resolver: zodResolver(SpecChangeUserSchema),
    defaultValues,
  })

  useEffect(() => form.setFocus('userID'), [form])

  const { updatedAt } = spec
  const updatedDistance = intlFormatDistance(new Date(), parseISO(updatedAt))
  const lastUpdated = `Last updated ${updatedDistance}`

  return (
    <FormRoot {...form}>
      <form
        action={async () => {
          const response = await form.handleAction(changeUser)
          if (!response) return
          toast({
            title: response.ok ? '' : 'Could not change user',
            description: response.ok ? response.message : response.error,
            variant: response.ok ? 'default' : 'destructive',
          })
          if (response.ok) router.back()
        }}
      >
        <Content
          control={form.control}
          specUser={specUser}
          userOptions={userOptions}
          lastUpdated={
            <p className="text-muted-foreground/60 text-sm">{lastUpdated}</p>
          }
        />
      </form>
    </FormRoot>
  )
}

function Item({ user }: { user: User }) {
  return (
    <SelectItem value={user.id}>
      <UserAvatar user={user} />
    </SelectItem>
  )
}

type ContentProps = {
  control: Control<Schema>
  specUser: User
  userOptions: User[]
  lastUpdated: ReactNode
}

function Content({
  control,
  specUser,
  userOptions,
  lastUpdated,
}: ContentProps) {
  const router = useRouter()
  const { pending } = useFormStatus()
  return (
    <Stack gap={4}>
      <Stack gap={4}>
        <FormField
          control={control}
          name="userID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Spec User</FormLabel>
              <Level>
                <Select defaultValue={specUser.id} disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="Spec User..." />
                  </SelectTrigger>
                  <SelectContent>
                    <Item user={specUser} />
                  </SelectContent>
                </Select>
                <ArrowRightIcon className="flex-shrink-0 text-accent-foreground" />
                <Select
                  onValueChange={(value) => {
                    localStorage.setItem(localStorageKey, value)
                    field.onChange(value)
                  }}
                  defaultValue={field.value}
                  disabled={pending}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Spec User..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {userOptions.map((user) => (
                      <Item key={user.id} user={user} />
                    ))}
                  </SelectContent>
                </Select>
              </Level>
              <FormMessage />
            </FormItem>
          )}
        />
        {lastUpdated}
      </Stack>
      <Level className="flex-row-reverse" justify="start" gap={4}>
        <Button className="w-20" type="submit" size="sm" disabled={pending}>
          {pending ? <Loader invert loading /> : 'Save'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={pending}
          onClick={() => router.back()}
        >
          <span>Cancel</span>
        </Button>
      </Level>
    </Stack>
  )
}
