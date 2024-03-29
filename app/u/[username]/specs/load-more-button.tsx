'use client'

import {
  DEFAULT_LIMIT,
  LIMIT_KEY,
} from '@/app/u/[username]/specs/_criteria/consts'
import { LoaderButton } from '@/app/components/ui/loader-button'
import { useRouterSearchParams } from '@/app/u/[username]/specs/use-router-search-params'

type Props = {
  limit: number
}

export function LoadMoreButton({ limit }: Props) {
  const { set } = useRouterSearchParams()

  function handleClick() {
    set(LIMIT_KEY, String(limit + DEFAULT_LIMIT), { scroll: false })
  }

  return (
    <LoaderButton key={limit} onClick={handleClick}>
      Load more
    </LoaderButton>
  )
}
