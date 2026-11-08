import { Metadata } from 'next'
import Link from 'next/link'
import { ReactNode } from 'react'

import {
  AppContent,
  AppHeader,
  AppLayout,
} from '@/app/components/layout/app-layout'

export const metadata: Metadata = {
  title: 'Privacy Policy · lqr',
}

const CONTACT_EMAIL = 'privacy@adamso.me'
const UPDATED = 'November 8, 2026'

export default function Page() {
  return (
    <AppLayout>
      <AppHeader title="Privacy Policy" forceTitle />
      <AppContent className="mx-auto flex max-w-2xl flex-col gap-6 px-6 pb-16 leading-relaxed">
        <div>
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">
            Last updated {UPDATED}
          </p>
        </div>

        <p>
          lqr (<Link href="/">lqr.adamso.me</Link>) is a free, non-commercial
          home bar manager: you track which bottles and ingredients you have and
          browse cocktail recipes (&ldquo;specs&rdquo;) you can make. It is a
          personal project run by its developer. This policy explains what lqr
          collects, why, and how to have it deleted.
        </p>

        <Section title="What lqr collects">
          <ul className="list-disc space-y-2 ps-6">
            <li>
              <strong>If you sign in with Google:</strong> your name, email
              address, and profile picture, using Google&rsquo;s basic{' '}
              <code>openid</code>, <code>email</code>, and <code>profile</code>{' '}
              scopes. lqr does not access your contacts, calendar, Gmail, Drive,
              or any other Google data.
            </li>
            <li>
              <strong>If you sign in with an email link:</strong> your email
              address.
            </li>
            <li>
              <strong>What you add:</strong> your username, the ingredients you
              mark as in stock, the specs you create, and the users you follow.
            </li>
            <li>
              <strong>Sign-in sessions:</strong> a session record (including the
              IP address and browser user agent at sign-in) and a cookie that
              keeps you signed in.
            </li>
          </ul>
        </Section>

        <Section title="How it is used">
          <p>
            Your Google or email information is used only to sign you in, to
            create your account, and to show your username and profile picture.
            Your bar, specs, and follows are used to run the app&rsquo;s
            features. lqr has no ads, no analytics or tracking, and does not
            sell, rent, or share your information, or use it for any other
            purpose.
          </p>
          <p>
            Your username, profile picture, bar, specs, and follows are visible
            to other visitors, since browsing other people&rsquo;s bars and
            specs is part of the app. Your email address is never shown to
            others.
          </p>
        </Section>

        <Section title="Google user data">
          <p>
            lqr&rsquo;s use and transfer of information received from Google
            APIs adheres to the{' '}
            <a
              className="underline"
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noreferrer"
            >
              Google API Services User Data Policy
            </a>
            , including the Limited Use requirements.
          </p>
        </Section>

        <Section title="Where it is stored">
          <p>
            Data is stored in a MongoDB Atlas database. The site is hosted on
            Vercel, and sign-in emails are sent through Resend. These services
            process data only to provide hosting, storage, and email delivery
            for lqr.
          </p>
        </Section>

        <Section title="Cookies">
          <p>
            lqr uses only the cookies needed to keep you signed in. There are no
            advertising or tracking cookies.
          </p>
        </Section>

        <Section title="Keeping and deleting your data">
          <p>
            Your data is kept while your account exists. To delete your account
            and everything associated with it, or to ask what data lqr holds
            about you, email{' '}
            <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
            . Requests are handled within 30 days. You can also revoke
            lqr&rsquo;s access to your Google account at any time from your{' '}
            <a
              className="underline"
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noreferrer"
            >
              Google Account permissions
            </a>
            .
          </p>
        </Section>

        <Section title="Changes">
          <p>
            If this policy changes, the updated version will be posted here with
            a new date.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions:{' '}
            <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          </p>
        </Section>
      </AppContent>
    </AppLayout>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </section>
  )
}
