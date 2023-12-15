import { ascend, descend, sortWith } from 'ramda'

import { isSpecSortDefaultDesc } from '@/app/u/[username]/specs/_criteria/consts'
import { Spec } from '@/lib/types'
import { Criteria } from '@/app/u/[username]/specs/_criteria/types'

export function sortSpecs(
  specs: Spec[],
  { sort = 'stock', desc }: Criteria,
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
        ],
        specs,
      )
    }
    case 'name': {
      return sortWith([order((s) => s.name)], specs)
    }
    case 'category': {
      return sortWith(
        [
          order((s) => s.category),
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
  }
}
