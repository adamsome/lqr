'use client'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { CheckIcon, MinusIcon } from '@radix-ui/react-icons'
import { forwardRef } from 'react'

import { cn } from '@/app/lib/utils'

export type Props = React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
> & {
  circle?: boolean
}

const Checkbox = forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  Props
>(({ className, circle, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      '[--checkbox-bg]',
      'peer h-4 w-4 shrink-0 rounded-sm border border-primary',
      'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-30',
      'data-[state=checked]:text-primary-foreground',
      'data-[state=indeterminate]:text-primary-foreground',
      !circle && 'data-[state=checked]:bg-primary',
      !circle && 'data-[state=indeterminate]:bg-primary',
      circle && 'p-px w-4.5 h-4.5 rounded-full',
      circle && !props.checked && 'border-primary/30',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn(
        'flex items-center justify-center text-current',
        circle &&
          'w-full h-full rounded-full data-[state=checked]:bg-primary data-[state=indeterminate]:bg-primary/60',
      )}
    >
      {props.checked === 'indeterminate' && <MinusIcon className="h-3 w-4" />}
      {!circle && props.checked === true && <CheckIcon className="h-4 w-4" />}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
