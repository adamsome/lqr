import { PageProps } from '@/app/lib/types'
import { SpecsContainer } from '@/app/specs/specs-container'
import { parseCriteria } from '@/app/u/[username]/specs/_criteria/parse'

type Props = PageProps

export default async function Page({ searchParams = {} }: Props) {
  const criteria = parseCriteria(searchParams ?? {})
  return <SpecsContainer criteria={criteria} />
}
