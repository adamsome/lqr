'use client'

import { ArrowDownIcon } from '@radix-ui/react-icons'

import { Level } from '@/app/components/layout/level'
import { Button } from '@/app/components/ui/button'
import { Checkbox } from '@/app/components/ui/checkbox'
import { CheckboxLabel } from '@/app/components/ui/checkbox-label'
import { useGetIngredientName } from '@/app/lib/ingredient/use-get-ingredient-name'
import { useMutateStock } from '@/app/api/stock/use-mutate-stock'
import type { Ingredient } from '@/app/lib/types'
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
          (!ingredient || stock < 0 || disabled) &&
            'border-dotted border-muted-foreground/40',
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
          'inline-flex flex-1 items-center gap-2 whitespace-normal py-2 text-sm leading-tight',
          border && 'border-b-primary/5',
          generic && 'font-bold text-muted-foreground/80',
          (disabled || mutating) && 'text-muted-foreground/60',
          labelClassName,
        )}
      >
        <span className="line-clamp-2 overflow-hidden text-ellipsis">
          {name}
        </span>
        {generic && (
          <span className="overflow-hidden text-ellipsis whitespace-nowrap text-xs font-bold uppercase tracking-wide text-muted-foreground/40">
            (any bottle)
          </span>
        )}
        {stock === 0 && !disabled && !disableDestock && isCurrentUser && (
          <div className="me-2.5 flex-1 text-end">
            <Button
              className="-my-0.5 h-auto px-[5px] py-0.5 text-xs text-accent-muted"
              size="sm"
              variant="ghost"
              disabled={mutating}
              onClick={() => handleChange(-1)}
            >
              <ArrowDownIcon className="-ms-0.5 me-0.5 h-3 w-3" />
              Remove
            </Button>
          </div>
        )}
      </CheckboxLabel>
    </Level>
  )
}
