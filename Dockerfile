# syntax=docker/dockerfile:1

# glibc 기반(node:22-slim) — next/image 최적화에 쓰이는 sharp 네이티브 바이너리가
# alpine(musl)보다 안정적으로 동작한다. deps/builder/runner 모두 동일 베이스 사용.
FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# pnpm 11의 실행 전 의존성 검사(verify-deps-before-run)가 컨테이너에서
# 불필요하게 `pnpm install` 을 재실행하다 실패하는 것을 방지
ENV PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN=false
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# ---- Build ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# ---- Runner ----
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=10060
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 10060
# pnpm 을 거치지 않고 next 바이너리를 직접 실행 (pnpm 의 pre-run 검사 회피)
CMD ["node_modules/.bin/next", "start"]
