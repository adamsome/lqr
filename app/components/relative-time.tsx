'use client'

import { intlFormatDistance, parseISO } from 'date-fns'

type Props = {
  className?: string
  date: string
  prefix?: string
}

// Relative time (e.g. "3 years ago") with the full local date on hover
export function RelativeTime({ className, date, prefix }: Props) {
  const parsed = parseISO(date)
  const relative = intlFormatDistance(parsed, new Date())
  const full = parsed.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
  return (
    <time
      className={className}
      dateTime={date}
      title={full}
      suppressHydrationWarning
    >
      {prefix ? `${prefix} ${relative}` : relative}
    </time>
  )
}
