import * as React from 'react'

export const useScrollDirection = (threshold = 50) => {
  const [dir, setDir] = React.useState<'up' | 'down'>('down')

  const block = React.useRef(false)
  const prevY = React.useRef(0)

  React.useEffect(() => {
    prevY.current = window.scrollY

    const updateDir = () => {
      const y = window.scrollY

      if (Math.abs(y - prevY.current) >= threshold) {
        const nextDir = y > prevY.current ? 'down' : 'up'

        setDir(nextDir)

        prevY.current = y > 0 ? y : 0
      }

      block.current = false
    }

    const onScroll = () => {
      if (!block.current) {
        block.current = true
        window.requestAnimationFrame(updateDir)
      }
    }

    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [dir, threshold])

  return dir
}
