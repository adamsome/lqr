import { CardHeader, CardLink } from '@/components/ui/card'
import { Container } from '@/components/ui/container'

export const revalidate = 0

export default async function Page() {
  return (
    <Container className="relative py-8">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(theme(spacing.64),1fr))] gap-4 lg:gap-6">
        <CardLink href="/bar">
          <CardHeader>Bar</CardHeader>
        </CardLink>
        <CardLink href="/specs">
          <CardHeader>Specs</CardHeader>
        </CardLink>
      </div>
    </Container>
  )
}
