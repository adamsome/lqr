import { DotsHorizontalIcon } from '@radix-ui/react-icons'

import { Button } from '@/app/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu'
import { useMutateStock } from '@/app/api/stock/use-mutate-stock'

type Props = {
  ingredientID: string
}

export function ActionCell({ ingredientID }: Props) {
  const { mutate } = useMutateStock()

  async function handleClick() {
    await mutate(ingredientID, -1)
  }

  return (
    <div className="flex w-full justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <DotsHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleClick}>Reset</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
