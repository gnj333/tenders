# State Management

Two systems, strict boundary. Mixing them is forbidden.

## Server state → TanStack Query

Use Query for anything fetched from the server.

Allowed for:

- API responses (tenders, users, companies, notifications, analytics)
- pagination, infinite scroll
- mutations
- optimistic updates
- cache invalidation
- background refetching
- prefetch + hydration from Server Components

Setup lives in `src/shared/query/`:

- `client.ts` — `makeQueryClient()` factory (one per request on server, one
  per browser tab on client).
- `provider.tsx` — `<QueryProvider>` client component, used in root layout.
- `keys.ts` — base key namespaces (entities own their leaf keys).

Per-entity query layer lives in `src/entities/<entity>/api/`:

```ts
// src/entities/tender/api/tender.keys.ts
export const tenderKeys = {
  all: ['tender'] as const,
  lists: () => [...tenderKeys.all, 'list'] as const,
  list: (params: TenderListParams) => [...tenderKeys.lists(), params] as const,
  details: () => [...tenderKeys.all, 'detail'] as const,
  detail: (id: string) => [...tenderKeys.details(), id] as const,
};
```

```ts
// src/entities/tender/api/use-tenders.ts  (client hook)
'use client';

import { useQuery } from '@tanstack/react-query';

import { fetchTenders } from './tender.fetchers';
import { tenderKeys } from './tender.keys';

export function useTendersQuery(params: TenderListParams) {
  return useQuery({
    queryKey: tenderKeys.list(params),
    queryFn: () => fetchTenders(params),
  });
}
```

Server fetcher is **not** a hook:

```ts
// src/entities/tender/api/tender.fetchers.ts
import 'server-only';

export async function getTenders(params: TenderListParams): Promise<Tender[]> {
  const url = `${apiBase}/tenders?${qs.stringify(params)}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new ApiError(res);
  return TenderSchema.array().parse(await res.json());
}
```

SSR pattern with hydration:

```tsx
// page.tsx
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { makeQueryClient } from '@/shared/query/client';
import { tenderKeys } from '@/entities/tender/api/tender.keys';
import { getTenders } from '@/entities/tender/api/tender.fetchers';

export default async function TendersPage() {
  const qc = makeQueryClient();
  await qc.prefetchQuery({
    queryKey: tenderKeys.list({}),
    queryFn: () => getTenders({}),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <TendersListClient />
    </HydrationBoundary>
  );
}
```

## Client/UI state → Zustand

Use Zustand only for ephemeral client state.

Allowed for:

- modal/dialog open state
- sidebar collapsed / drawer open
- filters UI (pre-submit)
- selected rows in a table
- wizard step
- local preferences (compact density, etc.)

Forbidden:

- caching API responses
- mutating server data
- loading/error flags that belong to a Query
- anything that needs SSR

Setup lives in `src/shared/store/`:

- One file per store: `<scope>.store.ts`.
- Each store is a single hook: `export const useXStore = create<X>(...)`.
- Persist only if needed: `persist(..., { name, storage })`.
- Use `subscribeWithSelector` only when you need fine-grained subs.

Example:

```ts
// src/shared/store/ui.store.ts
import { create } from 'zustand';

type UiState = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
```

Selectors must be narrow:

```ts
const sidebarOpen = useUiStore((s) => s.sidebarOpen);
```

Never `const state = useUiStore()` — it subscribes to everything.

## Theme

Theme is the documented exception: managed by `next-themes` because it solves
SSR-flash, `localStorage`, system theme listener, and `prefers-color-scheme`
out of the box. Do not reimplement it in Zustand.

## Forms

- React Hook Form with `@hookform/resolvers/zod`.
- Validation schema in `entities/<x>/model/<x>.schema.ts` or in the feature
  folder if the form is feature-specific.
- Always type the form: `useForm<z.infer<typeof Schema>>()`.

## Async server actions

For mutations triggered from the server (server actions or route handlers):

- Validate inputs with Zod before doing anything.
- Throw typed errors, do not return raw exceptions.
- Revalidate via `revalidateTag` / `revalidatePath` _and_ invalidate the
  corresponding TanStack Query key on the client (mutation `onSuccess`).
