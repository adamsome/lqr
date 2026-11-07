import { Container } from '@/app/components/layout/container'
import { Stack } from '@/app/components/layout/stack'
import { CompProps } from '@/app/lib/types'
import { getCabinetDef } from '@/app/u/[username]/bar/lib/defs'

type Props = CompProps & {
  cabinet?: string
}

export function Heading({ children, cabinet }: Props) {
  const { name } = getCabinetDef({ cabinet })
  return (
    <Stack gap={0.5}>
      <Container pad="unresponsive">
        <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground/75 [font-stretch:condensed]">
          {name}
        </span>
      </Container>
      {children}
    </Stack>
  )
}
