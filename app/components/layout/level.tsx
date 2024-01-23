import { VariantProps, cva } from 'class-variance-authority'
import { HTMLAttributes, forwardRef } from 'react'

import { CompProps } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'

const variants = cva('flex', {
  variants: {
    gap: {
      0: 'gap-0',
      0.25: 'gap-px',
      0.5: 'gap-0.5',
      0.75: 'gap-[3px]',
      1: 'gap-1',
      1.5: 'gap-1.5',
      2: 'gap-2',
      2.5: 'gap-2.5',
      3: 'gap-3',
      3.5: 'gap-3.5',
      4: 'gap-4',
      4.5: 'gap-4.5',
      5: 'gap-5',
      6: 'gap-6',
      7: 'gap-7',
      8: 'gap-8',
    },
    items: {
      stretch: 'items-stretch',
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      baseline: 'items-baseline',
    },
    justify: {
      normal: 'justify-normal',
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      stretch: 'justify-stretch',
      between: 'justify-between',
    },
  },
  defaultVariants: {
    gap: 2,
    items: 'center',
    justify: 'normal',
  },
})

type Props = HTMLAttributes<HTMLDivElement> &
  CompProps &
  VariantProps<typeof variants>

export const Level = forwardRef<HTMLDivElement, Props>(
  ({ className, gap, items, justify, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(variants({ gap, items, justify, className }))}
        {...props}
      />
    )
  },
)
Level.displayName = 'Level'
