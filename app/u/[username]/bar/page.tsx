import { List } from '@/app/u/[username]/bar/list'
import { Stack } from '@/app/components/layout/stack'
import { PageProps } from '@/app/lib/types'

type Props = PageProps<{
  username?: string
}>

export default async function Page({ params = {} }: Props) {
  const { username } = params
  return (
    <Stack className="hidden md:block pb-4" gap={6}>
      <List username={username} />
    </Stack>
  )
}
