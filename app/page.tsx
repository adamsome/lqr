import { CardHeader, CardLink } from '@/components/ui/card'
import { CardGrid } from '@/components/ui/card-grid'
import { Container } from '@/components/ui/container'
import { RESEARCH, SPECS } from '@/lib/routes'

export const revalidate = 0

export default async function Page() {
  return (
    <Container className="relative py-8">
      <CardGrid>
        <CardLink href={SPECS}>
          <CardHeader>Specs</CardHeader>
        </CardLink>
        <CardLink href={RESEARCH}>
          <CardHeader>Research</CardHeader>
        </CardLink>
      </CardGrid>
    </Container>
  )
}
