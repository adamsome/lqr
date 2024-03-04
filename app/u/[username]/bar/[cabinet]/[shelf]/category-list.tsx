import { Container } from '@/app/components/layout/container'
import { Stack } from '@/app/components/layout/stack'
import { isCurrentUser } from '@/app/lib/model/user'
import { CategoryItem } from '@/app/u/[username]/bar/[cabinet]/[shelf]/category-item'
import { buildUserCategoryData } from '@/app/u/[username]/bar/lib/category-builder'
import { getCategoryDef, getShelfDef } from '@/app/u/[username]/bar/lib/defs'
import { CategoryKeys } from '@/app/u/[username]/bar/lib/types'

type Props = CategoryKeys & {
  username?: string
}

export async function CategoryList({ username, ...keys }: Props) {
  const current = await isCurrentUser(username)
  const def = getShelfDef(keys)
  const { listIDs, flatList } = def
  const { categories } = await buildUserCategoryData(username)

  return (
    <Stack className="divide-primary/5 divide-y-2 [&>*]:pt-1" gap={0}>
      {listIDs.map((category) => (
        <Container pad="unresponsive" key={category}>
          <CategoryItem
            username={username}
            def={getCategoryDef({ ...keys, category })}
            category={categories.get(category)}
            flatList={flatList}
            isCurrentUser={current}
          />
        </Container>
      ))}
    </Stack>
  )
}
