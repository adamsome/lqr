'use client'

import { useRouter } from 'next/navigation'

import { SpecForm } from '@/app/specs/[id]/edit/spec-form'
import { useMutate } from '@/hooks/use-mutate'
import { SPECS, toSpec } from '@/lib/routes'
import { Spec, User } from '@/lib/types'

type Props = {
  spec: Spec
  user: User
}

export function SpecContainer({ spec, user }: Props) {
  const { id } = spec

  const { id: userID, admin } = user
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
