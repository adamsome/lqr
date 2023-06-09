'use client'

import { Combobox } from '@/components/ui/combobox'
import { forwardRef } from 'react'

const amounts = [
  { value: 2, label: '2' },
  { value: 1.5, label: '1 1/2' },
  { value: 1, label: '1' },
  { value: 0.75, label: '3/4' },
  { value: 0.5, label: '1/2' },
  { value: 0.25, label: '1/4' },
]

type Props = {
  name: string
  value?: number
  onChange(value?: number): void
}

export const AmountSelect = forwardRef<HTMLButtonElement, Props>(
  (props: Props, ref) => {
    return <Combobox ref={ref} options={amounts} {...props} />
  }
)
AmountSelect.displayName = 'AmountSelect'
