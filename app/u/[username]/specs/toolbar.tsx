'use client'

import { FormEvent } from 'react'

import { SpecSort } from '@/app/u/[username]/specs/consts'
import { Search } from '@/app/u/[username]/specs/search'
import { SortSelect } from '@/app/u/[username]/specs/sort-select'

type Props = {
  search: string
  sort?: SpecSort
  desc?: boolean
}

export function Toolbar({ search, sort, desc }: Props) {
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
