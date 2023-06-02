import { Spec } from '@/components/specs/spec'
import { getData } from '@/lib/get-data'

export const revalidate = 0

type Props = {
  params: {
    id: string
  }
}

export default async function Page({ params }: Props) {
  const { specs } = await getData()
  const spec = specs[params.id]
  return <Spec spec={spec} />
}
