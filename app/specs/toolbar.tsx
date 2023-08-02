'use client'

import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { FormEvent, useEffect, useState } from 'react'
import { useDebounce } from 'react-use'

import { SEARCH_KEY } from '@/app/specs/consts'
import { Input } from '@/components/ui/input'
import { useRouterSearchParams } from '@/hooks/use-router-search-params'
import { cn } from '@/lib/utils'

type Props = {
  search: string
}

export function Toolbar({ search: searchProp }: Props) {
  const { set, clear } = useRouterSearchParams()
  const [search, setSearch] = useState(searchProp)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const target = e.target as HTMLFormElement
    const formData = new FormData(target)
    const value = formData.get('search') as string | null
    setSearch(value ?? '')
    target.focus()
  }

  const handleSearch = () => {
    if (searchProp !== search)
      search ? set(SEARCH_KEY, search) : clear(SEARCH_KEY)
  }

  useDebounce(handleSearch, 1200, [search])

  useEffect(() => {
    if (!searchProp) setSearch('')
  }, [searchProp])

  return (
    <form className="flex items-center" onSubmit={handleSubmit}>
      <div className="relative inline-block flex-1">
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
    </form>
  )
}
