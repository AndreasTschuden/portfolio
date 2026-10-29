# Production image (Next.js standalone output). Used by deploy/docker-compose.yml.

FROM node:24.22.2-alpine AS base
RUN apk add --no-cache libc6-compat && corepack enable && corepack prepare pnpm@10.26.0 --activate
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Inlined into the build (OG/Twitter meta tags)
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
RUN pnpm run build

# One-off content seeding (full source + dev dependencies): docker compose run --rm seed
FROM builder AS seed
CMD ["pnpm", "seed"]

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
