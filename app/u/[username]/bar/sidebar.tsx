import { Bar } from '@/app/u/[username]/bar/bar'
import { Stack } from '@/components/layout/stack'
import { H2 } from '@/components/ui/h2'

type Props = {
  username?: string
  bottleCount: number
}

export function Sidebar({ username, bottleCount }: Props) {
  return (
    <Stack gap={4}>
      <H2 className="ms-4 text-muted-foreground">
        <span className="text-foreground font-bold">{bottleCount}</span>{' '}
        {`bottle${bottleCount !== 1 ? 's' : ''}`}
      </H2>
      <Bar username={username} />
    </Stack>
  )
}
