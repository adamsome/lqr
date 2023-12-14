'use client'

import { useParams, useRouter } from 'next/navigation'

import { SpecForm } from '@/app/u/[username]/specs/[id]/edit/spec-form'
import { useMutate } from '@/hooks/use-mutate'
import { toSpecItem, toSpecs } from '@/lib/routes'
import { Spec, User } from '@/lib/types'

type Props = {
  spec: Spec
}

export function SpecContainer({ spec }: Props) {
  const { id } = spec

  const { mutating, mutate } = useMutate(`/api/specs/${id}`)
  const router = useRouter()

  const params = useParams()
  const username = params.username as string

  function handleClose() {
    router.push(toSpecItem(username, id))
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
    const change: Spec = { ...spec, ...values, updatedAt }
    const { data } = await mutate({
      method: 'PUT',
      body: JSON.stringify({ spec: change }),
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
