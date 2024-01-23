import { cn } from '@/app/lib/utils'
import { ReactNode, useMemo } from 'react'

type Props = {
  children: ReactNode
}

export function Kbd({ children }: Props) {
  return (
    <kbd
      className={cn(
        'inline-block align-baseline text-center capitalize',
        'text-foreground text-[11px] leading-3 [font-feature-settings:cv08]',
        'bg-muted-foreground/20 rounded-sm p-0.5 min-w-[17px]',
        'border-[0.5px] shadow-sm cursor-default',
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
