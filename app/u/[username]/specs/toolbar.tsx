'use client'

import { FormEvent } from 'react'

import { Criteria } from '@/app/u/[username]/specs/_criteria/types'
import { Search } from '@/app/u/[username]/specs/search'
import { SortSelect } from '@/app/u/[username]/specs/sort-select'

export function Toolbar({ search, sort, desc }: Criteria) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <form className="flex items-center gap-4" onSubmit={handleSubmit}>
      <Search className="flex-1" search={search} />
      <SortSelect sort={sort} desc={desc} />
    </form>
  )
}
