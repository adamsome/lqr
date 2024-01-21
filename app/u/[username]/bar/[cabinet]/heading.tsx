import { getCabinetDef } from '@/app/u/[username]/bar/lib/defs'
import { Container } from '@/components/layout/container'
import { Stack } from '@/components/layout/stack'
import { H1 } from '@/components/ui/h1'
import { CompProps } from '@/lib/types'

type Props = CompProps & {
  cabinet?: string
}

export function Heading({ children, cabinet }: Props) {
  const { name } = getCabinetDef({ cabinet })
  return (
    <Stack key={cabinet}>
      <Container className="mt-4.5" pad="unresponsive">
        <H1>{name}</H1>
      </Container>
      {children}
    </Stack>
  )
}
