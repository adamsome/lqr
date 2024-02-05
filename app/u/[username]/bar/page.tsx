import { Stack } from '@/app/components/layout/stack'
import { PageProps } from '@/app/lib/types'
import { CategoryList } from '@/app/u/[username]/bar/[cabinet]/[shelf]/category-list'
import { Heading } from '@/app/u/[username]/bar/[cabinet]/[shelf]/heading'
import { Heading as CabinetHeading } from '@/app/u/[username]/bar/[cabinet]/heading'
import { getCabinetDef } from '@/app/u/[username]/bar/lib/defs'
import { CABINETS } from '@/app/u/[username]/bar/lib/types'

type Props = PageProps<{
  username?: string
}>

export default async function Page({ params = {} }: Props) {
  const { username } = params
  return (
    <Stack gap={8}>
      {CABINETS.map((cabinet) => (
        <CabinetHeading key={cabinet} cabinet={cabinet}>
          <Stack gap={8}>
            {getCabinetDef({ cabinet }).listIDs.map((shelf) => {
              const keys = { username, cabinet, shelf }
              return (
                <Heading key={shelf} {...keys} asLink>
                  <CategoryList {...keys} />
                </Heading>
              )
            })}
          </Stack>
        </CabinetHeading>
      ))}
    </Stack>
  )
}
