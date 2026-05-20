# SEO Rules

> SEO is the #1 priority. Any code change that hurts crawlability, TTFB, or
> Core Web Vitals must be rejected.

## Hard requirements

Every indexable route MUST:

- be a **Server Component** (no top-level `'use client'`)
- export `metadata` (static) or `generateMetadata` (dynamic) from `page.tsx`
- output semantic HTML: exactly **one `<h1>`**, correct heading order
- have a unique `<title>` and `<meta name="description">`
- have a canonical URL via `metadata.alternates.canonical`
- expose Open Graph and Twitter metadata
- be discoverable from `app/sitemap.ts`
- emit structured data (JSON-LD) where applicable

## Metadata API

Use Next.js Metadata API. Compose with the helper in
`shared/lib/seo/metadata.ts`:

```ts
// src/app/tenders/[id]/page.tsx
import type { Metadata } from 'next';

import { buildMetadata } from '@shared/lib/seo';
import { getTenderById } from '@entities/tender/api';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const tender = await getTenderById(id);

  return buildMetadata({
    title: tender.title,
    description: tender.summary,
    path: `/tenders/${id}`,
    image: tender.coverImage,
    type: 'article',
  });
}
```

## metadataBase

Always set `metadata.metadataBase` in the root layout using `siteConfig.url`.
Without it, OG image URLs become relative and break crawlers.

## Canonical URLs

- Always set `alternates.canonical: <absolute-url>` via `buildMetadata`.
- For paginated pages, canonical must point to page 1 unless deeper pages
  carry unique content.
- Never put tracking query params into canonicals.

## Sitemap

- Implemented in `src/app/sitemap.ts` as a server function returning a
  `MetadataRoute.Sitemap`.
- Static routes are listed explicitly.
- Dynamic routes (tenders, companies, etc.) are sourced from
  `entities/<x>/api` server functions, never from a client.

## robots.txt

- Implemented in `src/app/robots.ts`.
- Production: `Allow: /`. Block `/api/`, `/admin/`, `/dashboard/`.
- Set `sitemap: <siteConfig.url>/sitemap.xml`.

## Structured data (JSON-LD)

- Build via helpers in `shared/lib/seo/jsonLd.ts`.
- Render in the page via `<script type="application/ld+json">` (Server
  Component, no client JS).
- Use schemas appropriate to the page: `Organization`, `WebSite`, `Article`,
  `BreadcrumbList`, `Product`, `JobPosting`.

## Headings

- Exactly one `<h1>` per page, matching the entity name or page intent.
- `<h2>`/`<h3>`/etc must follow nesting; do not skip levels for styling.
- Use semantic tags: `<article>`, `<section>`, `<nav>`, `<main>`, `<aside>`,
  `<header>`, `<footer>`. `<div>` is the last resort.

## Images

- Use `next/image` for any content image.
- Always supply `width`, `height`, and meaningful `alt`.
- Above-the-fold: `priority`.
- Below-the-fold: default lazy loading.
- For LCP image, prefer `fetchPriority="high"` via `next/image` `priority`.

## Performance budgets

- TTFB target: under 200ms on a warm cache.
- LCP target: under 2.5s on 4G.
- CLS target: under 0.1.
- INP target: under 200ms.
- JS shipped per route: keep first-load JS under 150 kB gzipped.
  Use Server Components, dynamic import, and `'use client'` only where
  necessary.

## What hurts SEO (forbidden patterns)

- `'use client'` on `page.tsx` or `layout.tsx` of an indexable route.
- Fetching SEO-critical content via `useQuery` on the client.
- Empty `<h1>`, multiple `<h1>`s, or no `<h1>`.
- Missing `metadata`/`generateMetadata`.
- Returning `noindex` by accident (`robots: { index: false }`) in production.
- Putting indexable content inside an effect, modal, or accordion that
  doesn't render to HTML.
- Hash-based pseudo-routes (`/#about`).
- Blocking the main thread with hydration of huge client trees.
- Images without dimensions (CLS).
- Render-blocking third-party scripts in `<head>`.

## Mobile-first

- Tailwind classes are mobile-first.
- Layouts must be functional below 360px width.
- Tap targets minimum 44×44 px.
- Use `viewport` from `next/headers` only on the server; do not branch SSR by
  user-agent.

## Localization (placeholder)

If i18n is added later: use `metadata.alternates.languages` and `hreflang`,
and split sitemaps per locale.
