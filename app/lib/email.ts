import { Resend } from 'resend'

import 'server-only'

const FROM = 'lqr <login@mail.adamso.me>'

let resend: Resend | undefined

function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY is not set')
  return (resend ??= new Resend(key))
}

export async function sendMagicLinkEmail(email: string, url: string) {
  const { error } = await getResend().emails.send({
    from: FROM,
    to: email,
    subject: 'Sign in to lqr',
    text: `Sign in to lqr:\n\n${url}\n\nThis link expires in 5 minutes. If you didn't request it, you can ignore this email.`,
    html: `<p>Sign in to lqr:</p><p><a href="${url}">Sign in</a></p><p style="color:#666">This link expires in 5 minutes. If you didn't request it, you can ignore this email.</p>`,
  })
  if (error) throw new Error(`Failed to send sign-in email: ${error.message}`)
}
