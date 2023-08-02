'use client'

import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { ReactElement, Ref, forwardRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

type Option<T> = {
  value: T
  label: string
}

function getOptionValue<T>(
  options: Option<T>[],
  label?: string
): T | undefined {
  if (label === undefined) return
  return options.find((o) => o.label === label)?.value
}

type Props<T> = {
  name: string
  options: Option<T>[]
  value?: T
  onChange(value?: T): void
}

function _Combobox<T>(
  { name, options, value: valueProp, onChange, ...props }: Props<T>,
  ref: Ref<HTMLButtonElement>
) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<T | undefined>(valueProp)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between text-muted-foreground"
          name={name}
          // ref={ref}
          {...props}
        >
          {value ? options.find((o) => o.value === value)?.label : 'Amt'}
          <CaretSortIcon className="ml-2 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No items found.</CommandEmpty>
          <CommandGroup>
            {options.map((o) => (
              <CommandItem
                key={String(o.value)}
                onSelect={(label) => {
                  const value = getOptionValue(options, label)
                  setValue(value)
                  setOpen(false)
                  onChange(value)
                }}
              >
                <CheckIcon
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === o.value ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {o.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// Cast the output
export const Combobox = forwardRef(_Combobox) as <T>(
  p: Props<T> & { ref?: Ref<HTMLButtonElement> }
) => ReactElement

_Combobox.displayName = 'Combobox'
