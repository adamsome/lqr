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
} & VariantProps<typeof variants>

const variants = cva(
  ['flex', 'items-center', 'gap-1.5', 'transition-all', 'gap-1.5', 'font-bold'],
  {
    variants: {
      size: {
        sm: ['gap-1.5', 'text-sm'],
        md: ['gap-1.5'],
        lg: ['gap-1.5', 'text-lg'],
        xl: ['gap-3', 'text-2xl', 'sm:text-3xl'],
        '2xl': ['gap-3', 'text-3xl', 'sm:text-3xl'],
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
)

const avatarVariants = cva([], {
  variants: {
    size: {
      sm: ['w-4', 'h-4'],
      md: ['w-5', 'h-5'],
      lg: ['w-7', 'h-7'],
      xl: ['w-9', 'h-9', 'sm:w-11', 'sm:h-11'],
      '2xl': ['w-11', 'h-11', 'sm:w-11', 'sm:h-11'],
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

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
    .map((s) => s[0]?.toUpperCase() ?? '?')
  if (initials.length < 2 && name[1]) initials.push(name[1].toUpperCase())

  let avatar = (
    <Avatar className={cn('w-5 h-5', avatarVariants({ size }))}>
      {imageUrl && <AvatarImage src={imageUrl} alt={name} />}
      {user && <AvatarFallback>{initials}</AvatarFallback>}
    </Avatar>
  )

  return (
    <div
      className={cn(
        variants({ size }),
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
        <span className="tracking-tight overflow-hidden text-ellipsis whitespace-nowrap">
          {name}
        </span>
        {children && <span>{children}</span>}
      </span>
    </div>
  )
}
