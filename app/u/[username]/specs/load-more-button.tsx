'use client'

import { DEFAULT_LIMIT, LIMIT_KEY } from '@/app/u/[username]/specs/consts'
import { LoaderButton } from '@/components/ui/loader-button'
import { useRouterSearchParams } from '@/hooks/use-router-search-params'

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
