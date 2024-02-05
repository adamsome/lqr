import Link from 'next/link'

import { CompProps, Counts } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'

type CountType = keyof Counts

type Props = CompProps & {
  type: CountType
  href: string
  counts?: Partial<Counts>
}

export function UserCount({ children, className, type, href, counts }: Props) {
  const count = counts?.[type] ?? 0
  let label = String(type)
  if (label.endsWith('s') && count === 1) label = label.substring(0, -1)
  return (
    <Link className="group" href={href}>
      <div>
        <span
          className={cn(
            'text-foreground/75 font-bold group-hover:text-foreground transition-colors',
            className,
          )}
        >
          {count}
        </span>{' '}
        {children ?? <Label value={type} count={count} />}
      </div>
    </Link>
  )
}

function Label({ value, count }: { value: string; count?: number }) {
  let label = String(value)
  if (label.endsWith('s') && count === 1) label = label.substring(0, -1)
  return <>{label}</>
}
