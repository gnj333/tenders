# Architecture

> **AI Agent contract.** Before generating any code, read every file in
> `project-ai/`. Follow rules literally. Do not invent layers, do not bypass
> boundaries, do not reorganize folders without explicit user approval.

## Goals (in priority order)

1. SEO
2. Performance
3. Scalability
4. Maintainability
5. Clean architecture
6. Production readiness

## Stack

- Next.js 15+ (App Router, Turbopack)
- React 19 (Server Components by default)
- TypeScript (strict)
- Tailwind v4 + shadcn/ui
- Zustand — UI/client state only
- TanStack Query — server state only
- Zod — schema validation
- React Hook Form — forms
- next-themes — theme management (single allowed exception in state rules)

## Layered structure

```
src/
├── app/                   # routing only (layouts, pages, route handlers, metadata)
├── components/
│   ├── ui/                # dumb primitives (buttons, inputs, dialogs)
│   ├── layout/            # navbar, header, footer, page shells
│   └── shared/            # cross-feature shared composable components
├── features/              # business features (filters, auth forms, search wizard)
├── entities/              # domain entities (tender, user, company)
└── shared/
    ├── api/               # typed HTTP layer (fetchers, clients)
    ├── query/             # TanStack Query infra (keys, mutations, invalidation)
    ├── store/             # Zustand stores
    ├── hooks/             # reusable hooks
    ├── lib/               # tiny helpers (cn, formatters, type guards)
    ├── seo/               # metadata + JSON-LD helpers
    ├── config/            # site config, env, runtime constants
    └── types/             # global TS types
```

## Layer responsibilities

### `app/`

- Routing, layouts, error/loading boundaries, route handlers (`route.ts`).
- `generateMetadata`, `sitemap.ts`, `robots.ts`, `manifest.ts`.
- **NO business logic.** Pages are thin orchestrators: parse params,
  call `entities/` or `features/` server functions, return JSX.

### `components/ui/`

- Reusable presentational primitives. Pure UI.
- Cannot import from `features/`, `entities/`, `shared/store`, `shared/api`,
  `shared/query`.
- May import from `shared/lib`, `shared/types`.

### `components/layout/`

- App-wide shells: header, footer, sidebar, page shells.
- May import from `components/ui`, `entities/`, `shared/lib`, `shared/config`.
- May contain client components for navigation interactivity.

### `components/shared/`

- Cross-feature composable components without strong domain identity
  (e.g., `EmptyState`, `PageHeading`, `Section`).

### `features/`

- A feature = a use case slice (auth, tender-filters, search-bar).
- One folder per feature: `features/<feature-name>/{ui, api, hooks, model, lib}`.
- May import from `entities/`, `shared/*`, `components/ui`.
- **Cannot import another feature.** Two features share via `entities/` or
  `shared/*`.

### `entities/`

- Domain entities and their reusable presentation.
- Structure: `entities/<entity>/{ui, api, model, lib, types}`.
- Owns: types, schemas (Zod), query keys, server fetchers, base UI cards.
- May import from `shared/*`. **Cannot import `features/` or `components`.**

### `shared/`

- Reusable infra and primitives.
- `api/` — typed HTTP client and base fetchers (Server Component friendly).
- `query/` — `QueryClient` factory, `Hydration` boundaries, key factories.
- `store/` — Zustand stores for UI/client state only.
- `hooks/` — reusable hooks (no domain knowledge).
- `lib/` — pure utilities, formatters, type helpers.
- `seo/` — `buildMetadata`, JSON-LD builders, sitemap helpers.
- `config/` — `siteConfig`, env parsing, runtime constants.
- `types/` — global types.

## Dependency rule

Allowed dependency direction (top → bottom only):

```
app → features → entities → shared
app → components → entities → shared
features → components/ui
features ↛ features        (forbidden)
entities ↛ features        (forbidden)
shared ↛ everything else   (shared is leaf)
```

If two features need the same logic — promote it to `entities/` or `shared/`.

## Server / Client split

- **Default = Server Component.** No `'use client'` unless required.
- A client component is required for: forms, modals, dropdowns, charts,
  drag/drop, animations, browser APIs, Zustand hooks, TanStack Query hooks,
  event handlers.
- Server Components do data fetching (via `entities/<x>/api`), pass data as
  props to client components.
- Hydration boundaries: prefer `<HydrationBoundary>` (TanStack Query) over
  re-fetching on the client.

## SEO is non-negotiable

See `seo-rules.md`. Every publicly indexable route must:

- have a Server Component page
- export `metadata` or `generateMetadata`
- emit semantic HTML and a single `<h1>`
- be included in `sitemap.ts`

## Anti-patterns (will be rejected)

- `'use client'` at the top of a page when it could be server-rendered
- Storing API data in Zustand
- Storing UI state in TanStack Query
- Cross-feature imports
- Importing from `shared/store` inside Server Components
- `any`, ignored TS errors
- Inline business logic in `page.tsx`
- Default-exporting components that aren't pages/layouts
- Duplicating `siteConfig`, URLs, or query keys
- Ad-hoc folder creation outside the documented structure
