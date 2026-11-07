import { Level } from '@/app/components/layout/level'
import { Stack } from '@/app/components/layout/stack'
import { UserAvatarImage } from '@/app/components/user/user-avatar-image'
import { UserCountTabs } from '@/app/components/user/user-count-tabs'
import { getCounts } from '@/app/lib/model/counts'
import { getUser } from '@/app/lib/model/user'
import { Counts, User, type CompProps } from '@/app/lib/types'

type CountType = keyof Counts

type Props = CompProps & {
  username?: string
  selected?: CountType
}

export async function UserAvatarHeader({
  children,
  className,
  username,
  selected,
}: Props) {
  const user = await getUser(username)
  const counts = await getCounts(user?.id)
  const tabs = (
    <UserCountTabs username={username} counts={counts} selected={selected} />
  )
  return (
    <Stack className={className} gap={1}>
      <Level className="sm:justify-normal" justify="between" gap={3}>
        <UserAvatarImage
          className="-ms-1 text-4xl sm:text-5xl"
          user={user}
          size="2xl"
        />
        <div className="hidden flex-1 flex-col overflow-hidden leading-none sm:flex">
          <Name user={user} />
          {tabs}
        </div>
        {children}
      </Level>
      <Stack className="flex-1 overflow-hidden leading-none sm:hidden" gap={0}>
        <Name user={user} />
        {tabs}
      </Stack>
    </Stack>
  )
}

function Name({ user }: { user: User | null }) {
  const { displayName, username } = user ?? {}
  const name = user ? (displayName ?? username ?? '?') : ''
  return (
    <div className="overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-bold tracking-tight sm:text-4xl">
      {name}
    </div>
  )
}
