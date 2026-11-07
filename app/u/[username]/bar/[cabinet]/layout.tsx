import { MobileDrawer } from '@/app/u/[username]/bar/[cabinet]/mobile-drawer'
import { CategoryKeys } from '@/app/u/[username]/bar/lib/types'
import { LayoutProps } from '@/app/lib/types'

type Props = LayoutProps<
  CategoryKeys & {
    username?: string
  }
>

export default async function Layout(props: Props) {
  const params = (await props.params) ?? {}

  const { children } = props

  return <MobileDrawer {...params}>{children}</MobileDrawer>
}
