import { ascend, descend, sortWith } from 'ramda'

import { isSpecSortDefaultDesc } from '@/app/u/[username]/specs/_criteria/consts'
import { Criteria } from '@/app/u/[username]/specs/_criteria/types'
import { Spec } from '@/app/lib/types'

export function sortSpecs(
  specs: Spec[],
  { sort = 'stock', desc }: Partial<Criteria> = {},
): Spec[] {
  const actualDesc = isSpecSortDefaultDesc(sort) ? !desc : desc
  const order = actualDesc ? descend : ascend
  switch (sort) {
    default:
    case 'stock': {
      return sortWith(
        [
          order((s) => (s.stock?.count ?? 0) / (s.stock?.total ?? 0)),
          descend((s) => s.updatedAt),
          order((s) => s.createdAt),
        ],
        specs,
      )
    }
    case 'name': {
      return sortWith([order((s) => s.name)], specs)
    }
    case 'updated': {
      return sortWith(
        [
          order((s) => s.updatedAt),
          order((s) => s.createdAt),
          descend((s) => (s.stock?.count ?? 0) / (s.stock?.total ?? 0)),
        ],
        specs,
      )
    }
    case 'created': {
      return sortWith(
        [
          order((s) => s.createdAt),
          order((s) => s.updatedAt),
          descend((s) => (s.stock?.count ?? 0) / (s.stock?.total ?? 0)),
        ],
        specs,
      )
    }
    case 'year': {
      return sortWith([order((s) => s.year ?? 0), order((s) => s.name)], specs)
    }
    case 'category': {
      return sortWith(
        [
          order((s) => s.category ?? 'zzz'),
          descend((s) => (s.stock?.count ?? 0) / (s.stock?.total ?? 0)),
          descend((s) => s.updatedAt),
        ],
        specs,
      )
    }
    case 'user': {
      return sortWith(
        [
          order((s) => s.username),
          descend((s) => (s.stock?.count ?? 0) / (s.stock?.total ?? 0)),
          descend((s) => s.updatedAt),
        ],
        specs,
      )
    }
  }
}
