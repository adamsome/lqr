import { useCallback, useEffect, useRef, useState } from 'react'

export function useOverflow(dep?: unknown) {
  const [overflow, setOverflow] = useState(false)
  const ref = useRef<HTMLElement | null>(null)

  const updateOverflow = useCallback(() => {
    if (!ref.current) return
    const { scrollWidth, clientWidth } = ref.current
    setOverflow(scrollWidth > clientWidth)
  }, [])

  useEffect(() => {
    updateOverflow()
    window.addEventListener('resize', updateOverflow)
    return () => window.removeEventListener('resize', updateOverflow)
  }, [updateOverflow, dep])

  return { ref, overflow }
}
