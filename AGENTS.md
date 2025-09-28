# Repository Guidelines

## Project Structure & Module Organization
- `src/app`: Next.js routes, layouts, and server actions; group new screens by feature folder.
- `src/components`, `src/hooks`, `src/lib`, `src/services`: shared UI, reusable logic, utilities, and external integrations—favor colocating feature-specific pieces under a single folder.
- `src/ai`: Genkit flows and tooling; keep new agents under descriptive subfolders and document prompts in `docs/`.
- `public/` stores static assets (images, fonts); update `components.json` when exposing new UI primitives.

## Build, Test, and Development Commands
- `pnpm install` ensures dependencies align with the lockfiles.
- `pnpm dev` runs the Next.js app on port 9002 with Turbopack.
- `pnpm genkit:dev` launches the Genkit playground against `src/ai/dev.ts`.
- `pnpm build` produces a production bundle; follow up with `pnpm start` to verify.
- `pnpm lint` and `pnpm typecheck` must pass before opening a PR.

## Coding Style & Naming Conventions
- TypeScript everywhere: prefer explicit return types on exported functions, and keep server/client boundaries obvious with `"use client"` markers.
- Components use PascalCase (`CardPreview.tsx`); hooks use `useCamelCase`; utility modules stay kebab-case.
- Adopt 2-space indentation, Tailwind utility-first styling, and group class names logically; rely on `clsx`/`cva` helpers for variants.

## Testing Guidelines
- Automated tests are not yet configured; document manual verification steps in your PR and flag risk areas.
- When adding test infrastructure, place component specs next to their source (`Component.test.tsx`) and favor React Testing Library with realistic user flows.

## Commit & Pull Request Guidelines
- Follow the existing Conventional Commit pattern (`refactor: ...`, `style: ...`); limit scope to one logical change.
- PRs need: concise summary, screenshots or recordings for UI updates, linked issue or context, and notes for QA (ports, feature flags, data seeds).
- Mention any Genkit or environment variable changes explicitly and provide safe defaults or migration steps.

## Configuration & Environment Notes
- Keep secrets in local `.env.*` files; never commit real credentials.
- Update `eco.config.js` and deployment scripts when build or port settings change; coordinate with PM2 users before altering runtime commands.
