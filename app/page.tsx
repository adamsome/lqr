import { CardHeader, CardLink } from '@/components/ui/card'
import { CardGrid } from '@/components/ui/card-grid'
import { Container } from '@/components/ui/container'

export const revalidate = 0

export default async function Page() {
  return (
    <Container className="relative py-8">
      <CardGrid>
        <CardLink href="/specs">
          <CardHeader>Specs</CardHeader>
        </CardLink>
        <CardLink href="/research">
          <CardHeader>Research</CardHeader>
        </CardLink>
      </CardGrid>
    </Container>
  )
}
