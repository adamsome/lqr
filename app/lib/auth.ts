import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { nextCookies } from 'better-auth/next-js'
import { magicLink, username } from 'better-auth/plugins'

import { sendMagicLinkEmail } from '@/app/lib/email'
import {
  AUTH_MODELS,
  USERNAME_MAX,
  USERNAME_MIN,
  generateUsername,
  isValidUsername,
  syncUserEntity,
} from '@/app/lib/model/auth-user'
import { mongo } from '@/app/lib/mongodb'

import 'server-only'

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env

export const auth = betterAuth({
  appName: 'lqr',
  database: mongodbAdapter(mongo.db, { client: mongo.client }),
  trustedOrigins: [
    'http://localhost:3000',
    'https://lqr.adamso.me',
    'https://lqr.vercel.app',
    // Vercel preview deployments
    'https://lqr-*-adamsomes-projects.vercel.app',
  ],
  user: { modelName: AUTH_MODELS.user },
  session: {
    modelName: AUTH_MODELS.session,
    // Avoid a DB read on every request; sessions re-validate every 5 min
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },
  account: {
    modelName: AUTH_MODELS.account,
    // One person, one account: Google + magic link on the same email link up
    accountLinking: { enabled: true, trustedProviders: ['google'] },
  },
  verification: { modelName: AUTH_MODELS.verification },
  socialProviders:
    GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
          },
        }
      : undefined,
  databaseHooks: {
    user: {
      create: {
        // Sign-in methods don't collect a username; derive one from the email
        before: async (user) => {
          if (user.username) return
          const generated = await generateUsername(user.email)
          return { data: { ...user, username: generated } }
        },
        after: async (user) => syncUserEntity(user),
      },
      update: {
        after: async (user) => syncUserEntity(user),
      },
    },
  },
  plugins: [
    username({
      minUsernameLength: USERNAME_MIN,
      maxUsernameLength: USERNAME_MAX,
      usernameValidator: isValidUsername,
      displayUsername: false,
    }),
    magicLink({
      sendMagicLink: async ({ email, url }) => sendMagicLinkEmail(email, url),
    }),
    // Must be last: lets server actions set auth cookies
    nextCookies(),
  ],
})

export type Session = typeof auth.$Infer.Session
