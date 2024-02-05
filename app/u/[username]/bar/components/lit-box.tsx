'use client'

import { useSelectedLayoutSegments } from 'next/navigation'

import { LinkBox } from '@/app/components/ui/link-box'
import { CompProps } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'

type Props = CompProps & {
  path: (string | undefined)[]
}

export function LitBox({ children, className, path }: Props) {
  const selectedPath = useSelectedLayoutSegments()
  let selected = false
  if (path.length === 2) {
    if (selectedPath.length === 1) {
      selected = path[0] === selectedPath[0]
    } else if (selectedPath.length === 2) {
      selected = path.every((key, i) => key === selectedPath[i])
    }
  }
  return (
    <LinkBox
      className={cn(className, selected && 'bg-accent/80 border-accent-muted')}
    >
      {children}
    </LinkBox>
  )
}
