import { PageProps } from '@/app/lib/types'

export const revalidate = 0

type Props = PageProps<{
  username?: string
  cabinet?: string
}>

export default async function Page(props: Props) {
  const params = (await props.params) ?? {}
  return null
}
