import { FollowButton } from '@/app/components/user/follow-button'
import { getAllFollowing } from '@/app/lib/model/follow'
import { getUser } from '@/app/lib/model/user'
import { toDict } from '@/app/lib/utils'
import { auth } from '@clerk/nextjs'

type Props = {
  className?: string
  username?: string
}

export async function FollowButtonContainer({ className, username }: Props) {
  const { userId: currentUserID } = auth()
  const user = await getUser(username)
  if (!currentUserID || !user || !username) return null
  const following = await getAllFollowing(currentUserID)
  const byFollowee = toDict(following, ({ followee }) => followee)
  return (
    <FollowButton
      className={className}
      username={username}
      follow={byFollowee[user.id]}
    />
  )
}
