import { Suspense } from 'react'

import { SpecContainer } from '@/app/u/[username]/create-spec/spec-container'

export default function Page() {
  return (
    <Suspense>
      <SpecContainer />
    </Suspense>
  )
}
