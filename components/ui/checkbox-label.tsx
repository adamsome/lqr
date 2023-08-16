import { ReactNode } from 'react'

import { Checkbox, Props as CheckboxProps } from '@/components/ui/checkbox'

type Props = CheckboxProps & {
  id: string
  children: ReactNode
}

export function CheckboxLabel({ id, children, ...props }: Props) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={id} {...props} />
      <label
        htmlFor={id}
        className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {children}
      </label>
    </div>
  )
}
