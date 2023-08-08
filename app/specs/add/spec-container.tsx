'use client'

import { useRouter } from 'next/navigation'

import { SpecForm } from '@/app/specs/[id]/edit/spec-form'
import { useMutate } from '@/hooks/use-mutate'
import { SPECS, toSpec } from '@/lib/routes'
import { Spec } from '@/lib/types'

export function SpecContainer() {
  const router = useRouter()
  const { mutating, mutate } = useMutate<Spec>(`/api/specs`)

  function handleClose(id?: string) {
    return id ? router.push(toSpec(id)) : router.push(SPECS)
  }

  async function handleSubmit(values: Spec) {
    const now = new Date().toISOString()
    const spec: Spec = { ...values, updatedAt: now, createdAt: now }
    const { data } = await mutate({
      method: 'POST',
      body: JSON.stringify({ spec }),
    })
    if (data) {
      handleClose(data.id)
    }
  }

  return (
    <SpecForm
      mutating={mutating}
      onSubmit={handleSubmit}
      onClose={handleClose}
    />
  )
}
