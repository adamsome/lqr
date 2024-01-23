import { VariantProps, cva } from 'class-variance-authority'

import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { User } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'

export type Props = {
  className?: string
  user?: Pick<User, 'displayName' | 'username' | 'imageUrl'> | null
} & VariantProps<typeof variants>

const variants = cva([], {
  variants: {
    size: {
      sm: ['w-4', 'h-4'],
      md: ['w-5', 'h-5'],
      lg: ['w-7', 'h-7'],
      xl: ['w-9', 'h-9', 'sm:w-11', 'sm:h-11'],
      '2xl': ['w-11', 'h-11', 'sm:w-14', 'sm:h-14'],
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export function UserAvatarImage({ className, user, size }: Props) {
  const { displayName, username, imageUrl } = user ?? {}

  const name = user ? displayName ?? username ?? '?' : ''

  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '?')
  if (initials.length < 2 && name[1]) initials.push(name[1].toUpperCase())

  return (
    <Avatar className={cn(variants({ size }), className)}>
      {imageUrl && <AvatarImage src={imageUrl} alt={name} />}
      {user && <AvatarFallback>{initials}</AvatarFallback>}
    </Avatar>
  )
}
