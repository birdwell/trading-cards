# Production image for Render (render.yaml, runtime: docker).
#
# The import flow scrapes Beckett with Playwright Chromium at runtime
# (server/services/get-checklist-source.ts). Chromium needs system libraries
# that only a root `apt-get` can install, so we start from the official
# Playwright image, which ships them plus the browsers in /ms-playwright.
# Keep this tag in sync with the `playwright` version in pnpm-lock.yaml
# (currently 1.60.0) or Playwright won't find a matching browser build.
FROM mcr.microsoft.com/playwright:v1.60.0-noble

WORKDIR /app

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    NEXT_TELEMETRY_DISABLED=1

# pnpm version comes from "packageManager" in package.json.
RUN corepack enable

# Install dependencies first so this layer is cached between deploys.
# Dev dependencies are included on purpose: the build runs `tsc`, and the
# start script runs `drizzle-kit push` (a devDependency) before booting.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY client/package.json client/
RUN pnpm install --frozen-lockfile

COPY . .

# Next.js inlines NEXT_PUBLIC_* at build time. Render passes service env vars
# to `docker build` as build args, but only for args declared here.
ARG NEXT_PUBLIC_BACKEND_PORT=3002
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_API_URL
RUN pnpm run build

ENV NODE_ENV=production

# `pnpm start` syncs the schema (drizzle-kit push), then runs the tRPC server
# on BACKEND_PORT (3002, container-internal) and Next.js on Render's $PORT.
# Browsers only talk to Next.js; it proxies /trpc to localhost:3002.
CMD ["pnpm", "start"]
