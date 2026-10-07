import config from '@payload-config'
import { getPayload } from 'payload'

import { FORM_NAMES, type FormName } from '@/collections/FormSubmissions'
import { formsNotifyAddress, smtpSettings } from '@/lib/mail'

export const dynamic = 'force-dynamic'

type Field = { key: string; label: string; name: string; long?: boolean }

const FIRST: Field = { key: 'firstName', label: 'First name', name: 'first-name' }
const SURNAME: Field = { key: 'surname', label: 'Surname', name: 'surname' }
const EMAIL: Field = { key: 'email', label: 'E-mail', name: 'email' }

const FORMS: Record<FormName, { context: string; fields: Field[]; title: string }> = {
  'general-contact': {
    context: 'contact',
    title: 'Contact',
    fields: [FIRST, SURNAME, EMAIL, { key: 'message', label: 'Message', long: true, name: 'message' }],
  },
  'join-aries': {
    context: 'join',
    title: 'Join the team',
    fields: [
      FIRST,
      SURNAME,
      EMAIL,
      { key: 'studyProgram', label: 'Study programme', name: 'study-program' },
      { key: 'semester', label: 'Semester', name: 'semester' },
      { key: 'divisionPreference', label: 'Preferred division', name: 'division-preference' },
      { key: 'message', label: 'Motivation', long: true, name: 'motivation' },
    ],
  },
  'partnership-enquiry': {
    context: 'partner',
    title: 'Partnership',
    fields: [
      FIRST,
      SURNAME,
      { key: 'company', label: 'Organisation', name: 'company' },
      EMAIL,
      { key: 'partnershipScope', label: 'Partnership scope', name: 'partnership-scope' },
      { key: 'message', label: 'Message', long: true, name: 'message' },
    ],
  },
}

const SHORT_MAX = 200
const LONG_MAX = 5000
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Per-address limit against floods: 5 messages in 10 minutes. In memory is enough for one server process.
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const recent = new Map<string, number[]>()

const clientAddress = (request: Request) =>
  request.headers.get('cf-connecting-ip') ??
  request.headers.get('x-nf-client-connection-ip') ??
  request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
  'unknown'

const rateLimited = (address: string) => {
  const now = Date.now()
  if (recent.size > 5000) recent.clear()
  const hits = (recent.get(address) ?? []).filter((time) => now - time < WINDOW_MS)
  hits.push(now)
  recent.set(address, hits)
  return hits.length > MAX_PER_WINDOW
}

const wantsJSON = (request: Request) => (request.headers.get('accept') ?? '').includes('application/json')

const ERROR_TEXT: Record<string, string> = {
  invalid: 'The form was incomplete. Please go back and fill in every field.',
  rate_limited: 'Too many messages from this connection. Please try again in a few minutes.',
  unavailable: 'The message could not be saved. Please try again later or write to hsmariesleapone@gmail.com.',
}

const reply = (request: Request, status: number, error?: keyof typeof ERROR_TEXT, context?: string) => {
  if (wantsJSON(request)) return Response.json({ ok: status < 400, ...(error ? { error } : {}) }, { status })
  // No JavaScript: a normal form post, answered with the same thank-you page the script navigates to.
  // Relative Location: behind the tunnel the server itself only sees plain http on 127.0.0.1.
  if (status < 400) return new Response(null, { headers: { Location: `/thank-you?form=${context}` }, status: 303 })
  return new Response(ERROR_TEXT[error ?? 'invalid'], {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    status,
  })
}

export async function POST(request: Request) {
  let body: FormData
  try {
    body = await request.formData()
  } catch {
    return reply(request, 400, 'invalid')
  }

  const formName = String(body.get('form-name') ?? '') as FormName
  if (!FORM_NAMES.includes(formName)) return reply(request, 400, 'invalid')
  const form = FORMS[formName]

  // Honeypot: people never see this field, bots fill it. Answer as if it worked and keep nothing.
  if (String(body.get('bot-field') ?? '').trim()) return reply(request, 200, undefined, form.context)

  if (rateLimited(clientAddress(request))) return reply(request, 429, 'rate_limited')

  const values: Record<string, string> = {}
  for (const field of form.fields) {
    const value = String(body.get(field.name) ?? '').trim()
    if (!value || value.length > (field.long ? LONG_MAX : SHORT_MAX)) return reply(request, 400, 'invalid')
    values[field.key] = value
  }
  if (!EMAIL_PATTERN.test(values.email)) return reply(request, 400, 'invalid')

  try {
    const payload = await getPayload({ config })
    const saved = await payload.create({
      collection: 'form-submissions',
      data: {
        company: values.company,
        divisionPreference: values.divisionPreference,
        email: values.email,
        firstName: values.firstName,
        form: formName,
        message: values.message,
        partnershipScope: values.partnershipScope,
        semester: values.semester,
        status: 'new',
        studyProgram: values.studyProgram,
        surname: values.surname,
      },
      overrideAccess: true,
    })

    if (smtpSettings()) {
      const site = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin
      const lines = form.fields.map((field) =>
        field.long ? `\n${field.label}:\n${values[field.key]}\n` : `${field.label}: ${values[field.key]}`,
      )
      try {
        await payload.sendEmail({
          replyTo: values.email,
          subject: `[hsmaries.space] ${form.title}: ${values.firstName} ${values.surname}`,
          text: [
            `New message from the "${form.title}" form on the website.`,
            '',
            ...lines,
            '',
            `Open it in Mission Control: ${site}/admin/collections/form-submissions/${saved.id}`,
            'Reply to this e-mail to answer the sender directly.',
          ].join('\n'),
          to: formsNotifyAddress(),
        })
        await payload.update({
          collection: 'form-submissions',
          data: { notified: true },
          id: saved.id,
          overrideAccess: true,
        })
      } catch (error) {
        // The message is stored; a failed notification must not make the visitor send it twice.
        payload.logger.error({ err: error, msg: '[Forms] notification e-mail failed' })
      }
    }

    return reply(request, 200, undefined, form.context)
  } catch (error) {
    console.error('[Forms] could not store a submission:', error)
    return reply(request, 500, 'unavailable')
  }
}
