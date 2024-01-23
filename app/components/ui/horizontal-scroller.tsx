import { CSSProperties, Children, ReactNode } from 'react'

import { BREAKPOINTS, Breakpoint } from '@/app/lib/types'
import { cn } from '@/app/lib/utils'

type CountInView = [
  (number | null)?,
  (number | null)?,
  (number | null)?,
  (number | null)?,
  (number | null)?,
  (number | null)?,
]

const parseOverhang = (overhang: Props['overhang']): string => {
  if (overhang === undefined) return '0px'
  if (typeof overhang === 'number') return `${overhang}px`
  if (typeof overhang === 'boolean') return overhang ? '1rem' : '0px'
  return overhang
}

type Props = {
  children: ReactNode
  className?: string
  countInView?: CountInView
  overhang?: boolean | number | string
  maskAt?: Breakpoint
}

export function HorizontalScroller({
  children: childrenProp,
  ...props
}: Props) {
  const children = Children.toArray(childrenProp)
  return (
    <div className="relative w-full hover:[&>*]:visible focus-within:[&>*]:visible">
      <Content {...props} count={children.length}>
        {Children.map(children, (child, i) => (
          <div
            key={i}
            className="snap-start min-w-[var(--width)] max-w-[var(--width)] [&:empty]:hidden"
          >
            {child}
          </div>
        ))}
      </Content>
    </div>
  )
}

type ContentProps = Props & {
  count: number
}

function Content({
  children,
  className,
  count,
  countInView = [1, 2, 2, 3, 4, 5],
  overhang: overhangProp = true,
  maskAt = 'lg',
}: ContentProps) {
  const overhang = parseOverhang(overhangProp)
  const style = countInView.reduce(
    (acc, n, i) => {
      if (n == null) return acc
      const breakpoint = BREAKPOINTS[i]
      acc[`--hang-${breakpoint}`] = count > n ? 'var(--hang)' : '0px'
      acc[`--count-${breakpoint}`] = n
      return acc
    },
    { ['--hang']: overhang } as Record<string, string | number>,
  )
  const maskIndex = BREAKPOINTS.findIndex((b) => b === maskAt)
  return (
    <div
      style={style as CSSProperties}
      className={cn(
        '[--mask:theme(spacing.10)] [--gap:theme(spacing.2)] sm:[--gap:theme(spacing.4)]',
        'flex gap-[var(--gap)] scroll-px-4 sm:scroll-px-6 snap-x overflow-auto no-scrollbar',
        '[--width:calc(100%-var(--hang-xs))]',
        countInView[0] != null &&
          '[--width:calc(((100%-var(--hang-xs))-var(--gap)*(var(--count-xs)-1))/var(--count-xs))]',
        countInView[1] != null &&
          'sm:[--width:calc(((100%-var(--hang-sm))-var(--gap)*(var(--count-sm)-1))/var(--count-sm))]',
        countInView[2] != null &&
          'md:[--width:calc(((100%-var(--hang-md))-var(--gap)*(var(--count-md)-1))/var(--count-md))]',
        countInView[3] != null &&
          'lg:[--width:calc(((100%-var(--hang-lg))-var(--gap)*(var(--count-lg)-1))/var(--count-lg))]',
        countInView[4] != null &&
          'xl:[--width:calc(((100%-var(--hang-xl))-var(--gap)*(var(--count-xl)-1))/var(--count-xl))]',
        countInView[5] != null &&
          '2xl:[--width:calc(((100%-var(--hang-2xl))-var(--gap)*(var(--count-2xl)-1))/var(--count-2xl))]',
        // maskIndex <= 0 &&
        //   'px-[var(--mask)] scroll-px-0-[var(--mask)] mx-[calc(-1*var(--mask))] [mask-image:linear-gradient(to_right,transparent,white_var(--mask),white_calc(100%-var(--mask)),transparent)]',
        // maskIndex <= 1 &&
        //   'sm:px-[var(--mask)] sm:scroll-px-0-[var(--mask)] sm:mx-[calc(-1*var(--mask))] sm:[mask-image:linear-gradient(to_right,transparent,white_var(--mask),white_calc(100%-var(--mask)),transparent)]',
        // maskIndex <= 2 &&
        //   'md:px-[var(--mask)] md:scroll-px-0-[var(--mask)] md:mx-[calc(-1*var(--mask))] md:[mask-image:linear-gradient(to_right,transparent,white_var(--mask),white_calc(100%-var(--mask)),transparent)]',
        // maskIndex <= 3 &&
        //   'lg:px-[var(--mask)] lg:scroll-px-0-[var(--mask)] lg:mx-[calc(-1*var(--mask))] lg:[mask-image:linear-gradient(to_right,transparent,white_var(--mask),white_calc(100%-var(--mask)),transparent)]',
        // maskIndex <= 4 &&
        //   'xl:px-[var(--mask)] xl:scroll-px-0-[var(--mask)] xl:mx-[calc(-1*var(--mask))] xl:[mask-image:linear-gradient(to_right,transparent,white_var(--mask),white_calc(100%-var(--mask)),transparent)]',
        // maskIndex <= 5 &&
        //   '2xl:px-[var(--mask)] 2xl:scroll-px-0-[var(--mask)] 2xl:mx-[calc(-1*var(--mask))] 2xl:[mask-image:linear-gradient(to_right,transparent,white_var(--mask),white_calc(100%-var(--mask)),transparent)]',
        className,
      )}
    >
      {children}
    </div>
  )
}
