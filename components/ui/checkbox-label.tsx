import { ComponentPropsWithoutRef, ReactNode, forwardRef } from 'react'

import { Checkbox, Props as CheckboxProps } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

type Props = CheckboxProps & {
  id: string
  children: ReactNode
}

export function CheckboxWithLabel({ id, children, ...props }: Props) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={id} {...props} />
      <CheckboxLabel className="text-sm font-medium leading-none" htmlFor={id}>
        {children}
      </CheckboxLabel>
    </div>
  )
}

export const CheckboxLabel = forwardRef<
  HTMLLabelElement,
  ComponentPropsWithoutRef<'label'>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      'overflow-hidden whitespace-nowrap text-ellipsis cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className,
    )}
    {...props}
  />
))
CheckboxLabel.displayName = 'CheckboxLabel'
