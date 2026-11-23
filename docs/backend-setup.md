# Progress API setup

The Vercel functions store only student-created progress, bookmarks, and feedback in the Atlas database `reviewerv1`. Formula, lesson, and problem content remains in the repository and does not depend on the API.

## Local environment

Copy `.env.example` to `.env` and replace each placeholder locally. Do not commit `.env`, paste its values into chat, or prefix server variables with `VITE_`.

Required variables:

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | Atlas connection URI for the server-only MongoDB driver |
| `PRODUCTION_ORIGIN` | Exact public site origin, such as `https://study.example.com` (no path or trailing slash) |
| `RATE_LIMIT_SECRET` | Random secret used to hash client IPs before storing rate-limit buckets |

Generate a rate-limit secret locally with `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"`. Never use the MongoDB URI in a client-side variable.

Install the Vercel CLI once if it is not already available, then log in and link the repository to the Vercel project:

```powershell
npm.cmd install --global vercel
vercel.cmd login
vercel.cmd link
```

Run the app and its `/api` functions together with `npm.cmd run dev:vercel`. Vercel CLI uses local environment files for development; alternatively, use `vercel.cmd env pull .env.local` after linking. Both `.env` and `.env.local` are ignored by Git.

## Atlas database user and network access

1. In Atlas, select the project that contains the existing cluster and open **Security → Database Access**.
2. Add a database user with password/SCRAM authentication. Use a unique generated password.
3. Assign only the built-in `readWrite` role scoped to the `reviewerv1` database using **Specific Privileges**. If the interface requires a custom role, create one with only `readWrite` on `reviewerv1` and assign it to this user. Do not grant `readWriteAnyDatabase`, `Atlas admin`, or project-management roles.
4. In the cluster's **Connect → Drivers** flow, copy the Node.js connection URI and select `reviewerv1` as the database. Put it in local `.env` as `MONGODB_URI`; URL-encode reserved characters in the password.
5. In Atlas, open **Security → Network Access → IP Access List**. Atlas rejects connections not on this list. Vercel functions normally use dynamic outbound IPs, so a developer's home IP is not enough for production.

For production, prefer either:

- The MongoDB Atlas integration in the Vercel Marketplace, if it is available for your accounts; follow its connection and network prompts, then verify the resulting URI is stored as the server-side `MONGODB_URI`.
- Vercel static outbound IPs (or dedicated Secure Compute, if your plan provides it). Enable the feature for the project, copy its egress IP/CIDR entries from Vercel, and add every required entry to the Atlas IP Access List. Check Vercel's current plan and pricing before enabling it.

Allowing `0.0.0.0/0` is a less secure fallback sometimes used when the hosting provider cannot supply stable egress IPs. It permits network connections from anywhere; Atlas credentials and TLS still apply, but the network layer no longer limits the source. Use it only if necessary, with the database-scoped user and a strong password, and replace it with a narrower list when stable Vercel egress is available.

## Vercel environment variables

In the Vercel project, open **Settings → Environment Variables** and add all three values for the environments you use:

- `MONGODB_URI`: the Atlas URI, kept server-side only.
- `PRODUCTION_ORIGIN`: the exact production origin, for example `https://study.example.com`.
- `RATE_LIMIT_SECRET`: the locally generated random value.

Keep `PRODUCTION_ORIGIN` set to the production domain in Production. The API permits localhost origins during local development and only the configured origin in production; preview deployments are intentionally not allowed unless separately configured.

## Collections and API behavior

The API creates these indexes when a function first connects:

- `progress`: unique `{ clientId, problemId }`, plus `{ clientId, updatedAt }`.
- `bookmarks`: unique `{ clientId, formulaId }`, plus `{ clientId, createdAt }`.
- `feedback`: `{ createdAt }`.
- `rateLimits`: TTL index on `expiresAt`.

The API validates every query/body with Zod, caps feedback messages at 1,000 characters, and limits POSTs per source IP to 30 per minute for progress/bookmarks and 8 per minute for feedback. IPs are HMAC-hashed before being used as rate-limit keys. CORS is not authentication: the anonymous `clientId` is a browser-generated UUID and can be copied or spoofed. Do not store sensitive or identifying information in these collections. `getClientId()` in `src/lib/api-client.js` is the single client identity seam to replace if authentication is added later.

When the API is unavailable, formula and problem content remains usable. Progress and bookmarks are saved locally and queued for synchronization when the API returns; feedback is not queued, and the form reports clearly when a message was not sent.

## Password rotation

1. Create a second Atlas database user with the same least-privilege `readWrite` access to `reviewerv1`, using a new unique password.
2. Update `MONGODB_URI` in Vercel's required environments and in local `.env`/`.env.local`. Do not send the URI to anyone or commit it.
3. Redeploy, then verify the formula page can load, a bookmark can be added/removed, a practice attempt is recorded, and feedback receives a success response.
4. After the new credential is verified, delete the old database user in Atlas. If verification fails, keep the old user temporarily and correct the new URI/access configuration before retiring it.
