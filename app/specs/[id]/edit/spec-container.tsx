'use client'

import { useRouter } from 'next/navigation'

import { SpecForm } from '@/app/specs/[id]/edit/spec-form'
import { useMutate } from '@/hooks/use-mutate'
import { SPECS, toSpec } from '@/lib/routes'
import { Spec } from '@/lib/types'
import { useUser } from '@/hooks/use-user'

type Props = {
  spec: Spec
}

export function SpecContainer({ spec }: Props) {
  const { id } = spec

  const { id: userID, admin } = useUser()
  const router = useRouter()
  const { mutating, mutate } = useMutate(`/api/specs/${id}`)

  if (!admin && userID !== spec.userID) router.replace(SPECS)

  function handleClose() {
    router.push(toSpec(id))
  }

  async function handleDelete() {
    const { data } = await mutate({
      method: 'DELETE',
      body: JSON.stringify({ id }),
    })
    if (data) router.push(SPECS)
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
