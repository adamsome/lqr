import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRefresh } from '@/hooks/use-refresh'
import { Ingredient } from '@/lib/types'

type Props = {
  ingredient: Ingredient
}

export function ActionCell({ ingredient }: Props) {
  const { refresh } = useRefresh()

  async function handleClick() {
    await fetch('/api/stock', {
      method: 'PUT',
      body: JSON.stringify({
        ingredientID: ingredient.id,
        stock: -1,
      }),
    })
    refresh()
  }

  return (
    <div className="flex w-full justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleClick}>Reset</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
