'use client'

import { useParams, useRouter } from 'next/navigation'

import { SpecForm } from '@/app/u/[username]/specs/[id]/edit/spec-form'
import { useMutate } from '@/hooks/use-mutate'
import { toSpecItem, toSpecs } from '@/lib/routes'
import { Spec } from '@/lib/types'

export function SpecContainer() {
  const params = useParams()
  const username = params.username as string
  const router = useRouter()
  const { mutating, mutate } = useMutate<Spec>(`/api/specs`)

  function handleClose(id?: string) {
    return id
      ? router.push(toSpecItem({ id, username }))
      : router.push(toSpecs(username))
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
      onClose={() => handleClose()}
    />
  )
}
