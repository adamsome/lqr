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
  }

export async function BoxLink({
  children,
  className,
  username,
  name,
  hideLink,
  hideHeading,
  ...keys
}: Props) {
  const current = await isCurrentUser(username)
  const { cabinet, shelf, category } = keys
  const path = [cabinet, shelf, category].filter(Boolean)
  const url = [toBar(username), `${path.join('/')}`].filter(Boolean).join('/')
  return (
    <LitBox
      className={cn(
        'flex flex-col text-muted-foreground font-bold border border-primary/5 shadow transition-colors',
        path.length === 1 &&
          'gap-2 px-[7px] pt-1.5 pb-[7px] text-muted-foreground/75 text-xs [font-stretch:condensed] font-medium uppercase tracking-wider bg-muted/25 rounded-[11px]',
        path.length === 2 &&
          'z-10 gap-1 px-[7px] pt-1.5 pb-[3px] text-sm [font-stretch:normal] normal-case tracking-tight bg-muted/50 rounded-md',
        hideHeading && 'pt-1',
        className,
      )}
      path={path}
    >
      {!hideHeading && !hideLink && (
        <Link
          className={cn(
            'group p-3 -m-3 tracking-tight',
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
              <CaretRightIcon className="w-5 h-5" />
            </Level>
            {current && (
              <Button
                className="px-2.5 py-px h-auto text-accent-muted group-hover:text-accent-foreground group-hover:bg-accent-foreground/15"
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
