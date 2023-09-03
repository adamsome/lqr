'use client'

import { LaptopIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { useEffect, useState } from 'react'

import { themeEffect } from '@/components/theme-effect'
import { CommandGroup, CommandIconItem } from '@/components/ui/command'

type Props = {
  onSelect?: (value: string) => void
}

export function AppCommandTheme({ onSelect }: Props) {
  // `null` theme preference is the system theme
  const [preference, setPreference] = useState<undefined | null | string>(
    undefined,
  )
  const [currentTheme, setCurrentTheme] = useState<null | string>(null)

  // When the preference changes we want to recompute the current theme
  useEffect(() => {
    setCurrentTheme(themeEffect())
  }, [preference])

  function handleSelect(value: string) {
    if (value === 'system') {
      localStorage.removeItem('theme')
    } else {
      localStorage.setItem('theme', value)
    }
    setPreference(value === 'system' ? null : value)
    onSelect?.(value)
  }

  return (
    <CommandGroup heading="Theme">
      <CommandIconItem
        name="Light"
        value="light"
        icon={<SunIcon />}
        onSelect={handleSelect}
      />
      <CommandIconItem
        name="Dark"
        value="dark"
        icon={<MoonIcon />}
        onSelect={handleSelect}
      />
      <CommandIconItem
        name="System"
        value="system"
        icon={<LaptopIcon />}
        onSelect={handleSelect}
      />
    </CommandGroup>
  )
}
