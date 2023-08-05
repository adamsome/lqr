'use client'

import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { useCallback, useEffect, useState } from 'react'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { themeEffect } from './theme-effect'

export function ThemeToggle() {
  // a `null` preference implies auto
  const [preference, setPreference] = useState<undefined | null | string>(
    undefined,
  )
  const [currentTheme, setCurrentTheme] = useState<null | string>(null)

  const onMediaChange = useCallback(() => {
    const current = themeEffect()
    setCurrentTheme(current)
  }, [])

  useEffect(() => {
    setPreference(localStorage.getItem('theme'))
    const current = themeEffect()
    setCurrentTheme(current)

    const matchMedia = window.matchMedia('(prefers-color-scheme: dark)')
    matchMedia.addEventListener('change', onMediaChange)
    return () => matchMedia.removeEventListener('change', onMediaChange)
  }, [onMediaChange])

  const onStorageChange = useCallback(
    (event: StorageEvent) => {
      if (event.key === 'theme') setPreference(event.newValue)
    },
    [setPreference],
  )

  // when the preference changes, whether from this tab or another,
  // we want to recompute the current theme
  useEffect(() => {
    setCurrentTheme(themeEffect())
  }, [preference])

  useEffect(() => {
    window.addEventListener('storage', onStorageChange)
    return () => window.removeEventListener('storage', onStorageChange)
  })

  return (
    <>
      {/*
        the `theme-auto:` plugin is registered in `tailwind.config.js` and
        works similarly to the `dark:` prefix, which depends on the `theme-effect.ts` behavior
      */}
      <button
        aria-label="Toggle theme"
        className={cn(
          buttonVariants({
            size: 'sm',
            variant: 'ghost',
          }),
          '[&_.sun-icon]:hidden dark:[&_.moon-icon]:hidden dark:[&_.sun-icon]:inline',
        )}
        onClick={(ev) => {
          ev.preventDefault()

          let newPreference: string | null =
            currentTheme === 'dark' ? 'light' : 'dark'
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
            .matches
            ? 'dark'
            : 'light'

          if (preference !== null) {
            if (systemTheme === currentTheme) {
              localStorage.setItem('theme', newPreference)
            } else {
              newPreference = null
              localStorage.removeItem('theme')
            }
          } else {
            localStorage.setItem('theme', newPreference)
          }

          setPreference(newPreference)
        }}
      >
        <span className="sun-icon">
          <SunIcon />
        </span>
        <span className="moon-icon">
          <MoonIcon />
        </span>
      </button>
    </>
  )
}
