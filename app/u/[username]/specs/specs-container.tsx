import { applyCriteria } from '@/app/u/[username]/specs/_criteria/apply'
import { Criteria } from '@/app/u/[username]/specs/_criteria/types'
import { FiltersContainer } from '@/app/u/[username]/specs/filters-container'
import { Specs } from '@/app/u/[username]/specs/specs'
import { getSpecStock } from '@/lib/ingredient/get-spec-stock'
import { getFolloweeIDs } from '@/lib/model/follow'
import { getIngredientData } from '@/lib/model/ingredient-data'
import { getSpecs } from '@/lib/model/spec'
import { getManyUsers } from '@/lib/model/user'
import { User } from '@/lib/types'

type Props = {
  user: User
  criteria: Criteria
}

export async function SpecsContainer({ user, criteria }: Props) {
  const userIDs = await getFolloweeIDs(user.id)

  const [users, data, rawSpecs] = await Promise.all([
    getManyUsers(userIDs),
    getIngredientData(),
    getSpecs(userIDs),
  ])

  const { dict, tree } = data
  const getStock = getSpecStock(dict, tree)
  const allSpecs = rawSpecs.map((spec) => ({ ...spec, stock: getStock(spec) }))

  const specs = applyCriteria(data, allSpecs, criteria)

  return (
    <Specs
      specs={specs}
      user={user}
      data={data}
      criteria={criteria}
      total={allSpecs.length}
      filters={
        <FiltersContainer users={users} data={data} criteria={criteria} />
      }
    />
  )
}
