import { BoxLink } from '@/app/u/[username]/bar/components/box'
import { Box as ShelfBox } from '@/app/u/[username]/bar/[cabinet]/[shelf]/box'
import { getShelfDef } from '@/app/u/[username]/bar/lib/defs'
import { CabinetDef } from '@/app/u/[username]/bar/lib/types'
import { Stack } from '@/components/layout/stack'

type Props = CabinetDef & {
  username?: string
}

export function Box({ username, keys, name, gridIDs }: Props) {
  return (
    <BoxLink username={username} name={name} {...keys} hideLink>
      <Stack>
        {gridIDs.map((shelf) => {
          const def = getShelfDef({ ...keys, shelf })
          return <ShelfBox key={shelf} username={username} {...def} />
        })}
      </Stack>
    </BoxLink>
  )
}
