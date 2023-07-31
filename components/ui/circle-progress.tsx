import { cn } from '@/lib/utils'
import { CSSProperties } from 'react'

const STROKE_WIDTH = 50
const RADIUS_OUTER = 80
const RADIUS_MID = RADIUS_OUTER - STROKE_WIDTH / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS_MID

type Props = {
  value: number
  total?: number
  className?: string
}

export function CircleProgress({ value, total = 100, className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 160"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Circle className="opacity-40" />
      <Circle length={CIRCUMFERENCE * (value / total)} />
    </svg>
  )
}

type CircleProps = {
  className?: string
  length?: number
}

function Circle({ className, length }: CircleProps) {
  return (
    <circle
      style={{ '--arc-length': length } as CSSProperties}
      className={cn(
        'origin-center -rotate-90 transform animate-arc fill-none stroke-current',
        className
      )}
      cx={RADIUS_OUTER}
      cy={RADIUS_OUTER}
      r={RADIUS_MID}
      strokeWidth={STROKE_WIDTH}
      strokeDasharray={length ? `${length} ${CIRCUMFERENCE}` : undefined}
    />
  )
}
