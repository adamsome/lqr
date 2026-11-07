import { List } from '@/app/u/[username]/following/list'
import { PageProps } from '@/app/lib/types'

type Props = PageProps<{
  username?: string
}>

export default async function Page(props: Props) {
  const params = (await props.params) ?? {}
  const { username } = params
  return <List username={username} />
}
