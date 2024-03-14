import { getSpecStock } from '@/app/lib/ingredient/get-spec-stock'
import { getAllFollowing } from '@/app/lib/model/follow'
import { getIngredientData } from '@/app/lib/model/ingredient-data'
import { getAllSpecsWithUserIDs } from '@/app/lib/model/spec'
import { getAllUsers } from '@/app/lib/model/user'
import { toDict } from '@/app/lib/utils'

export async function getUserSpecs(
  specsUserID: string,
  { ingredientsStockUserID }: { ingredientsStockUserID?: string } = {},
) {
  const [follows, data] = await Promise.all([
    getAllFollowing(specsUserID),
    getIngredientData(ingredientsStockUserID),
  ])

  const userIDs = [
    specsUserID,
    ...follows.filter(({ follows }) => follows).map(({ followee }) => followee),
  ]

  const [users, rawSpecs] = await Promise.all([
    getAllUsers(userIDs),
    getAllSpecsWithUserIDs(userIDs),
  ])

  const userDict = toDict(users, (u) => u.username)

  const getStock = getSpecStock(data.dict, data.tree)
  const specs = rawSpecs.map((spec) => ({ ...spec, stock: getStock(spec) }))

  return { data, specs, userDict }
}

// TODO: Control from DB
const globalUserIDs = [
  'user_2QaSdLhpL7dMcmD999SKB2teEIM', // adamsome
  'user_classics',
  'user_modern_classics',
  'user_deathcowelcomehome',
  'user_smugglerscove',
]

export async function getGlobalSpecs() {
  const data = await getIngredientData()

  const [users, rawSpecs] = await Promise.all([
    getAllUsers(globalUserIDs),
    getAllSpecsWithUserIDs(globalUserIDs),
  ])

  const userDict = toDict(users, (u) => u.username)

  const getStock = getSpecStock(data.dict, data.tree)
  const specs = rawSpecs.map((spec) => ({ ...spec, stock: getStock(spec) }))

  return { data, specs, userDict }
}
