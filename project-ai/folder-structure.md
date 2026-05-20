# Folder Structure

Source of truth. Do not introduce folders outside this map without changing
the docs first.

```
project-ai/                  # architectural docs (this folder)
public/                      # static assets served as-is
src/
├── app/                     # routes
│   ├── (marketing)/         # optional route groups (no URL segment)
│   ├── api/                 # route handlers
│   ├── tenders/
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── loading.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   ├── sitemap.ts
│   ├── robots.ts
│   └── globals.css
│
├── components/
│   ├── ui/                  # shadcn primitives (button, switch, dialog ...)
│   ├── layout/              # header, footer, sidebars, page shells
│   └── shared/              # cross-feature composables (Section, PageHeading, EmptyState)
│
├── features/
│   └── <feature-name>/
│       ├── ui/              # client/server components for the feature
│       ├── api/             # feature-specific query hooks / fetchers
│       ├── model/           # zod schemas, types, small reducers
│       ├── hooks/           # feature-only hooks
│       └── lib/             # feature-only helpers
│
├── entities/
│   └── <entity>/
│       ├── ui/              # entity-bound components (TenderCard, TenderMeta)
│       ├── api/             # server fetchers, query keys, query hooks
│       ├── model/           # types, schemas
│       └── lib/             # entity helpers
│
└── shared/
    ├── api/                 # http client, base fetcher, ApiError
    ├── query/               # TanStack Query setup (client, provider, namespaces)
    ├── store/               # zustand stores
    ├── hooks/               # generic hooks
    ├── lib/                 # tiny generic utilities (cn, formatters, type helpers)
    ├── seo/                 # metadata + JSON-LD helpers (own domain, not lib)
    ├── config/              # siteConfig, env
    └── types/               # global types
```

## File naming inside a folder

- `index.ts` — re-exports public API of the slice (optional, but
  required for `features/` and `entities/` public APIs).
- `<name>.tsx` — component.
- `<name>.ts` — pure module (utils, types, fetchers).
- `<name>.client.tsx` — client component when ambiguity matters
  (otherwise use `'use client'` directive at the top and skip the suffix).
- `<name>.schema.ts` — Zod schema.
- `<name>.types.ts` — TypeScript types.
- `<name>.fetchers.ts` — server fetchers (with `import 'server-only'`).
- `<name>.keys.ts` — Query key factory.
- `<name>.store.ts` — Zustand store.

## Public API of features / entities

Re-export only what is meant to be consumed.

For entities that ship both client-safe helpers (hooks, components, schemas)
and server-only modules (fetchers with `'server-only'`), expose **two**
public entry points:

```ts
// src/entities/tender/index.ts           — client-safe API
export { TenderCard } from './ui/tender-card';
export { useTendersQuery } from './api/use-tenders';
export { tenderKeys } from './api/tender.keys';
export { TenderSchema, type Tender } from './model/tender.schema';
```

```ts
// src/entities/tender/server.ts          — server-only API
export { getTenders, getTenderById } from './api/tender.fetchers';
```

Why two: barrel files (`index.ts`) are evaluated as a whole when imported.
If a client component imports any client-safe symbol from `@/entities/tender`,
the bundler still pulls in `tender.fetchers.ts`, which has
`import 'server-only'` and fails the build. Splitting the entry points makes
the boundary explicit and safe.

Consumers import explicitly:

```ts
// Client or server consumers
import { TenderCard, useTendersQuery } from '@/entities/tender';

// Server-only consumers (page.tsx, route handlers, sitemap.ts)
import { getTenders } from '@/entities/tender/server';
```

Internal files (`./api/tender.fetchers`, `./ui/tender-card`) are reachable but
should not be imported directly from outside the slice.

## Aliases (tsconfig paths)

```jsonc
{
  "paths": {
    "@/*": ["./src/*"],
  },
}
```

We use a single root alias `@/*`. Sub-aliases like `@entities/*` are
discouraged to avoid path duplication and broken refactors.

## Where new things go

| Need                                        | Folder                     |
| ------------------------------------------- | -------------------------- |
| Reusable button / input / dialog            | `components/ui/`           |
| Header, footer, app shell                   | `components/layout/`       |
| Empty-state block reused across features    | `components/shared/`       |
| "Tenders filter panel"                      | `features/tenders-filter/` |
| "TenderCard", "TenderMeta", `getTenders`    | `entities/tender/`         |
| `formatDate`, `cn`, `slugify`               | `shared/lib/`              |
| `buildMetadata`, JSON-LD, sitemap helpers   | `shared/seo/`              |
| `useMediaQuery`, `useDebounce`              | `shared/hooks/`            |
| `useUiStore`, `useFiltersStore`             | `shared/store/`            |
| HTTP client, `ApiError`                     | `shared/api/`              |
| `QueryClient`, `<QueryProvider>`, base keys | `shared/query/`            |
| `siteConfig`, env schema                    | `shared/config/`           |
| Global types (e.g., `Locale`, `Brand<>`)    | `shared/types/`            |
