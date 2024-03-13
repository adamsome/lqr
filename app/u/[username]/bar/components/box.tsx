import { CaretRightIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

import { LitBox } from '@/app/u/[username]/bar/components/lit-box'
import { CategoryKeys } from '@/app/u/[username]/bar/lib/types'
import { Level } from '@/app/components/layout/level'
import { Button } from '@/app/components/ui/button'
import { isCurrentUser } from '@/app/lib/model/user'
import { toBar } from '@/app/lib/routes'
import { CompProps } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'

type Props = CompProps &
  CategoryKeys & {
    username?: string
    name: string
    hideLink?: boolean
    hideHeading?: boolean
    readonly?: boolean
  }

export async function BoxLink({
  children,
  className,
  username,
  name,
  hideLink,
  hideHeading,
  readonly,
  ...keys
}: Props) {
  const current = await isCurrentUser(username)
  const { cabinet, shelf, category } = keys
  const path = [cabinet, shelf, category].filter(Boolean)
  const url = [toBar(username), `${path.join('/')}`].filter(Boolean).join('/')
  return (
    <LitBox
      className={cn(
        'text-muted-foreground border-primary/5 flex flex-col border font-bold shadow transition-colors',
        path.length === 1 &&
          'text-muted-foreground/75 bg-muted/25 gap-2 rounded-[11px] px-[7px] pb-[7px] pt-1.5 text-xs font-medium uppercase tracking-wider [font-stretch:condensed]',
        path.length === 2 &&
          'bg-muted/50 z-10 gap-1 rounded-md px-[7px] pb-[3px] pt-1.5 text-sm normal-case tracking-tight [font-stretch:normal]',
        readonly && 'text-xs',
        hideHeading && 'pt-1',
        className,
      )}
      path={path}
    >
      {!hideHeading && !hideLink && (
        <Link
          className={cn(
            'group -m-3 p-3 tracking-tight',
            path.length === 1 && 'font-semibold',
          )}
          href={url}
          scroll={false}
        >
          <Level justify="between">
            <Level
              className={cn(path.length === 2 && 'group-hover:underline')}
              gap={0}
            >
              <span>{name}</span>
              <CaretRightIcon className="h-5 w-5" />
            </Level>
            {current && (
              <Button
                className="text-accent-muted group-hover:text-accent-foreground group-hover:bg-accent-foreground/15 h-auto px-2.5 py-px"
                variant="ghost"
              >
                Edit
              </Button>
            )}
          </Level>
        </Link>
      )}
      {!hideHeading && hideLink && (
        <span className={cn(path.length === 1 && 'ms-2')}>{name}</span>
      )}
      {children}
    </LitBox>
  )
}
