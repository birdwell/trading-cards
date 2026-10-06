# Deployment Guide

## Railway Deployment (Recommended)

This is a full-stack app: a Next.js client and a tRPC server run together in one Railway service. The database is **Postgres**, not SQLite.

### Prerequisites
1. GitHub account with your code pushed to a repository
2. Railway account (sign up at [railway.app](https://railway.app))

### Step 1: Deploy the application
1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project" → "Deploy from GitHub repo"
3. Select this repository
4. Add a **Postgres** plugin to the same project
5. Set these environment variables on the app service:

   ```
   NODE_ENV=production
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   BACKEND_PORT=3002
   NEXT_PUBLIC_BACKEND_PORT=3002
   ```

6. **Do not** set `DATABASE_URL` to `file:./database.db`. The app now uses Drizzle + `pg` and will refuse to start with a SQLite URL.
7. **Do not** set `PORT` yourself. Railway assigns it and Next.js listens on that port. The tRPC server listens on `BACKEND_PORT` (3002) inside the same container.
8. Optional, for sign-in and per-user card ownership:

   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
   CLERK_SECRET_KEY=sk_live_...
   ```

   Create those keys at [https://dashboard.clerk.com](https://dashboard.clerk.com). After adding `NEXT_PUBLIC_*` values, **redeploy** so Next.js can inline them at build time.

9. Optional import support:

   ```
   GOOGLE_GENERATIVE_AI_API_KEY=...
   GEMINI_MODEL=gemini-2.5-flash
   ```

### Step 2: How it starts
- Railway runs `npm run build` (Next.js client + TypeScript check) and installs Playwright Chromium
- Railway runs `npm start`, which:
  1. Syncs the Postgres schema (`drizzle-kit push`)
  2. Starts the tRPC server on port 3002
  3. Starts Next.js on Railway's `PORT`
- Browser API calls go to `/trpc` on the same host; Next.js proxies them to `localhost:3002`

The homepage still renders if Clerk keys are missing or the first tRPC preload fails. Sign-in and ownership toggles stay disabled until Clerk is configured. Collection data requires a working `DATABASE_URL`.

### Step 3: What Josh needs to check in Railway if the site 500s
1. **Postgres is attached** and `DATABASE_URL` is the Postgres URL from that plugin (not a leftover SQLite `file:` value).
2. **Redeploy** after changing env vars, especially `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.
3. Confirm the start command is `npm start` / `npm run start` (see `Procfile` and `package.json`).
4. Clerk keys are optional for browsing. They are required for Sign in and marking cards owned.

## Alternative: Render Deployment

### Step 1: Create Render Services
1. **Backend Service**:
   - Build Command: `npm run build`
   - Start Command: `npm run server`
   - Environment: Node.js

2. **Frontend Service**:
   - Build Command: `cd client && npm run build`
   - Start Command: `cd client && npm run start`
   - Environment: Node.js

### Step 2: Database
- Provision Postgres
- Set `DATABASE_URL` to the Postgres connection string

## Environment Variables

### Required in production
```
NODE_ENV=production
DATABASE_URL=postgresql://...
BACKEND_PORT=3002
NEXT_PUBLIC_BACKEND_PORT=3002
```

### Optional
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
NEXT_PUBLIC_API_URL=
```
