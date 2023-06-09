import { Spec } from '@/app/spec/[id]/spec'
import { getData } from '@/lib/get-data'

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
  const spec = specs[id]
  return (
    <div className="py-8">
      <Spec spec={spec} />
    </div>
  )
}
