import { Spec } from '@/app/specs/[id]/spec'
import { getSpecData } from '@/lib/model/spec-data'

type Props = {
  params: {
    id: string
  }
}

export default async function Page({ params }: Props) {
  const { id } = params
  const [spec, data] = await getSpecData(id)
  return (
    <div className="py-8">
      <Spec spec={spec} data={data} />
    </div>
  )
}
