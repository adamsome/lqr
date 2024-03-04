import invariant from 'tiny-invariant'

import { FollowButtonContainer } from '@/app/components/user/follow-button-container'
import { UserAvatarHeader } from '@/app/components/user/user-avatar-header'
import { getCurrentUser } from '@/app/lib/model/user'
import { getUserSpecs } from '@/app/lib/model/user-specs'
import { applyCriteria } from '@/app/u/[username]/specs/_criteria/apply'
import { Criteria } from '@/app/u/[username]/specs/_criteria/types'
import { Count } from '@/app/u/[username]/specs/count'
import { FiltersContainer } from '@/app/u/[username]/specs/filters-container'
import { Grid } from '@/app/u/[username]/specs/grid'
import { Specs } from '@/app/u/[username]/specs/specs'
import { Toolbar } from '@/app/u/[username]/specs/toolbar'
import {
  MobileHorizontalScroller,
  UsersToFollow,
} from '@/app/u/[username]/users-to-follow'

type Props = {
  username?: string
  criteria: Criteria
}

export async function SpecsContainer({
  username,
  criteria: criteriaProp,
}: Props) {
  const { user, currentUser, isCurrentUser } = await getCurrentUser(username)

  invariant(user && username, `User not found.`)

  const { data, specs, userDict } = await getUserSpecs(user.id, {
    ingredientsStockUserID: currentUser?.id,
  })

  const criteria = currentUser
    ? criteriaProp
    : { ...criteriaProp, sort: criteriaProp.sort ?? 'updated' }

  const filteredSpecs = applyCriteria(data, specs, criteria)

  // const suggestions = getSpecIngredientSuggestions(data.dict, filteredSpecs)

  const filters = <FiltersContainer userDict={userDict} criteria={criteria} />

  return (
    <Specs
      username={username}
      header={
        <>
          <UserAvatarHeader selected="specs" username={username}>
            {!isCurrentUser && <FollowButtonContainer username={username} />}
          </UserAvatarHeader>
          <UsersToFollow
            username={username}
            Wrapper={MobileHorizontalScroller}
          />
        </>
      }
      toolbar={<Toolbar {...criteria} />}
      filters={filters}
      sidebar={<UsersToFollow username={username} />}
      status={<Count count={filteredSpecs.length} total={specs.length} />}
    >
      <Grid
        specs={filteredSpecs}
        userDict={userDict}
        criteria={criteria}
        count={filteredSpecs.length}
        showStock={Boolean(currentUser)}
      />
    </Specs>
  )
}
