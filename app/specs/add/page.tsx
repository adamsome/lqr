import { Suspense } from 'react'

import { SpecContainer } from '@/app/specs/add/spec-container'
import { Container } from '@/components/ui/container'

export default function Page() {
  return (
    <Suspense>
      <Container>
        <SpecContainer />
      </Container>
    </Suspense>
  )
}
