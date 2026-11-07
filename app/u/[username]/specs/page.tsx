import { PageProps } from '@/app/lib/types'
import { parseCriteria } from '@/app/u/[username]/specs/_criteria/parse'
import { SpecsContainer } from '@/app/u/[username]/specs/specs-container'

type Props = PageProps<{
  username?: string
}>

export default async function Page(props: Props) {
  const searchParams = (await props.searchParams) ?? {}
  const params = (await props.params) ?? {}
  const { username } = params

  const criteria = parseCriteria(searchParams ?? {}, username)
  return <SpecsContainer username={username} criteria={criteria} />
}
