'use client'

import { ErrorFull } from '@/app/components/error-full'

type Props = {
  error: Error & { digest?: string }
}

export default function Error({ error }: Props) {
  return (
    <ErrorFull error={error}>{"Something's wrong with the spec!"}</ErrorFull>
  )
}
