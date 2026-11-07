import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

// `false` during SSR & hydration, `true` once rendering on the client
export function useIsMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}
