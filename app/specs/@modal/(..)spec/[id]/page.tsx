import { Spec } from '@/app/spec/[id]/spec'
import { DataProvider } from '@/components/data-provider'
import InterceptRouteDialog from '@/components/ui/intercept-route-dialog'
import { getData } from '@/lib/model/data'
import invariant from 'tiny-invariant'

export const revalidate = 0

type Props = {
  params: {
    id: string
  }
}

export default async function Page({ params }: Props) {
  const data = await getData()
  const { specs } = data
  const { id } = params
  const spec = specs.find((s) => s.id === id)
  invariant(spec, `No spec found with id '${id}'`)
  return (
    <DataProvider {...data}>
      <InterceptRouteDialog>
        <Spec spec={spec} />
      </InterceptRouteDialog>
    </DataProvider>
  )
}
