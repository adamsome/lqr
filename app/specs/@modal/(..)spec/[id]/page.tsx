import { DataProvider } from '@/components/category-meta-provider'
import { Spec } from '@/components/specs/spec'
import InterceptRouteDialog from '@/components/ui/intercept-route-dialog'
import { getData } from '@/lib/get-data'

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
