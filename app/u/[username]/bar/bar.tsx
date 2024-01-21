import { Box } from '@/app/u/[username]/bar/[cabinet]/box'
import { getCabinetDef } from '@/app/u/[username]/bar/lib/defs'
import { CABINETS } from '@/app/u/[username]/bar/lib/types'
import { Stack } from '@/components/layout/stack'

type Props = {
  username?: string
}

export function Bar({ username }: Props) {
  return (
    <Stack gap={4}>
      {CABINETS.map((cabinet) => {
        const def = getCabinetDef({ cabinet })
        return <Box key={cabinet} username={username} {...def} />
      })}
    </Stack>
  )
}
