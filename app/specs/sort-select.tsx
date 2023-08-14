'use client'

import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
} from '@radix-ui/react-icons'
import { useEffect, useState } from 'react'

import {
  SORT_DESC_KEY,
  SORT_KEY,
  SpecSort,
  getSpecSortItems,
  isSpecSortDefaultDesc,
} from '@/app/specs/consts'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouterSearchParams } from '@/hooks/use-router-search-params'
import { cn } from '@/lib/utils'

const ITEMS = getSpecSortItems()

type Props = {
  className?: string
  sort?: SpecSort
  desc?: boolean
}

export function SortSelect({
  className,
  sort: sortProp,
  desc: descProp,
}: Props) {
  const { set, clear } = useRouterSearchParams()
  const [sort, setSort] = useState(sortProp)
  const [desc, setDesc] = useState(descProp)
  const changed =
    (sort ?? 'stock') !== (sortProp ?? 'stock') ||
    (desc ?? false) !== (descProp ?? false)

  const curr = ITEMS.find((it) => it.value === (sort ?? 'stock'))

  const handleChange = (value: string) => {
    setSort(value as SpecSort)
    if (value === (sortProp ?? 'stock')) {
      setDesc(!desc)
      if (!desc) {
        set(SORT_DESC_KEY, 'true')
      } else {
        clear(SORT_DESC_KEY)
      }
    } else {
      set(SORT_KEY, value)
    }
  }

  useEffect(() => {
    if (!sortProp) setSort(ITEMS[0].value)
  }, [sortProp])

  useEffect(() => {
    if (descProp === undefined) setDesc(false)
  }, [descProp])

  if (!curr) return null

  const isDesc = isSpecSortDefaultDesc(curr.value) ? !desc : desc

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'flex items-center justify-start gap-2 px-3 w-32 font-normal',
            { 'animate-pulse': changed },
            className,
          )}
        >
          <CaretSortIcon />
          <span className="flex-1 text-left">{curr.label}</span>
          <div className="flex-none">
            {isDesc ? <ArrowDownIcon /> : <ArrowUpIcon />}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32" align="end" loop>
        {ITEMS.map(({ value, label }) => (
          <DropdownMenuCheckboxItem
            key={value}
            checked={value === (sort ?? 'stock')}
            onCheckedChange={() => handleChange(value)}
          >
            {label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
