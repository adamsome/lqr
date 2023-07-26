import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'

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
        type="button"
        className="text-muted-foreground"
        variant="secondary"
        size="xs"
      >
        <X size={12} onClick={onClear} />
      </Button>
    </div>
  )
}
