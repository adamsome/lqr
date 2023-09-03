import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { VariantProps, cva } from 'class-variance-authority'

type User = {
  displayName?: string | null
  username?: string | null
  imageUrl?: string | null
}

type Props = {
  className?: string
  user?: User | null
  hideName?: boolean
} & VariantProps<typeof usernameVariants>

const usernameVariants = cva(['gap-1.5'], {
  variants: {
    size: {
      sm: ['gap-1.5', 'text-sm'],
      md: ['gap-1.5'],
      lg: ['gap-2', 'text-lg'],
      xl: ['gap-2', 'text-xl'],
      '2xl': ['gap-3', 'text-2xl'],
      '3xl': ['gap-3', 'text-2xl', 'sm:text-3xl'],
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

const avatarVariants = cva([], {
  variants: {
    size: {
      sm: ['w-4', 'h-4'],
      md: ['w-5', 'h-5'],
      lg: ['w-6', 'h-6'],
      xl: ['w-7', 'h-7'],
      '2xl': ['w-8', 'h-8'],
      '3xl': ['w-9', 'h-9', 'sm:w-11', 'sm:h-11'],
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export function UserAvatar({ className, user, size, hideName }: Props) {
  if (!user) return null

  const { displayName, username, imageUrl } = user

  const name = displayName ?? username ?? '?'

  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((s) => s[0] ?? '?')
  if (initials.length < 2 && name[1]) initials.push(name[1])

  let avatar = (
    <Avatar className={cn('w-5 h-5', avatarVariants({ size }))}>
      {imageUrl && <AvatarImage src={imageUrl} alt={name} />}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  )

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 font-semibold transition-all',
        usernameVariants({ size }),
        { 'gap-0': hideName },
        className,
      )}
    >
      {avatar}
      <span
        className={cn('w-full overflow-hidden transition-all', {
          'w-0 opacity-0': hideName,
        })}
      >
        {name}
      </span>
    </div>
  )
}
