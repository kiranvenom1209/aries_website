import config from '@payload-config'
import '@payloadcms/next/css'
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'

const rawGET = REST_GET(config)
const rawPOST = REST_POST(config)
const rawDELETE = REST_DELETE(config)
const rawPATCH = REST_PATCH(config)
const rawPUT = REST_PUT(config)
const rawOPTIONS = REST_OPTIONS(config)

const wrapHandler = (handler: any, name: string) => async (request: Request, args: any) => {
  try {
    return await handler(request, args)
  } catch (err: any) {
    console.error(`[Payload API ${name} Error]:`, err)
    return Response.json(
      {
        errors: [{ message: err?.message || 'An unexpected error occurred in Payload API.' }],
        message: err?.message || 'An unexpected error occurred in Payload API.',
      },
      { status: err?.status || err?.statusCode || 500 },
    )
  }
}

export const GET = wrapHandler(rawGET, 'GET')
export const POST = wrapHandler(rawPOST, 'POST')
export const DELETE = wrapHandler(rawDELETE, 'DELETE')
export const PATCH = wrapHandler(rawPATCH, 'PATCH')
export const PUT = wrapHandler(rawPUT, 'PUT')
export const OPTIONS = wrapHandler(rawOPTIONS, 'OPTIONS')

