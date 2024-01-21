import { Breakpoint } from '@/lib/types'
import { useMedia } from 'react-use'

function getQuery(breakpoint: Breakpoint) {
  switch (breakpoint) {
    case 'xs':
      return '(min-width: 368px)'
    case 'sm':
      return '(min-width: 640px)'
    case 'md':
      return '(min-width: 768px)'
    case 'lg':
      return '(min-width: 1024px)'
    case 'xl':
      return '(min-width: 1280px)'
    case '2xl':
      return '(min-width: 1536px)'
  }
}

export function useAboveBreakpoint(
  breakpoint: Breakpoint,
  defaultState?: boolean,
) {
  return useMedia(getQuery(breakpoint), defaultState)
}
