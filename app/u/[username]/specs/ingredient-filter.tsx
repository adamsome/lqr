import { Cross1Icon } from '@radix-ui/react-icons'

import { Button } from '@/app/components/ui/button'

type Props = {
  name: string
  onClear(): void
}

export function IngredientFilter({ name, onClear }: Props) {
  return (
    <div
      key={name}
      className="flex w-full items-center justify-between text-sm"
    >
      {name}
      <Button
        className="font-normal"
        type="button"
        variant="secondary"
        size="xs"
      >
        <Cross1Icon onClick={onClear} />
      </Button>
    </div>
  )
}
