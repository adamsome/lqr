import { DotsHorizontalIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useMutate } from '@/hooks/use-mutate'

type Props = {
  ingredientID: string
}

export function ActionCell({ ingredientID }: Props) {
  const [, mutate] = useMutate('/api/stock')

  async function handleClick() {
    await mutate({
      method: 'PUT',
      body: JSON.stringify({
        ingredientID,
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
