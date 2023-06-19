import { ReactNode } from 'react'

import { Container } from '@/components/ui/container'

type Props = {
  children: ReactNode
}

export default async function Page({ children }: Props) {
  return <Container>{children}</Container>
}
