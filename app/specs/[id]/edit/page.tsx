import { Suspense } from 'react'
import invariant from 'tiny-invariant'

import { SpecContainer } from '@/app/specs/[id]/edit/spec-container'
import { getSpec } from '@/lib/model/spec'
import { Container } from '@/components/ui/container'

export const revalidate = 0

type Props = {
  params: {
    id: string
  }
}

export default async function Page({ params }: Props) {
  const { id } = params
  const spec = await getSpec({ id })
  invariant(spec, `No spec found with id '${id}'`)
  return (
    <Suspense>
      <Container>
        <SpecContainer spec={spec} />
      </Container>
    </Suspense>
  )
}
