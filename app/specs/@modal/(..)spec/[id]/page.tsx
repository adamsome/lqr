import { SpecContainer } from '@/app/specs/@modal/(..)spec/[id]/spec-container'
import InterceptRouteDialog from '@/components/ui/intercept-route-dialog'

export const revalidate = 0

type Props = {
  params: {
    id: string
  }
}

export default async function Page({ params }: Props) {
  const { id } = params
  return (
    <InterceptRouteDialog>
      <SpecContainer id={id} />
    </InterceptRouteDialog>
  )
}
