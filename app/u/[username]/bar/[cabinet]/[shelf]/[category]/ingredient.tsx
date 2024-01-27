'use client'

import { ArrowDownIcon } from '@radix-ui/react-icons'

import { Level } from '@/app/components/layout/level'
import { Button } from '@/app/components/ui/button'
import { Checkbox } from '@/app/components/ui/checkbox'
import { CheckboxLabel } from '@/app/components/ui/checkbox-label'
import { useGetIngredientName } from '@/app/lib/ingredient/use-get-ingredient-name'
import { useMutateStock } from '@/app/api/stock/use-mutate-stock'
import { Ingredient } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'

type Props = {
  className?: string
  labelClassName?: string
  ingredient?: Ingredient
  name?: string
  border?: boolean
  generic?: boolean
  disabled?: boolean
  disableDestock?: boolean
  isCurrentUser?: boolean
}

export function Ingredient({
  className,
  labelClassName,
  ingredient,
  name: nameProp = '',
  border = true,
  generic,
  disabled,
  disableDestock,
  isCurrentUser,
}: Props) {
  const { id, stock = -1 } = ingredient ?? {}

  const { mutating, mutate } = useMutateStock({ watchData: stock })

  const getIngredientName = useGetIngredientName()
  let name = nameProp
  if (!name && ingredient) {
    name = getIngredientName(ingredient, { inclBottle: true })
  }

  const handleChange = async (value: number) => {
    if (mutating || disabled || !isCurrentUser || !id) return
    await mutate(id, value)
  }

  return (
    <Level
      className={cn(
        '-me-4',
        border && '[&:not(:last-child)>label]:border-b',
        className,
      )}
      gap={2}
    >
      <Checkbox
        className={cn(
          (!ingredient || stock < 0 || disabled) && 'border-dotted',
        )}
        circle
        id={id}
        checked={stock > 0}
        disabled={disabled || mutating}
        onCheckedChange={(checked) => handleChange(checked ? 1 : 0)}
      />
      <CheckboxLabel
        htmlFor={id}
        className={cn(
          'flex-1 inline-flex items-center gap-2 py-2 text-sm whitespace-normal leading-tight',
          border && 'border-b-primary/5',
          generic && 'text-muted-foreground/80 font-bold',
          (disabled || mutating) && 'text-muted-foreground/60',
          labelClassName,
        )}
      >
        <span className="line-clamp-2 text-ellipsis overflow-hidden">
          {name}
        </span>
        {generic && (
          <span className="text-muted-foreground/40 text-xs font-bold tracking-wide uppercase whitespace-nowrap text-ellipsis overflow-hidden">
            (any bottle)
          </span>
        )}
        {stock === 0 && !disabled && !disableDestock && isCurrentUser && (
          <div className="flex-1 me-4">
            <Button
              className="px-[5px] py-0.5 -my-0.5 h-auto text-xs text-muted-foreground/80 hover:text-muted-foreground rounded-sm"
              size="sm"
              variant="secondary"
              disabled={mutating}
              onClick={() => handleChange(-1)}
            >
              <ArrowDownIcon className="w-3 h-3 -ms-0.5 me-0.5" />
              Remove
            </Button>
          </div>
        )}
      </CheckboxLabel>
    </Level>
  )
}
