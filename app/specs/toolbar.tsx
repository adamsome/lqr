'use client'

import { Search } from 'lucide-react'
import { FormEvent, useEffect, useState } from 'react'
import { useDebounce } from 'react-use'

import { SEARCH_KEY } from '@/app/specs/consts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouterSearchParams } from '@/hooks/use-router-search-params'

type Props = {
  search: string
}

export function Toolbar({ search: searchProp }: Props) {
  const { set } = useRouterSearchParams()
  const [search, setSearch] = useState(searchProp)
  const [searching, setSearching] = useState(false)

  useDebounce(
    () => {
      if (searchProp === search) return
      setSearching(true)
      set(SEARCH_KEY, search)
    },
    1200,
    [search]
  )

  useEffect(() => {
    if (!searchProp) setSearch('')
  }, [searchProp])

  useEffect(() => {
    if (searchProp === search) setSearching(false)
  }, [searchProp, search])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const target = e.target as HTMLFormElement
    const formData = new FormData(target)
    const value = formData.get('search') as string | null
    setSearch(value ?? '')
    target.focus()
  }

  return (
    <form className="flex items-center" onSubmit={handleSubmit}>
      <div className="relative inline-block flex-1">
        <Input
          name="search"
          type="text"
          autoComplete="off"
          value={search}
          placeholder="Filter by name..."
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          className="absolute right-0 top-0 h-full rounded-s-none"
          variant="ghost"
          size="sm"
          disabled={searching}
          type="submit"
        >
          <Search size={16} />
        </Button>
      </div>
    </form>
  )
}
