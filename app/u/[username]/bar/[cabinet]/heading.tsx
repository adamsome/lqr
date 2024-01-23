import { getCabinetDef } from '@/app/u/[username]/bar/lib/defs'
import { Container } from '@/app/components/layout/container'
import { Stack } from '@/app/components/layout/stack'
import { H1 } from '@/app/components/ui/h1'
import { CompProps } from '@/app/lib/types'

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
