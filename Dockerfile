# Dwello Frontend Dockerfile
# Multi-stage build for SvelteKit application

# ============================================
# Stage 1: Dependencies
# ============================================
# The build runs on the runner's own platform: its output is JavaScript and the runtime dependencies have no native
# code; under QEMU for arm64 Paraglide failed (#945). Only the stage «runner» is made for each target platform
FROM --platform=$BUILDPLATFORM oven/bun:1-alpine AS bun

FROM --platform=$BUILDPLATFORM node:26-alpine AS deps

# Bun is the package manager; Node stays the runtime
COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies; --ignore-scripts skips "prepare" (Paraglide), which needs the sources and runs in vite build
RUN bun install --frozen-lockfile --ignore-scripts

# Runtime dependencies only: adapter-node bundles the devDependencies into build/
FROM deps AS prod-deps
RUN rm -rf node_modules && bun install --frozen-lockfile --production --ignore-scripts

# ============================================
# Stage 2: Build
# ============================================
FROM --platform=$BUILDPLATFORM node:26-alpine AS builder

COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application; APP_VERSION is `git describe --tags` of the checkout (.git is not in the context), shown in the footer
ARG APP_VERSION=
ENV NODE_ENV=production
RUN bun run build

# ============================================
# Stage 3: Production Runtime
# ============================================
FROM node:26-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
# Uploaded documents of up to 10 MB plus the form around them (adapter-node refuses more than 512 KB by default)
ENV BODY_SIZE_LIMIT=11M

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 sveltekit

# Copy built application (--chown: a later chown -R would copy node_modules into another layer)
COPY --from=builder --chown=sveltekit:nodejs /app/build ./build
COPY --from=builder --chown=sveltekit:nodejs /app/package.json ./package.json
COPY --from=prod-deps --chown=sveltekit:nodejs /app/node_modules ./node_modules

USER sveltekit

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/health || exit 1

CMD ["node", "build"]
