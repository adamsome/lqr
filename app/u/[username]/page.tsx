import { toSpecs } from '@/lib/routes'
import { redirect } from 'next/navigation'

export const revalidate = 0

type Props = {
  params?: {
    username?: string
  }
}

export default async function Page({ params = {} }: Props) {
  const { username } = params
  redirect(toSpecs(username))
}
