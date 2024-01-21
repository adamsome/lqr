'use client'

import { useSelectedLayoutSegments } from 'next/navigation'

import { LinkBox } from '@/components/ui/link-box'
import { CompProps } from '@/lib/types'
import { cn } from '@/lib/utils'

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
    <LinkBox className={cn(className, selected && 'bg-blue-500/25')}>
      {children}
    </LinkBox>
  )
}
