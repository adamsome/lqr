'use client'

import { EnvelopeClosedIcon } from '@radix-ui/react-icons'
import { FormEvent, useState } from 'react'

import { Button } from '@/app/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Loader } from '@/app/components/ui/loader'
import { authClient } from '@/app/lib/auth-client'

// Landing route after sign-in; it routes new users into onboarding
const CALLBACK_URL = '/u'

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_TOKEN: 'That sign-in link is invalid. Request a new one.',
  EXPIRED_TOKEN: 'That sign-in link has expired. Request a new one.',
}

type Props = {
  error?: string
}

export function SignInForm({ error: initialError }: Props) {
  const [email, setEmail] = useState('')
  const [pending, setPending] = useState<'google' | 'email' | null>(null)
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(
    initialError ? (ERROR_MESSAGES[initialError] ?? initialError) : null,
  )

  async function handleGoogle() {
    setError(null)
    setPending('google')
    const { error } = await authClient.signIn.social({
      provider: 'google',
      callbackURL: CALLBACK_URL,
      errorCallbackURL: '/sign-in',
    })
    // On success the browser navigates to Google
    if (error) {
      setError(error.message ?? 'Google sign-in failed.')
      setPending(null)
    }
  }

  async function handleEmail(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setPending('email')
    const { error } = await authClient.signIn.magicLink({
      email,
      callbackURL: CALLBACK_URL,
      newUserCallbackURL: CALLBACK_URL,
      errorCallbackURL: '/sign-in',
    })
    setPending(null)
    if (error) {
      setError(error.message ?? 'Could not send the sign-in link.')
      return
    }
    setSentTo(email)
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in to lqr</CardTitle>
        <CardDescription>
          New here? Signing in creates your bar.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {sentTo ? (
          <div className="flex flex-col gap-3 text-sm">
            <p>
              Check <strong>{sentTo}</strong> for a sign-in link. It expires in
              5 minutes.
            </p>
            <Button variant="outline" onClick={() => setSentTo(null)}>
              Use a different email
            </Button>
          </div>
        ) : (
          <>
            <Button
              variant="secondary"
              disabled={pending != null}
              onClick={handleGoogle}
            >
              {pending === 'google' ? (
                <Loader loading />
              ) : (
                'Continue with Google'
              )}
            </Button>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              or
              <div className="h-px flex-1 bg-border" />
            </div>

            <form className="flex flex-col gap-3" onSubmit={handleEmail}>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email webauthn"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" disabled={pending != null || !email}>
                {pending === 'email' ? (
                  <Loader loading />
                ) : (
                  <>
                    <EnvelopeClosedIcon className="mr-2" />
                    Email me a sign-in link
                  </>
                )}
              </Button>
            </form>
          </>
        )}

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
