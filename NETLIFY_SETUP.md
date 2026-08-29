# HSM Aries CMS on Netlify

This project is self-hosted: the public site and the Payload CMS run from the same Next.js deployment. Editors use `/admin`; the public newsroom reads the same database.

## First deploy

1. Create a new Netlify site from this repository.
2. In the Netlify project, create **Netlify Database**. Netlify injects `NETLIFY_DB_URL` automatically; do not replace it with the local SQLite URL.
3. Add these site environment variables:

   | Variable | Required | Value |
   | --- | --- | --- |
   | `PAYLOAD_SECRET` | Yes | A long, random secret. Keep it private and stable. |
   | `NEXT_PUBLIC_SITE_URL` | Yes | The canonical deployed URL, for example `https://hsmaries.space`. |
   | `PAYLOAD_MAX_UPLOAD_BYTES` | Optional | Maximum CMS upload size in bytes. The default is `50000000` (50 MB). |
   | `PAYLOAD_DB_PUSH` | Optional | Leave unset for the first deploy so Payload creates/synchronizes its tables. Set to `false` once you manage later schema changes through Payload migrations. |
   | `BOOTSTRAP_ADMIN_EMAIL` | First deploy | Email address for the first Payload administrator. |
   | `BOOTSTRAP_ADMIN_PASSWORD` | First deploy | A private password of at least 12 characters for the first Payload administrator. |
4. Deploy. The database schema is automatically created on the first Netlify deploy. When the database is empty, the build creates one administrator from the two `BOOTSTRAP_ADMIN_*` variables. Subsequent builds never modify an existing account. Uploaded media is placed in the Netlify Blob store named `hsm-aries-media`, not in the temporary serverless filesystem.
5. Visit `/admin` and sign in with the bootstrap email and password. After the first successful login, you may remove the two `BOOTSTRAP_ADMIN_*` variables from Netlify because the account persists in Postgres.

### Importing environment variables

Copy `.env.netlify.example` to `.env.netlify`, replace the `PAYLOAD_SECRET` placeholder with a private 64-character random value, and import that completed file under **Project configuration → Environment variables**. The completed `.env.netlify` file is ignored by Git and must never be committed. Netlify supplies `NETLIFY_DB_URL` automatically after its database is provisioned; do not add the local SQLite `DATABASE_URL` to Netlify.

## Editorial workflow

Open **News → Create new Story** in `/admin`.

1. Set the title, slug, excerpt, category, byline and date.
2. Upload a required cover image to **Featured image**.
3. Optionally upload a primary MP4/WebM in **Primary video** and add any number of figures or videos to **Supporting media**. Each supporting item can carry a publication-specific caption.
4. Write the body with headings for strong article sections, save as a draft, then publish or schedule it.
5. The Payload **Live Preview** view opens by default. It previews desktop, tablet and mobile layouts and receives title, copy, byline, cover, video and media-deck edits live. A brand-new post needs one draft save first so its slug exists for the preview URL.

The public article uses the cover as its masthead, a native video player when supplied, and an editorial media deck after the body. That keeps the new posts as rich as the existing WordPress articles without requiring hand-written page code.

## Local development

`npm run dev` uses `DATABASE_URL=file:./hsm-aries.db` and local `./media` files. This is intentionally separate from production. `npm run seed` refreshes the curated content in that local database.

## Production schema changes

The initial automatic schema push is intentionally convenient for a standalone Netlify launch. For controlled changes after launch, commit Payload migrations and set `PAYLOAD_DB_PUSH=false`:

```powershell
npx payload migrate:create newsroom-media-update
npx payload migrate
```

Do not use a SQLite file as production storage on Netlify: the function filesystem is ephemeral. Netlify Database supplies persistent Postgres data and Netlify Blobs supplies persistent image/video files.
