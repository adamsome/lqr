import { cn } from '@/lib/util/cn'

type Props = {
  className?: string
  body?: string
  line?: string
  inner?: string
  big?: boolean
}

export default function Logo({
  className,
  body = 'text-black dark:text-white group-hover:text-blue-950 dark:group-hover:text-blue-200 transition-colors',
  line = 'text-black dark:text-white group-hover:text-blue-400 transition-colors',
  inner = 'text-white dark:text-black group-hover:text-red-600 transition-colors',
  big,
}: Props) {
  const size = !big ? 40 : 64
  return (
    <svg width={size} height={size} viewBox="0 0 210 297" className={className}>
      <path
        className={cn('fill-current stroke-current', body)}
        strokeWidth="20"
        strokeMiterlimit="4"
        strokeDasharray="none"
        d="M 182.71107,203.76249 33.486632,203.05479 108.71174,74.176483 Z"
      />
      <path
        className={cn('stroke-current', line)}
        strokeWidth="28"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeMiterlimit="4"
        strokeDasharray="none"
        d="m 11.550336,148.28197 c 192.968534,0 192.968534,0 192.968534,0"
      />
      <path
        className={cn('fill-current', inner)}
        strokeWidth="0"
        stroke="transparent"
        d="m 92.191598,135.93724 65.524152,-0.3619 15.15418,25.69509 H 76.914526 Z"
      />
    </svg>
  )
}
