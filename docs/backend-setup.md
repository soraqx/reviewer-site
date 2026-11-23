# Convex backend setup

The app stores student-created progress, bookmarks, feedback, and rate-limit
buckets in Convex. Formula, lesson, and problem content remains in repository
JSON and does not depend on the backend. Vercel `/api` functions call a
private Convex HTTP action over HTTPS, so Vercel does not need a static egress
IP or direct database credentials.

## 1. Create a Convex project

From the repository root, install the project dependencies and start the
Convex development deployment:

```powershell
npm.cmd install
npm.cmd run dev:convex
```

The first run opens browser login and asks you to create or select a Convex
project. The CLI creates a development deployment, writes its local
`CONVEX_DEPLOYMENT` setting to `.env.local`, and generates
`convex/_generated/` files. Keep the generated `api.js` and `server.js` runtime
helpers in Git because the backend imports them. Convex's AI guidance and
type-checking helper files are ignored because they are not deployed. Never
commit `.env.local`.

Leave `npm.cmd run dev:convex` running in one terminal. It watches the
`convex/` directory and deploys backend changes to the development deployment.

## 2. Configure the private gateway secret

Generate a random secret locally:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

In the Convex dashboard, select your **development deployment**, then open
**Settings → Environment Variables** (Deployment Settings). Add
`CONVEX_API_SECRET` and paste the generated value as its value. Environment
variables are deployment-specific, so confirm the development deployment is
selected.

Copy that deployment's **HTTP Actions URL**, which ends in `.convex.site`.
Add these values to the existing local `.env.local` file created by the
Convex CLI:

```dotenv
CONVEX_SITE_URL=https://<your-dev-deployment>.convex.site
CONVEX_API_SECRET=<the-same-development-secret>
PRODUCTION_ORIGIN=https://<your-production-domain>.vercel.app
RATE_LIMIT_SECRET=<a-different-random-32-byte-secret>
```

Keep the Convex CLI's existing `CONVEX_DEPLOYMENT` entry in `.env.local`.
`CONVEX_API_SECRET` authenticates Vercel's server-to-server gateway calls;
`RATE_LIMIT_SECRET` HMAC-hashes IP addresses before rate-limit records are
stored. Never use a `VITE_` prefix for either secret.

## 3. Test locally

In a second terminal, start Vercel's local frontend and `/api` functions:

```powershell
npm.cmd run dev:vercel
```

Open the URL Vercel CLI prints. Test progress recording, bookmark add/remove,
and feedback submission. Verify the documents appear in the Convex
development deployment's **Data** view. If the Convex service is unavailable,
formula and problem content remains usable; progress and bookmarks fall back
to local storage, and feedback reports that it was not sent.

## 4. Configure production deployment

### Convex

1. In the Convex dashboard, create or select the production deployment.
2. Set a production-only `CONVEX_API_SECRET` in that deployment. Use a new
   random value; do not reuse the development secret.
3. Copy the production deployment's **HTTP Actions URL** ending in
   `.convex.site`.
4. Generate a **Production Deploy Key** with the `deployment:deploy`
   permission. Keep it private.

### Vercel

In **Project → Settings → Environment Variables**, set the following for
Production:

| Variable | Value |
| --- | --- |
| `CONVEX_SITE_URL` | Production Convex HTTP Actions URL |
| `CONVEX_API_SECRET` | The matching production Convex secret |
| `PRODUCTION_ORIGIN` | Exact public production origin, with no trailing slash |
| `RATE_LIMIT_SECRET` | A random 32-byte secret, different from `CONVEX_API_SECRET` |
| `CONVEX_DEPLOY_KEY` | Production Deploy Key from Convex |

Set Vercel's **Build Command** to:

```sh
if [ "$VERCEL_ENV" = "production" ]; then npx convex deploy --cmd 'npm run build'; else npm run build; fi
```

This deploys Convex functions together with production builds. Preview builds
still build the site, but the API is intentionally unavailable there unless
you separately configure a Convex preview deployment and matching Preview
environment variables. The API only allows the configured production origin;
CORS is not authentication.

Redeploy after adding environment variables. Verify progress, bookmarks, and
feedback on the deployed production URL, and verify records in the production
Convex dashboard. Do not put `CONVEX_DEPLOY_KEY` or `CONVEX_API_SECRET` in
client-side variables, source files, screenshots, or chat.

## Data model and API behavior

Convex schema and indexes are defined in `convex/schema.js`:

- `progress`: one record per `{ clientId, problemId }`, indexed for client
  lookups and recent updates.
- `bookmarks`: one record per `{ clientId, formulaId }`, indexed for client
  lookups and recent additions.
- `feedback`: problem or lesson target, message, and creation time.
- `rateLimits`: HMAC-hashed source IP, route, time-window count, and expiry.
  Expired buckets are cleaned hourly.

Vercel validates API inputs with Zod, checks the request origin, and limits
progress/bookmark writes to 30 per IP per minute and feedback to 8 per IP per
minute. Only Vercel's server-side functions can use the Convex gateway because
it requires `CONVEX_API_SECRET`. Anonymous `clientId` values are still
browser-generated UUIDs and can be copied or spoofed; do not store sensitive
or identifying information in these collections.

## Remove MongoDB and Atlas from this app

MongoDB has been removed from the application dependencies and source code.
After Convex production is verified:

1. In Vercel, remove `MONGODB_URI` from Development, Preview, and Production
   environment variables, if it was added.
2. Remove any Atlas network access list entries that were added only for this
   app.
3. Delete the Atlas database user created only for this app. Keep the
   `reviewerv1` database or other Atlas users if another project uses them.
4. If the app has records in Atlas that must be kept, export and migrate them
   before deleting the Atlas user or database. If no student data was stored,
   there is nothing to migrate.
5. In this repository, verify there are no `mongodb` dependencies or
   `MONGODB_URI` references:

   ```powershell
   npm.cmd ls mongodb
   git grep -n -E "mongodb|MONGODB_URI|MongoClient" -- "*.js" "*.json"
   ```

The package listing should be empty, and `git grep` should return no
application source/config matches. `.env.example` contains placeholders only;
local `.env` and `.env.local` remain ignored by Git.

## Rotate gateway secrets

Rotate development and production secrets independently:

1. Generate a new random value locally.
2. Set `CONVEX_API_SECRET` in the matching Convex deployment.
3. Update the same deployment's Vercel `CONVEX_API_SECRET` value.
4. Redeploy and verify API reads and writes.
5. If verification fails, correct the values and redeploy. Do not disclose
   either value.
