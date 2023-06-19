'use client'

import invariant from 'tiny-invariant'

import { Spec } from '@/app/specs/[id]/spec'
import { useData } from '@/components/data-provider'

type Props = {
  id: string
}

export function SpecContainer({ id }: Props) {
  const { specs } = useData()
  const spec = specs.find((spec) => spec.id === id)
  invariant(spec, `No spec found with id '${id}'`)
  return <Spec spec={spec} />
}
