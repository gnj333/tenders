# Next.js App Router Rules

## Always

- App Router only. No Pages Router files (`pages/*`).
- Server Components by default.
- Use Turbopack for dev (`next dev --turbopack`).
- `typedRoutes: true` is enabled; use typed `Link` and `redirect`.
- Co-locate route assets: `page.tsx`, `layout.tsx`, `loading.tsx`,
  `error.tsx`, `not-found.tsx`, `route.ts`, `opengraph-image.tsx`,
  `sitemap.ts`.

## Files in `app/`

| File                  | Purpose                                              |
| --------------------- | ---------------------------------------------------- |
| `layout.tsx`          | Shared shell. Wraps children. Persistent across nav. |
| `page.tsx`            | A route segment.                                     |
| `loading.tsx`         | Streaming UI for the route below; uses Suspense.     |
| `error.tsx`           | Client error boundary for the segment.               |
| `not-found.tsx`       | 404 boundary.                                        |
| `route.ts`            | Route handler (REST endpoint).                       |
| `opengraph-image.tsx` | Generated OG image (Edge runtime).                   |
| `sitemap.ts`          | Sitemap entries.                                     |
| `robots.ts`           | robots.txt.                                          |
| `manifest.ts`         | Web manifest.                                        |

## Server Components rules

- `page.tsx` and `layout.tsx` are Server Components unless impossible.
- Data fetching with `fetch(url, { next: { revalidate | tags } })` or with
  entity server functions wrapped in `import 'server-only'`.
- No `useState`, `useEffect`, browser globals.
- Never import `shared/store` (Zustand) from a Server Component.
- Pass plain serializable props to client components.

## Client Components rules

- File starts with `'use client'` on the first line.
- Mark them at the lowest possible boundary: leaves, not pages.
- Co-locate near where they are used unless reused — then promote to
  `components/ui` or `components/shared`.
- Avoid bringing whole entities to the client. Prefer prop drilling of
  already-fetched data from the parent Server Component.

## Data fetching priority

1. Server Component `fetch` with revalidate/tags.
2. Server Component → entity server function (`getX`).
3. `prefetchQuery` + `HydrationBoundary` for interactive lists/detail pages.
4. Client `useQuery` only when the data is user-specific, real-time, or
   triggered by interaction.

## Caching

- Use `revalidate` for time-based caches.
- Use `tags` + `revalidateTag` for event-based invalidation.
- Avoid `cache: 'no-store'` unless the data is truly per-request and not
  cacheable.

## Route handlers

- Place under `src/app/api/<segment>/route.ts`.
- Validate inputs with Zod.
- Return `NextResponse.json` with explicit status codes.
- Never embed business logic; delegate to `entities/<x>/api`.
- Block them from indexing via `robots.ts`.

## Loading / Streaming

- Add `loading.tsx` to any route that does meaningful server work.
- Stream large lists with `<Suspense>` boundaries inside the page.
- Skeleton UI lives in the same folder, named `skeleton.tsx`.

## Errors

- `error.tsx` is a client component with a reset handler.
- Show a recoverable UI, log to monitoring, do not leak internals.

## Linking and navigation

- Use `next/link` with typed `href`.
- `useRouter` is client-only.
- For server-side redirect use `redirect()` from `next/navigation`.
- For setting headers/cookies use `next/headers`.

## Images

- `next/image` always for raster content.
- Set `sizes` correctly; LCP image gets `priority`.
- SVG: inline or `next/image` with `unoptimized`.

## Fonts

- `next/font` for everything. No `@import url(...)` for web fonts.

## Environment

- `process.env.*` only inside server code or validated via Zod in
  `shared/config/env.ts`.
- Variables exposed to client must start with `NEXT_PUBLIC_`.

## Headers and metadata

- Set headers/redirects in `next.config.ts` where possible.
- Metadata via the Metadata API (see `seo-rules.md`).

## Forbidden

- `'use client'` on root `layout.tsx`.
- Top-level `'use client'` on `page.tsx` of an SEO route.
- Storing server data in a Zustand store.
- Calling `useQuery` inside a Server Component (won't compile, but worth
  stating).
- Using `getServerSideProps`, `getStaticProps`, `_app`, `_document` —
  Pages Router only.
- Disabling React strict mode.
- Disabling `typedRoutes`.
- Disabling ESLint or TS errors.
