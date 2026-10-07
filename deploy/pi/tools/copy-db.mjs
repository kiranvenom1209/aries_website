// One-off move of the CMS content from Netlify Database into the Pi's PostgreSQL (deploy/pi/bin/import-netlify.sh).
//
//   SOURCE_URL_FILE=/path/netlify-db-url.txt node copy-db.mjs      (run as the postgres OS user – the import script does)
//
// Copies every table both databases have, row for row, for the columns both sides have. The values travel as JSON
// text and PostgreSQL converts them back itself (json_populate_recordset), so timestamps keep their microseconds and
// enums, numerics, arrays and jsonb arrive exactly as they left – independent of the two servers' versions (pg_dump
// would need a client at least as new as Netlify's server). The target's tables come from Payload's schema sync
// (the first deploy) and are emptied first; payload_migrations stays the target's own. Foreign keys are not checked
// during the load (session_replication_role = replica, which needs the superuser) – the rows come from a consistent
// database. Prints table names and row counts only, never values.
import fs from 'node:fs'

import pg from 'pg'

const sourceFile = process.env.SOURCE_URL_FILE
if (!sourceFile) throw new Error('SOURCE_URL_FILE (a file with the Netlify Database connection string) is required')
const sourceURL = fs.readFileSync(sourceFile, 'utf8').replace(/^﻿/, '').trim()
if (!/^postgres(ql)?:\/\//.test(sourceURL)) throw new Error(`${sourceFile} does not contain a postgres:// connection string`)

const targetDB = process.env.TARGET_DB ?? 'aries'
const BATCH = 500
const SKIP = new Set(['payload_migrations'])

const source = new pg.Client({ connectionString: sourceURL, ssl: sourceURL.includes('sslmode=disable') ? false : { rejectUnauthorized: true } })
// local socket, peer authentication as the postgres superuser
const target = new pg.Client({ database: targetDB, host: process.env.TARGET_SOCKET_DIR ?? '/var/run/postgresql' })

const ident = (name) => `"${name.replaceAll('"', '""')}"`

const tablesOf = async (client) => {
  const { rows } = await client.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`,
  )
  return new Set(rows.map((row) => row.table_name))
}

const columnsOf = async (client, table) => {
  const { rows } = await client.query(
    `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1 ORDER BY ordinal_position`,
    [table],
  )
  return rows.map((row) => row.column_name)
}

await source.connect()
await target.connect()
try {
  await source.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY') // one consistent snapshot of the source

  const sourceTables = await tablesOf(source)
  const targetTables = await tablesOf(target)
  if (targetTables.size === 0) throw new Error(`database ${targetDB} has no tables yet – deploy the site once first (Payload creates them)`)
  const tables = [...sourceTables].filter((table) => targetTables.has(table) && !SKIP.has(table)).sort()
  for (const table of [...sourceTables].filter((t) => !targetTables.has(t))) console.log(`skip ${table}: not in the Pi's schema`)
  for (const table of [...targetTables].filter((t) => !sourceTables.has(t) && !SKIP.has(t))) console.log(`keep ${table}: new on the Pi, stays empty`)

  await target.query('BEGIN')
  await target.query(`SET LOCAL session_replication_role = replica`)
  await target.query(`TRUNCATE ${tables.map(ident).join(', ')} RESTART IDENTITY CASCADE`)

  let total = 0
  for (const table of tables) {
    const targetColumns = new Set(await columnsOf(target, table))
    const columns = (await columnsOf(source, table)).filter((column) => targetColumns.has(column))
    const list = columns.map(ident).join(', ')
    let copied = 0
    // a cursor inside the snapshot: every row exactly once, also in tables without a unique first column
    await source.query(`DECLARE rows_cursor NO SCROLL CURSOR FOR SELECT row_to_json(t)::text AS r FROM (SELECT ${list} FROM ${ident(table)}) t`)
    for (;;) {
      const { rows } = await source.query(`FETCH ${BATCH} FROM rows_cursor`)
      if (rows.length === 0) break
      const result = await target.query(
        `INSERT INTO ${ident(table)} (${list}) SELECT ${list} FROM json_populate_recordset(NULL::${ident(table)}, $1::json)`,
        [`[${rows.map((row) => row.r).join(',')}]`],
      )
      copied += result.rowCount
    }
    await source.query('CLOSE rows_cursor')
    total += copied
    console.log(`${table}: ${copied} rows`)
  }

  // serial/identity counters continue after the copied ids
  const { rows: sequences } = await target.query(`
    SELECT c.table_name, c.column_name, pg_get_serial_sequence(quote_ident(c.table_name), c.column_name) AS seq
    FROM information_schema.columns c
    WHERE c.table_schema = 'public' AND pg_get_serial_sequence(quote_ident(c.table_name), c.column_name) IS NOT NULL`)
  for (const { column_name: column, seq, table_name: table } of sequences) {
    await target.query(
      `SELECT setval($1, coalesce((SELECT max(${ident(column)}) FROM ${ident(table)}), 1), (SELECT count(*) > 0 FROM ${ident(table)}))`,
      [seq],
    )
  }

  await target.query('COMMIT')
  console.log(`done: ${tables.length} tables, ${total} rows, ${sequences.length} sequences reset`)
} catch (error) {
  await target.query('ROLLBACK').catch(() => {})
  throw error
} finally {
  await source.end().catch(() => {})
  await target.end().catch(() => {})
}
