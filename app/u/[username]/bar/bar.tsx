import type { ReactNode } from 'react'

import { Level } from '@/app/components/layout/level'
import { Stack } from '@/app/components/layout/stack'
import { BarGrid } from '@/app/u/[username]/bar/bar-grid'
import { Suggestions } from '@/app/u/[username]/bar/suggestions'

type Props = {
  username?: string
  onboarding?: ReactNode
}

export async function Bar({ username, onboarding }: Props) {
  return (
    <Stack gap={6}>
      {onboarding}
      <Stack gap={2}>
        <Stack gap={0}>
          <Level className="font-medium" justify="between">
            <h2>Shopping suggestions</h2>
          </Level>
          <p className="text-sm text-muted-foreground">
            Ingredients most increasing the specs you can make
          </p>
        </Stack>
        <Suggestions username={username} />
      </Stack>
      <Stack className="-ms-2 w-auto" gap={2}>
        <Level className="ms-2 font-medium" justify="between">
          <h2>Bar inventory</h2>
          <Level
            className="whitespace-nowrap rounded-sm border border-primary/5 bg-muted/50 px-1.5 py-1 text-xs text-muted-foreground"
            gap={3}
          >
            <Level gap={1}>
              <div className="h-3 w-3 rounded-[2px] border border-primary/7.5 bg-accent-foreground/20" />
              <span>In Stock</span>
            </Level>
            <Level gap={1}>
              <div className="h-3 w-3 rounded-[2px] border border-primary/20 bg-background/75" />
              <span>Out of Stock</span>
            </Level>
          </Level>
        </Level>
        <BarGrid username={username} />
      </Stack>
    </Stack>
  )
}
