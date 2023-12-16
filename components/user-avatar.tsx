import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { VariantProps, cva } from 'class-variance-authority'
import { ReactNode } from 'react'

type User = {
  displayName?: string | null
  username?: string | null
  imageUrl?: string | null
}

export type Props = {
  children?: ReactNode
  className?: string
  user?: User | null
  hideName?: boolean
} & VariantProps<typeof usernameVariants>

const usernameVariants = cva(['gap-1.5'], {
  variants: {
    size: {
      sm: ['gap-1.5', 'text-sm'],
      md: ['gap-1.5'],
      lg: ['gap-3', 'text-2xl', 'sm:text-3xl'],
      xl: ['gap-3', 'text-3xl', 'sm:text-3xl'],
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
      lg: ['w-9', 'h-9', 'sm:w-11', 'sm:h-11'],
      xl: ['w-11', 'h-11', 'sm:w-11', 'sm:h-11'],
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

const childrenVariants = cva(
  ['flex', 'items-center', 'leading-tight', 'text-muted-foreground'],
  {
    variants: {
      size: {
        sm: ['text-xs'],
        md: ['text-xs'],
        lg: ['text-sm'],
        xl: ['text-sm'],
      },
      defaultVartiants: {
        size: 'md',
      },
    },
  },
)

export function UserAvatar({
  children,
  className,
  user,
  size,
  hideName,
}: Props) {
  const { displayName, username, imageUrl } = user ?? {}

  const name = user ? displayName ?? username ?? '?' : ''

  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((s) => s[0] ?? '?')
  if (initials.length < 2 && name[1]) initials.push(name[1])

  let avatar = (
    <Avatar className={cn('w-5 h-5', avatarVariants({ size }))}>
      {imageUrl && <AvatarImage src={imageUrl} alt={name} />}
      {user && <AvatarFallback>{initials}</AvatarFallback>}
    </Avatar>
  )

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 font-semibold transition-all',
        usernameVariants({ size }),
        { 'gap-0': hideName || !user },
        className,
      )}
    >
      {avatar}
      <span
        className={cn('flex flex-col w-full overflow-hidden transition-all', {
          'w-0 opacity-0': hideName || !user,
          'leading-none': children,
        })}
      >
        <span>{name}</span>
        {children && (
          <span className={cn(childrenVariants({ size }))}>{children}</span>
        )}
      </span>
    </div>
  )
}
