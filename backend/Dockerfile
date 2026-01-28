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

# Create non-root user for security
RUN addgroup --system --gid 1001 bun
RUN adduser --system --uid 1001 elysia

# Copy dependencies and source
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set ownership
RUN chown -R elysia:bun /app

USER elysia

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

CMD ["bun", "run", "src/index.ts"]
