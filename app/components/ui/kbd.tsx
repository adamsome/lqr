import { cn } from '@/app/lib/utils'
import { ReactNode, useMemo } from 'react'

type Props = {
  children: ReactNode
}

export function Kbd({ children }: Props) {
  return (
    <kbd
      className={cn(
        'inline-block text-center align-baseline capitalize',
        'text-[11px] leading-3 text-foreground [font-feature-settings:cv08]',
        'min-w-[17px] rounded-sm bg-muted-foreground/20 p-0.5',
        'cursor-default border-[0.5px] shadow-sm',
      )}
    >
      {children}
    </kbd>
  )
}

type KbdShortcutProps = {
  className?: string
  shortcut: string
}

export function KbdShortcut({ className, shortcut }: KbdShortcutProps) {
  const parts = useMemo(() => shortcut.split(''), [shortcut])
  return (
    <span className={cn('space-x-0.5', className)}>
      {parts.map((p, i) => (
        <Kbd key={`${i}_${p}`}>{p}</Kbd>
      ))}
    </span>
  )
}
