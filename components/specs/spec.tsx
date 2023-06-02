'use client'

import { Spec } from '@/lib/types'

type Props = {
  spec: Spec
}

export function Spec({ spec }: Props) {
  return <div>{spec.name}</div>
}
