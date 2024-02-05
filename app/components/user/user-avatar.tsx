import { VariantProps, cva } from 'class-variance-authority'
import { ReactNode } from 'react'

import { UserAvatarImage } from '@/app/components/user/user-avatar-image'
import { User } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'

export type Props = {
  children?: ReactNode
  className?: string
  user?: Pick<User, 'displayName' | 'username' | 'imageUrl'> | null
  hideName?: boolean
} & VariantProps<typeof variants>

const variants = cva(
  ['flex', 'items-center', 'gap-1.5', 'transition-all', 'font-semibold'],
  {
    variants: {
      size: {
        sm: ['gap-1.5', 'text-sm'],
        md: ['gap-1.5'],
        lg: ['gap-1.5', 'text-lg'],
        xl: ['gap-3', 'text-2xl', 'sm:text-3xl'],
        '2xl': ['gap-3', 'text-3xl'],
      },
    },
    defaultVariants: {
      size: 'md',
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
  const { displayName, username } = user ?? {}
  const name = user ? displayName ?? username ?? '?' : ''
  return (
    <div
      className={cn(
        variants({ size }),
        (hideName || !user) && 'gap-0',
        className,
      )}
    >
      <UserAvatarImage className="self-center" user={user} size={size} />
      <span
        className={cn(
          'flex flex-col w-full overflow-hidden transition-all',
          (hideName || !user) && 'w-0 opacity-0',
          children && 'leading-none',
        )}
      >
        <span className="tracking-tight overflow-hidden text-ellipsis whitespace-nowrap">
          {name}
        </span>
        {children && <span>{children}</span>}
      </span>
    </div>
  )
}
