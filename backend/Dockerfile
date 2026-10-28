# Dwello Backend Dockerfile
# Uses Bun runtime for ElysiaJS backend

# ============================================
# Stage 1: Dependencies
# ============================================
FROM oven/bun:1 AS deps

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile

# ============================================
# Stage 2: Production Runtime
# ============================================
FROM oven/bun:1-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# pg_dump and pg_restore of the database's major version (postgres:16), for the Sicherung (#718); Debian has only 15
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl \
  && install -d /usr/share/postgresql-common/pgdg \
  && curl -fsSL -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc https://www.postgresql.org/media/keys/ACCC4CF8.asc \
  && . /etc/os-release \
  && echo "deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] https://apt.postgresql.org/pub/repos/apt $VERSION_CODENAME-pgdg main" > /etc/apt/sources.list.d/pgdg.list \
  && apt-get update && apt-get install -y --no-install-recommends postgresql-client-16 \
  && apt-get purge -y curl && rm -rf /var/lib/apt/lists/*

# Copy dependencies and source
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Run as the image's non-root user
RUN chown -R bun:bun /app

USER bun

EXPOSE 3001

# Health check (the slim image has neither wget nor curl)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD ["bun", "-e", "fetch('http://localhost:3001/health').then(r => process.exit(r.ok ? 0 : 1), () => process.exit(1))"]

# Apply missing migrations, then start the API
CMD ["sh", "-c", "bun scripts/migrate.ts && bun run src/index.ts"]
