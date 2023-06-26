import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useMutate } from '@/hooks/use-mutate'
import { Ingredient } from '@/lib/types'

type Props = {
  ingredient: Ingredient
}

export function ActionCell({ ingredient }: Props) {
  const [fetching, fetch] = useMutate('/api/stock')

  async function handleClick() {
    await fetch({
      method: 'PUT',
      body: JSON.stringify({
        ingredientID: ingredient.id,
        stock: -1,
      }),
    })
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
