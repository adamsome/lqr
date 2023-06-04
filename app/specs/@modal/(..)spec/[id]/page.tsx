import { Spec } from '@/app/spec/[id]/spec'
import { DataProvider } from '@/components/data-provider'
import InterceptRouteDialog from '@/components/ui/intercept-route-dialog'
import { getData } from '@/lib/get-data'

export const revalidate = 0

type Props = {
  params: {
    id: string
  }
}

export default async function SpecModal({ params }: Props) {
  const data = await getData()
  const { specs } = data
  const { id } = params
  const spec = specs[id]
  return (
    <DataProvider {...data}>
      <InterceptRouteDialog>
        <Spec spec={spec} />
      </InterceptRouteDialog>
    </DataProvider>
  )
}
