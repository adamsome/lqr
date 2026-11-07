import { Stack } from '@/app/components/layout/stack'
import { CompProps } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'

type Props = CompProps & {
  error: Error & { digest?: string }
}

export function ErrorFull({ children, className, error }: Props) {
  const message = (error.message || '').replace('Invariant failed: ', '')
  return (
    <Stack
      className={cn(
        'inset=0 absolute h-full w-full text-muted-foreground',
        className,
      )}
      items="center"
      justify="center"
    >
      <div className="font-semibold text-foreground">
        {children ?? 'Something Went Wrong!'}
      </div>
      <div className="text-sm">{message}</div>
      {error.digest && (
        <div className="text-xs text-muted-foreground/25">{error.digest}</div>
      )}
    </Stack>
  )
}
