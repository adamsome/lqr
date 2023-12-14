import { Suspense } from 'react'

import { SpecContainer } from '@/app/u/[username]/specs/add/spec-container'

export default function Page() {
  return (
    <Suspense>
      <SpecContainer />
    </Suspense>
  )
}
