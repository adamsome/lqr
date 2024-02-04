'use client'

import { useParams, useRouter } from 'next/navigation'

import { useMutate } from '@/app/api/use-mutate'
import { API_SPECS, toSpecItem, toSpecs } from '@/app/lib/routes'
import { Spec } from '@/app/lib/types'
import { SpecForm } from '@/app/u/[username]/specs/[id]/edit/spec-form'

export function SpecContainer() {
  const params = useParams()
  const username = params.username as string
  const router = useRouter()
  const { mutating, mutate } = useMutate<Spec>(API_SPECS)

  function handleClose(id?: string) {
    return id
      ? router.push(toSpecItem({ id, username }))
      : router.push(toSpecs(username))
  }

  async function handleSubmit(values: Spec) {
    const now = new Date().toISOString()
    const spec: Spec = { ...values, updatedAt: now, createdAt: now, username }
    const { data } = await mutate({
      method: 'POST',
      body: JSON.stringify({ spec }),
    })
    if (data) handleClose(data.id)
  }

  return (
    <SpecForm
      mutating={mutating}
      onSubmit={handleSubmit}
      onClose={() => handleClose()}
    />
  )
}
