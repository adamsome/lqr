import { Count as BaseCount } from '@/components/ui/count'

type Props = {
  count: number
  total: number
}

export function Count(props: Props) {
  return (
    <span>
      <BaseCount {...props} /> specs
    </span>
  )
}
