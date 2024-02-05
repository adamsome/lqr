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
        <span className="text-muted-foreground/75 text-sm [font-stretch:condensed] font-medium uppercase tracking-wider">
          {name}
        </span>
      </Container>
      {children}
    </Stack>
  )
}
