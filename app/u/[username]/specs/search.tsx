'use client'

import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'

import { SEARCH_KEY } from '@/app/u/[username]/specs/_criteria/consts'
import { Input } from '@/components/ui/input'
import { useRouterSearchParams } from '@/hooks/use-router-search-params'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
  search: string
}

export function Search({ className, search: searchProp }: Props) {
  const { set, clear } = useRouterSearchParams()
  const [search, setSearch] = useState(searchProp)

  const handleSearch = () => {
    if (searchProp !== search)
      search ? set(SEARCH_KEY, search) : clear(SEARCH_KEY)
  }

  useDebounce(handleSearch, 1200, [search])

  useEffect(() => {
    if (!searchProp) setSearch('')
  }, [searchProp])

  return (
    <div className={cn('relative inline-block', className)}>
      <Input
        className="ps-[2.25rem]"
        name="search"
        type="search"
        autoComplete="off"
        value={search}
        placeholder="Filter by name..."
        onChange={(e) => setSearch(e.target.value)}
      />
      <div
        className={cn('absolute bottom-0 left-3 top-0 flex items-center', {
          'animate-pulse': searchProp !== search,
        })}
      >
        <MagnifyingGlassIcon />
      </div>
    </div>
  )
}
