import { toSpecs } from '@/app/lib/routes'
import { redirect } from 'next/navigation'

export const revalidate = 0

type Props = {
  params?: Promise<{
    username?: string
  }>
}

export default async function Page(props: Props) {
  const params = (await props.params) ?? {}
  const { username } = params
  redirect(toSpecs(username))
}
