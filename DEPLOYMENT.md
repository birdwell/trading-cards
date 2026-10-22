# Deployment Guide

Production runs on [Render](https://render.com), defined by the Blueprint in [`render.yaml`](render.yaml). The site is <https://cards.birdwell.ai>.

## What gets deployed

| Resource | Render type | Plan | Notes |
| --- | --- | --- | --- |
| `trading-cards` | Web service, `runtime: docker` | `1c-2g`, `virginia` | Builds [`Dockerfile`](Dockerfile). Custom domain `cards.birdwell.ai`. Health check `/healthz`. |
| `trading-cards-db` | Render Postgres 18 | `0.1c-256mb`, 5 GB disk, `virginia` | `DATABASE_URL` is wired in with `fromDatabase`. |

How the container runs:

- The image is based on `mcr.microsoft.com/playwright:v1.60.0-noble`. Imports scrape Beckett with Playwright Chromium (`server/services/get-checklist-source.ts`), and Chromium needs system packages that Render's native Node runtime can't install. Keep the image tag equal to the `playwright` version in `pnpm-lock.yaml`.
- Build: `pnpm install --frozen-lockfile`, then `pnpm run build` (Next.js build plus `tsc`).
- Start: `pnpm start`, which:
  1. syncs the Postgres schema (`drizzle-kit push` via `scripts/setup-db.js`),
  2. starts the tRPC server on `BACKEND_PORT=3002`, inside the container only,
  3. starts Next.js on Render's `PORT` (10000 by default).
- Browsers only talk to Next.js. tRPC calls go to `/trpc` on the same host, and Next.js proxies them to `localhost:3002`. Port 3002 is never public.
- `/healthz` returns 200 only when both Next.js and the tRPC server respond. It doesn't query Postgres. If the backend dies, Render stops routing to the instance after about 15 seconds of failed checks and restarts it after about 60.
- Memory: about 710 MB idle and about 950 MB while Chromium renders a page (measured locally with this image), so the 512 MB plan is too small.

### Environment variables

| Variable | Set by | Value |
| --- | --- | --- |
| `NODE_ENV` | `render.yaml` | `production` |
| `BACKEND_PORT` | `render.yaml` | `3002` |
| `NEXT_PUBLIC_BACKEND_PORT` | `render.yaml` | `3002` |
| `DATABASE_URL` | `render.yaml` (`fromDatabase`) | Internal URL of `trading-cards-db` |
| `AI_KEY` | You, at Blueprint creation (`sync: false`) | A **new** Vercel AI Gateway key: Vercel dashboard → AI Gateway → API Keys → Create key. Used for card extraction on import. |
| `GEMINI_MODEL` | Optional, dashboard | Defaults to `google/gemini-2.5-flash` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | Optional, dashboard | Clerk dashboard → API Keys. Not set today, so sign-in and card ownership are off. Next.js inlines `NEXT_PUBLIC_*` at build time (the Dockerfile declares it as a build arg), so redeploy after adding it. |

Render never needs `PORT` or `FRONTEND_PORT` from you. Next.js listens on the `PORT` Render injects.

## Migrating from Railway (one-time runbook)

> **Why now.** Railway disclosed on 2026-10-21 that an attacker read customer environment variables ([disclosure](https://blog.railway.com/p/security-disclosure-wednesday-october-21st), [status](https://status.railway.com)). Treat every value stored in Railway as compromised. **Do not copy secrets from Railway into Render**: mint new ones.
>
> **Do this first: revoke the Google AI key.** Railway still holds `GOOGLE_GENERATIVE_AI_API_KEY`, and AI-inference keys are what the attackers were after. Revoke it now in [Google AI Studio](https://aistudio.google.com/apikey) (API keys → delete the key). Nothing breaks: the code stopped reading that variable in `3346c50`, when imports moved to Vercel AI Gateway (`AI_KEY`). Don't add it to Render. If you ever go back to the direct Google provider, mint a fresh key then.

Order: back up data → mint new keys → put them only in Render → restore and verify on `onrender.com` → DNS cutover → revoke old keys → delete the Railway project. **You** do every step: they need dashboard access.

Railway builds and deploys are paused during the incident, but the running app still serves traffic. Merging this PR is safe: Railway can't build right now, and when builds resume the kept `railway.json` still pins its Nixpacks build. Even if Railway picked up the new `Dockerfile` instead, the image runs the same `pnpm start` on Railway's `PORT`.

### 1. Back up the Railway database now (you, on macOS)

Do this **before** anyone regenerates the Railway Postgres password. The Railway DB (`postgres-ssl:18`, about 215 MB) has a public TCP proxy, so `pg_dump` works even with Railway's dashboard partly down.

`pg_dump` must be version 18 or newer to dump a Postgres 18 server:

```sh
brew install libpq                      # or: brew install postgresql@18
export PATH="$(brew --prefix libpq)/bin:$PATH"   # or $(brew --prefix postgresql@18)/bin
pg_dump --version                       # must print 18.x or newer
```

Copy `DATABASE_PUBLIC_URL` from Railway (Postgres service → Variables). Read it without echoing, so it stays out of shell history and files:

```sh
read -rs RAILWAY_DATABASE_PUBLIC_URL && export RAILWAY_DATABASE_PUBLIC_URL
DUMP="trading-cards-$(date +%Y%m%d-%H%M).pgdump"
PGCONNECT_TIMEOUT=20 pg_dump --no-owner --no-acl -Fc "$RAILWAY_DATABASE_PUBLIC_URL" -f "$DUMP"
ls -lh "$DUMP"                                  # must not be 0 bytes
pg_restore --list "$DUMP" | grep 'TABLE DATA'   # expect sets, cards, user_cards
```

macOS has no `timeout` command, so don't wrap the dump in it. `PGCONNECT_TIMEOUT` caps the connect wait instead.

If the public URL stops working (for example, Railway rotates credentials or removes the proxy), the export has to wait until Railway's dashboard or CLI is back. Then do one of these:

- Re-enable the proxy (Railway → Postgres service → Settings → Networking → TCP Proxy) and rerun the command above.
- Run `railway ssh` into the Postgres service and pipe the dump straight into Render, after step 3 has created the Render database:

  ```sh
  pg_dump --no-owner --no-acl -Fc "$DATABASE_URL" \
    | pg_restore --clean --if-exists --no-owner --no-acl -d '<Render External Database URL>'
  ```

If neither comes back, start fresh: the first Render deploy creates an empty schema, and you re-import checklists from Beckett on `/import`.

### 2. Mint new secrets (you)

- `AI_KEY`: Vercel dashboard → AI Gateway → API Keys → Create key. Railway's variables don't include `AI_KEY`, so there's no old Gateway key to revoke.
- Clerk (optional): only if you want sign-in on Render. Railway never had Clerk keys, so none leaked.

This app has no session or encryption keys of its own, so rotating secrets doesn't sign anyone out or orphan any data.

### 3. Create the Blueprint (you)

1. Render Dashboard → **New** → **Blueprint** → pick `birdwell/trading-cards`, branch `main`.
2. When prompted, paste the new `AI_KEY`.
3. Apply. Render creates `trading-cards-db` and `trading-cards`. The first deploy runs `drizzle-kit push`, which creates empty `sets`, `cards` and `user_cards` tables.

### 4. Restore the data into Render (you)

Copy the **External Database URL** from Render (trading-cards-db → Connect → External):

```sh
read -rs RENDER_EXTERNAL_DATABASE_URL && export RENDER_EXTERNAL_DATABASE_URL
pg_restore --clean --if-exists --no-owner --no-acl -d "$RENDER_EXTERNAL_DATABASE_URL" "$DUMP"
# new shell? set DUMP=trading-cards-YYYYMMDD-HHMM.pgdump first
```

`--clean --if-exists` replaces the empty tables from the first deploy, including sequence positions. Running `drizzle-kit push` afterwards reports no changes. Before cutover, only the health check reaches the service, and it doesn't touch Postgres, so the restore doesn't compete with app traffic.

Check the result:

```sh
psql "$RENDER_EXTERNAL_DATABASE_URL" -c 'select count(*) from sets' -c 'select count(*) from cards' -c 'select count(*) from user_cards'
psql "$RAILWAY_DATABASE_PUBLIC_URL"  -c 'select count(*) from sets' -c 'select count(*) from cards' -c 'select count(*) from user_cards'
psql "$RENDER_EXTERNAL_DATABASE_URL" -c '\dx' -c '\dt' -c '\df'
psql "$RAILWAY_DATABASE_PUBLIC_URL"  -c '\du'
```

The counts should match. Following Railway's guidance, look for anything unexpected:

- On Render, `\dx` should list only `plpgsql`, `\dt` only `sets`, `cards` and `user_cards`, and `\df` no functions. The dump carries extensions, tables and functions, so anything an attacker added on Railway would show up here.
- On Railway, `\du` should list only `postgres` and roles you created yourself. A dump never carries roles, so extra roles won't follow you, but they mean the Railway DB was tampered with.

If anything appears that you didn't create, stop and investigate before cutover.

Railway keeps taking writes until DNS moves. Right before step 6, take a fresh dump (step 1) and restore it again (this step), or accept losing changes made after the first dump.

### 5. Verify on `onrender.com` (you)

Use the `*.onrender.com` URL shown on the `trading-cards` service:

- `https://<service>.onrender.com/healthz` returns `ok`.
- The homepage lists the restored sets. Open a set and a brand page.
- `/import`: import one Beckett checklist URL. This exercises Chromium and `AI_KEY`.

### 6. DNS cutover for `cards.birdwell.ai` (you)

1. Render → trading-cards → Settings → Custom Domains shows `cards.birdwell.ai` (added by the Blueprint) and the exact DNS record to create. For a subdomain this is normally a `CNAME` to the service's `onrender.com` host.
2. At the DNS provider for `birdwell.ai`, replace the record that points at Railway with the one Render shows. If the zone is on Cloudflare, use DNS only (grey cloud) until Render shows the domain as verified and the certificate as issued.
3. Wait for Render to show the domain as verified with a certificate, then load <https://cards.birdwell.ai>.

`sportscards.up.railway.app` stops working when the Railway project is deleted. Nothing in the code depends on it.

### 7. Revoke old credentials (you)

- Google AI Studio: delete the `GOOGLE_GENERATIVE_AI_API_KEY` key, if you didn't already at the top.
- The Railway Postgres password and `DATABASE_PUBLIC_URL` die with the Railway project in step 8. Until then, treat them as exposed.

### 8. Decommission Railway (you plus one small PR)

1. Keep the final `.pgdump` somewhere safe.
2. Open a PR that deletes the Railway-only files kept for the transition: `railway.json`, `railway-backend.json`, `Procfile`, `Procfile-backend`.
3. Railway → project → Settings → Danger → Delete project.

## Local development

```sh
pnpm install
cp .env.example .env    # set DATABASE_URL to a local Postgres or the Render External Database URL
pnpm run db:setup       # drizzle-kit push
pnpm run dev            # tRPC on 3002, Next.js on 3000
```

To test the production image locally:

```sh
docker build -t trading-cards .
docker run --rm -p 10000:10000 -e PORT=10000 -e BACKEND_PORT=3002 \
  -e DATABASE_URL=postgresql://... trading-cards
```

## Troubleshooting

- **500s or empty homepage:** check `DATABASE_URL` points at Postgres. A SQLite `file:` URL makes the app refuse to start.
- **Import fails at "finding checklist":** Beckett is behind Cloudflare, and a local test of this image got a Cloudflare challenge page (HTTP 403). If Render's IPs get the same, the scraper finds no checklist. That's a scraping problem, not a deploy problem.
- **Import fails at "extracting":** `AI_KEY` is missing or invalid, or `GEMINI_MODEL` names a model the Gateway doesn't serve.
- **Sign-in missing:** Clerk keys aren't set. Add both and redeploy.
