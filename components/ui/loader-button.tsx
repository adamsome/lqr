'use client'

import { ReactNode, useState } from 'react'

import { Button, Props as ButtonProps } from '@/components/ui/button'
import { Loader } from '@/components/ui/loader'

type Props = Omit<ButtonProps, 'onClick' | 'children'> & {
  children: ReactNode
  onClick?: () => void
}

export function LoaderButton({ children, onClick, ...props }: Props) {
  const [loading, setLoading] = useState(false)

  function handleClick() {
    setLoading(true)
    onClick?.()
  }

  return (
    <Button
      variant="secondary"
      disabled={loading}
      onClick={handleClick}
      {...props}
    >
      {!loading && children}
      <Loader loading={loading} />
    </Button>
  )
}
