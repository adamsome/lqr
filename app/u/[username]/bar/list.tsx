import { CategoryList } from '@/app/u/[username]/bar/[cabinet]/[shelf]/category-list'
import { Heading } from '@/app/u/[username]/bar/[cabinet]/[shelf]/heading'
import { Heading as CabinetHeading } from '@/app/u/[username]/bar/[cabinet]/heading'
import { getCabinetDef } from '@/app/u/[username]/bar/lib/defs'
import { CABINETS } from '@/app/u/[username]/bar/lib/types'
import { Stack } from '@/components/layout/stack'

type Props = {
  username?: string
}

export function List({ username }: Props) {
  return (
    <Stack gap={6}>
      {CABINETS.map((cabinet) => (
        <CabinetHeading key={cabinet} cabinet={cabinet}>
          <Stack gap={6}>
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
