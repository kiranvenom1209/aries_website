/** The team mailbox that receives form notifications unless FORMS_NOTIFY_TO names another address. */
export const TEAM_MAILBOX = 'hsmariesleapone@gmail.com'

export type SmtpSettings = {
  fromAddress: string
  fromName: string
  host: string
  pass: string
  port: number
  user: string
}

/**
 * Outgoing mail from the server's .env: SMTP_HOST, SMTP_PORT (465 = TLS, 587 = STARTTLS), SMTP_USER, SMTP_PASS and
 * optionally SMTP_FROM. For the team's Gmail account that is smtp.gmail.com, 465, the address and an app password.
 * Returns null while any required value is missing, so the site runs without e-mail.
 */
export const smtpSettings = (): SmtpSettings | null => {
  const host = process.env.SMTP_HOST?.trim()
  const user = process.env.SMTP_USER?.trim()
  const pass = process.env.SMTP_PASS
  if (!host || !user || !pass) return null

  const port = Number(process.env.SMTP_PORT ?? 465)
  return {
    fromAddress: process.env.SMTP_FROM?.trim() || user,
    fromName: 'HSM Aries website',
    host,
    pass,
    port: Number.isFinite(port) && port > 0 ? port : 465,
    user,
  }
}

export const formsNotifyAddress = () => process.env.FORMS_NOTIFY_TO?.trim() || TEAM_MAILBOX
