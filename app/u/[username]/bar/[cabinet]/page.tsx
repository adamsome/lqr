import { PageProps } from '@/app/lib/types'

export const revalidate = 0

type Props = PageProps<{
  username?: string
  cabinet?: string
}>

export default async function Page({ params = {} }: Props) {
  return null
}
