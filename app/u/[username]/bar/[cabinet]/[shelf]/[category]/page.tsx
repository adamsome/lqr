import { Heading } from '@/app/u/[username]/bar/[cabinet]/[shelf]/[category]/heading'
import { IngredientList } from '@/app/u/[username]/bar/[cabinet]/[shelf]/[category]/ingredient-list'
import { buildCategories } from '@/app/u/[username]/bar/lib/category-builder'
import { getCategoryDef } from '@/app/u/[username]/bar/lib/defs'
import { CategoryKeys } from '@/app/u/[username]/bar/lib/types'
import { Container } from '@/components/layout/container'
import { isCurrentUser } from '@/lib/model/user'
import { PageProps } from '@/lib/types'

export const revalidate = 0

type Props = PageProps<
  CategoryKeys & {
    username?: string
  }
>

export default async function Page({ params = {} }: Props) {
  const { username } = params
  const categories = await buildCategories(username)
  const current = await isCurrentUser(username)
  const def = getCategoryDef(params)
  const category = categories.get(def.keys.category ?? '')
  return (
    <Container pad="unresponsive">
      <Heading {...params}>
        <IngredientList category={category} isCurrentUser={current} />
      </Heading>
    </Container>
  )
}
