# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server on port 9002 (Turbopack)
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit (TypeScript type check)
pnpm genkit:dev   # Launch Genkit AI playground against src/ai/dev.ts
```

**Note:** `next.config.ts` intentionally ignores TypeScript and ESLint errors during builds (`ignoreBuildErrors: true`, `ignoreDuringBuilds: true`). Always run `pnpm typecheck` and `pnpm lint` manually before PRs.

**Deployment:** PM2 via `eco.config.js` on port 10060. Use `pnpm pm2:start` / `pnpm pm2:restart` for production deploys.

## Architecture

### User Journey (3-step funnel)
The app routes users through three sequential steps managed by `FunnelStep` state in `src/app/page.tsx`:
1. **`birth`** — `BirthdateStep`: collects name, birthdate, birth time
2. **`mbti`** — `MbtiQuizStep`: short quiz that derives MBTI type
3. **`tarot`** — main tarot reading experience

`UserInfo` (from `src/types/user-journey.ts`) accumulates across steps and is passed to the analysis API.

### Card Analysis Flow
Cards are analyzed via an **n8n webhook** (not Genkit): `src/services/tarot-card-analysis.ts` POSTs `{ userInfo, question, TarotCardData }` to the external n8n endpoint. The Genkit setup in `src/ai/` exists but is not used in the current analysis flow.

### Shuffle Animation System
`src/hooks/useTarotShuffle.ts` drives card animations:
- Cards fan out in an arc when at rest
- Three named `ShuffleVariantId` sequences — `"burst"`, `"spiral"`, `"cascade"` — are picked randomly on each shuffle
- Each variant defines a multi-step `ShuffleSequence` with timed position transitions
- Card positions are `{ x, y, rotate, rotateX, rotateY, scale }` objects keyed by card name

### State Management
All state lives in `src/app/page.tsx` (no global store). Key state:
- `shuffledCards` — current deck order with `isReversed` flags set on shuffle
- `selectedCards` — array of card names (max 5)
- `cardInterpretations` — API response (`TarotCard`) rendered by `CardInterpretations`
- `step` / `userInfo` — funnel state passed down to step components

### Auth (unused stub)
`src/app/login/page.tsx` is a standalone login form with a `TODO` for real auth (Firebase/Supabase) — not wired into the funnel in `page.tsx` and not part of the current user journey.

### Key Data Files
- `src/lib/tarot-data.ts` — full 78-card deck definitions (`TarotCardDisplayData`), card image paths, `CARD_BACK_IMAGE`
- `src/lib/mbti-data.ts` — MBTI quiz questions (`MbtiQuestion[]`)

### Component Hierarchy (tarot step)
```
page.tsx
├── QuestionInput          — controlled textarea for the question
├── SelectedCardsSlots     — shows selected cards, allows deselecting
├── TarotDeck              — renders all cards with CSS transform animations
├── CardSelectionDialog    — confirmation modal before calling API
├── PreviewCardDialog      — shown immediately when a card is picked
└── CardInterpretations    — displays API results, handles restart
```

## Coding Conventions
- **Commit messages in Korean** using Conventional Commits: `feat:`, `fix:`, `refactor:`, `style:`, `chore:`, `docs:`, `perf:`, `test:`, `build:`
- TypeScript everywhere; mark client components with `"use client"`
- Tailwind utility-first; use `clsx`/`cva` for conditional classes
- Event handlers prefixed with `handle` (e.g., `handleCardClick`, `handleShuffle`)
- Composing functions appear before the functions they compose in file order
- Minimal code changes — only modify sections related to the task
