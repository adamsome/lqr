import type { PageProps } from '@/app/lib/types'
import { SpecContainer } from '@/app/u/[username]/specs/[id]/spec-container'

type Props = PageProps<{
  username?: string
  id?: string
}>

export default async function Page({ params = {} }: Props) {
  const { username, id } = params
  return <SpecContainer username={username} specID={id} />
}
