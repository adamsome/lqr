import { Suspense } from 'react'

import { SpecContainer } from '@/app/specs/add/spec-container'

export default function Page() {
  return (
    <Suspense>
      <SpecContainer />
    </Suspense>
  )
}
