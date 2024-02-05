import {
  Tabs,
  TabsAnimated,
  TabsAnimatedUnderline,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs'
import { UserCount } from '@/app/components/user/user-count'
import { toBar, toFollowing, toSpecs } from '@/app/lib/routes'
import { Counts } from '@/app/lib/types'

type CountType = keyof Counts

type Props = {
  username?: string
  counts?: Partial<Counts>
  selected?: CountType
}

export function UserCountTabs({ username, counts, selected }: Props) {
  return (
    <Tabs defaultValue={selected ?? 'specs'}>
      <TabsAnimated>
        <TabsAnimatedUnderline />
        <TabsList className="gap-4">
          <Tab type="specs" href={toSpecs(username)} counts={counts} />
          <Tab type="bottles" href={toBar(username)} counts={counts} />
          <Tab type="following" href={toFollowing(username)} counts={counts} />
        </TabsList>
      </TabsAnimated>
    </Tabs>
  )
}

type TabProps = {
  href: string
  type: CountType
  counts?: Partial<Counts>
}

function Tab({ href, type, counts }: TabProps) {
  const count = counts?.[type] ?? 0
  let label = String(type)
  if (label.endsWith('s') && count === 1) label = label.substring(0, -1)
  return (
    <TabsTrigger
      className="-my-1 pt-2 pb-3 px-0 data-[state=active]:text-muted-foreground [&[data-state=active]>div>span]:text-foreground"
      value={type}
      asChild
    >
      <UserCount type={type} href={href} counts={counts} />
    </TabsTrigger>
  )
}
