# Agent contract

> This file is auto-loaded by AI agents (opencode, Claude Code, Cursor,
> Codex) at the start of every session. Read it. Then read every file in
> `project-ai/`. Then start working.

## Mandatory reading order

Before generating, editing, or refactoring any code, the agent MUST read:

1. `project-ai/architecture.md` — layers and dependency rules
2. `project-ai/folder-structure.md` — where things live
3. `project-ai/state-management.md` — Zustand vs TanStack Query boundary
4. `project-ai/nextjs-rules.md` — App Router rules
5. `project-ai/seo-rules.md` — SEO is the #1 priority
6. `project-ai/frontend-rules.md` — TypeScript, naming, a11y
7. `project-ai/ui-rules.md` — tokens, components, animation
8. `project-ai/coding-standards.md` — tooling, errors, security

If any answer is not explicit in these docs, **ask the user before
guessing**. Do not invent rules.

## Tech stack (do not change without approval)

- Next.js 15 (App Router, Turbopack)
- React 19
- TypeScript (strict)
- Tailwind v4 + shadcn/ui (style: new-york)
- TanStack Query — server state
- Zustand — UI/client state
- next-themes — theme (documented exception)
- Zod — schema validation
- React Hook Form — forms

## Hard rules (most important)

1. **SEO is #1.** Every public route must be a Server Component, export
   metadata, render semantic HTML, include exactly one `<h1>`, be in the
   sitemap. See `project-ai/seo-rules.md`.
2. **Server Components by default.** Add `'use client'` only when truly
   required (forms, modals, browser APIs, hooks like `useQuery`/Zustand).
3. **State boundary:** server data → TanStack Query; UI state → Zustand.
   Never the other way around.
4. **Folder structure is fixed.** No new top-level folders inside `src/`
   beyond: `app`, `components`, `features`, `entities`, `shared`.
5. **Imports:** absolute `@/*` only. No `../../../`.
6. **Public API of slices** (`entities/*`, `features/*`) — only via the
   slice's `index.ts`.
7. **No `any`, no `@ts-ignore`, no `console.log` in committed code.**
8. **Forbidden:** cross-feature imports, storing API data in Zustand,
   `'use client'` on `page.tsx`/`layout.tsx` of indexable routes,
   hardcoded URLs and hex colors (use `siteConfig` and CSS tokens).

## Quick commands

```bash
npm run dev        # Turbopack dev server
npm run build      # production build
npm run check      # typecheck + lint + format check (must pass before commit)
npm run lint:fix   # auto-fix lint issues
npm run format     # prettier write
```

## When you finish a change

- Run `npm run check`. If it fails, fix before declaring success.
- Run `npm run build` when changes touch routing, metadata, or types.
- Update `project-ai/*.md` if a rule changed.

## When in doubt

Ask. Do not silently deviate from these rules.
