import { DotsHorizontalIcon } from '@radix-ui/react-icons'

import { Button } from '@/app/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu'
import { getCurrentUser } from '@/app/lib/model/user'
import type { CompProps } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'

type Props = CompProps

export async function MoreMenu({ children, className }: Props) {
  const { isAdmin } = await getCurrentUser()
  if (!isAdmin) return null
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn('h-6 w-6 p-0 text-muted-foreground', className)}
          variant="ghost"
        >
          <span className="sr-only">Open menu</span>
          <DotsHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44" align="end">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
