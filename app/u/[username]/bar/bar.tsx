import { Level } from '@/app/components/layout/level'
import { Stack } from '@/app/components/layout/stack'
import { BarGrid } from '@/app/u/[username]/bar/bar-grid'
import { Suggestions } from '@/app/u/[username]/bar/suggestions'

type Props = {
  username?: string
}

export async function Bar({ username }: Props) {
  return (
    <Stack gap={6}>
      <Stack gap={2}>
        <Stack gap={0}>
          <Level className="font-medium" justify="between">
            <h2>Shopping suggestions</h2>
          </Level>
          <p className="text-muted-foreground text-sm">
            Ingredients most increasing the specs you can make
          </p>
        </Stack>
        <Suggestions username={username} />
      </Stack>
      <Stack className="-ms-2 w-auto" gap={2}>
        <Level className="ms-2 font-medium" justify="between">
          <h2>Bar inventory</h2>
          <Level
            className="text-muted-foreground bg-muted/50 border-primary/5 whitespace-nowrap rounded-sm border px-1.5 py-1 text-xs"
            gap={3}
          >
            <Level gap={1}>
              <div className="bg-accent-foreground/20 border-primary/7.5 h-3 w-3 rounded-[2px] border" />
              <span>In Stock</span>
            </Level>
            <Level gap={1}>
              <div className="bg-background/75 border-primary/20 h-3 w-3 rounded-[2px] border" />
              <span>Out of Stock</span>
            </Level>
          </Level>
        </Level>
        <BarGrid username={username} />
      </Stack>
    </Stack>
  )
}
