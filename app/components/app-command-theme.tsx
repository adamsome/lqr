'use client'

import { LaptopIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons'

import { themeEffect } from '@/app/components/theme-effect'
import { CommandGroup, CommandIconItem } from '@/app/components/ui/command'

type Props = {
  onSelect?: (value: string) => void
}

export function AppCommandTheme({ onSelect }: Props) {
  function handleSelect(value: string) {
    // No stored preference means follow the system theme
    if (value === 'system') {
      localStorage.removeItem('theme')
    } else {
      localStorage.setItem('theme', value)
    }
    themeEffect()
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
