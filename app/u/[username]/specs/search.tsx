'use client'

import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import { useDebounce } from 'react-use'

import { Level } from '@/app/components/layout/level'
import { Input } from '@/app/components/ui/input'
import { cn } from '@/app/lib/utils'
import { SEARCH_KEY } from '@/app/u/[username]/specs/_criteria/consts'
import { useRouterSearchParams } from '@/app/u/[username]/specs/use-router-search-params'

type Props = {
  className?: string
  search: string
}

export function Search({ className, search: searchProp }: Props) {
  const { set, clear } = useRouterSearchParams()
  const [search, setSearch] = useState(searchProp)
  const [prevSearchProp, setPrevSearchProp] = useState(searchProp)

  // Clear the input when the search param is cleared elsewhere
  if (searchProp !== prevSearchProp) {
    setPrevSearchProp(searchProp)
    if (!searchProp) setSearch('')
  }

  const handleSearch = () => {
    if (searchProp !== search)
      search ? set(SEARCH_KEY, search) : clear(SEARCH_KEY)
  }

  useDebounce(handleSearch, 1200, [search])

  return (
    <div className={cn('relative inline-block', className)}>
      <Input
        className="ps-[2.25rem]"
        name="search"
        type="search"
        autoComplete="off"
        value={search}
        placeholder="Filter specs..."
        onChange={(e) => setSearch(e.target.value)}
      />
      <Level
        className={cn(
          'absolute bottom-0 left-3 top-0',
          searchProp !== search && 'animate-pulse text-accent-foreground',
        )}
      >
        <MagnifyingGlassIcon />
      </Level>
    </div>
  )
}
