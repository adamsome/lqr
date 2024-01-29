'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { AppBack } from '@/app/components/layout/app-layout'
import { API_USERS, toSpecs } from '@/app/lib/routes'
import { User } from '@/app/lib/types'
import { USER_KEY } from '@/app/u/[username]/specs/_criteria/consts'

type Props = {
  user: User
}

export function Back({ user: userProp }: Props) {
  const [fetched, setFetched] = useState(false)
  const [user, setUser] = useState(userProp)
  const searchParams = useSearchParams()
  const username = searchParams.get(USER_KEY)

  useEffect(() => {
    const fetchUser = async () => {
      if (!username) return
      let res
      try {
        res = await fetch(`${API_USERS}/${username}`)
        const { user } = await res.json()
        if (user) {
          setUser(user)
        }
        setFetched(true)
      } catch (err: any) {
        let msg = (err?.data ?? err) as string
        if (typeof msg !== 'string')
          msg = `Unknown error getting user '${username}'`
        console.error(msg, err?.data ?? err)
        setFetched(true)
      }
    }
    fetchUser()
  }, [username])

  return (
    <AppBack
      href={toSpecs(user.username)}
      user={username && !fetched ? null : user}
    />
  )
}
