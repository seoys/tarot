# Repository Guidelines

## Project Shape
- Single-package Next.js app router repo; there is no workspace/monorepo config.
- `src/app/page.tsx` is the main entrypoint and owns the `birth -> mbti -> tarot` funnel state.
- `src/app/login/page.tsx` is a separate route; do not assume it is part of the tarot flow.
- Shared shadcn-style primitives live in `src/components/ui`; keep `components.json` and `tailwind.config.ts` in sync when adding new primitives.
- Tarot behavior is split across `src/hooks/useTarotShuffle.ts`, `src/lib/tarot-data.ts`, and `src/services/tarot-card-analysis.ts`.
- `src/services/tarot-card-analysis.ts` calls the external n8n webhook directly; `src/ai/*` is Genkit playground code, not the production analysis path.

## Commands
- `pnpm dev` starts the app on port 9002.
- `pnpm genkit:dev` and `pnpm genkit:watch` run the Genkit playground from `src/ai/dev.ts`.
- `pnpm build`, `pnpm start`, `pnpm lint`, and `pnpm typecheck` are the core checks.
- `pnpm pm2:start` / `pnpm pm2:restart` are the production deploy path; PM2 is configured in `eco.config.js` for port 10060.
- `next.config.ts` disables type and lint failures during build, so run `pnpm lint` and `pnpm typecheck` manually before shipping.

## Editing Rules
- TypeScript + App Router throughout; add `"use client"` only when browser state or handlers require it.
- Keep event handlers named `handle*` and keep changes scoped to the touched feature.
- Prefer local edits over extracting new abstractions when working in the tarot flow; `src/app/page.tsx` is intentionally the orchestration point.
- Keep secrets in local `.env.*` files; `src/ai/ai-instance.ts` reads `GOOGLE_GENAI_API_KEY`.

## Verification
- There are no checked-in automated tests or CI workflows yet.
- For UI changes, document the manual flow you used in the PR.
- If you add tests, place them next to the source as `*.test.tsx`.

## Commits
- Use Conventional Commits; the existing history uses Korean commit messages.
