'use client'

import { useParams, useRouter } from 'next/navigation'

import { SpecForm } from '@/app/u/[username]/specs/[id]/edit/spec-form'
import { useMutate } from '@/app/api/use-mutate'
import { API_SPECS, toSpecItem, toSpecs } from '@/app/lib/routes'
import { Spec } from '@/app/lib/types'

type Props = {
  spec: Spec
}

export function SpecContainer({ spec }: Props) {
  const { id } = spec

  const { mutating, mutate } = useMutate(`${API_SPECS}/${id}`)
  const router = useRouter()

  const params = useParams()
  const username = params.username as string

  function handleClose() {
    router.push(toSpecItem(spec))
  }

  async function handleDelete() {
    const { data } = await mutate({
      method: 'DELETE',
      body: JSON.stringify({ id }),
    })
    if (data) router.push(toSpecs(username))
  }

  async function handleSubmit(values: Spec) {
    const updatedAt = new Date().toISOString()
    const { data } = await mutate({
      method: 'PUT',
      body: JSON.stringify({ spec: { ...spec, ...values, updatedAt } }),
    })
    if (data) handleClose()
  }

  return (
    <SpecForm
      spec={spec}
      showDelete
      mutating={mutating}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      onClose={handleClose}
    />
  )
}
