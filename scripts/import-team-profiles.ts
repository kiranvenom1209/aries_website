import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { importTeamProfiles } from '../src/seed/teamProfileImport'

const apply = process.argv.includes('--apply')
const payload = await getPayload({ config })
try {
  const changes = await importTeamProfiles(payload, apply, process.argv.includes('--fill-empty'))
  for (const change of changes) console.log(`[Team profiles] ${apply ? 'Updated' : 'Would update'} ${change.slug}: ${change.fields.join(', ')}`)
  console.log(`[Team profiles] ${changes.length} profiles ${apply ? 'updated' : 'eligible'}. Custom admin content preserved.`)
} finally {
  await payload.destroy()
}
process.exit(0)
