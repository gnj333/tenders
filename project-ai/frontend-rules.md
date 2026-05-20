# Frontend Rules

## TypeScript

- `strict: true`, `noUncheckedIndexedAccess: true`.
- No `any`. Use `unknown` and narrow.
- Prefer `type` over `interface` for unions, props, public API.
  Use `interface` only when declaration merging is needed.
- Public types live next to the entity (`entities/<x>/types/`).
- Avoid type assertions (`as`). When required, comment why.
- All async functions have explicit return types when crossing a module
  boundary (`shared/api`, `entities/*/api`).

## Imports

Order (enforced by `simple-import-sort`):

1. `node:` builtins, `react`, `next`
2. External packages
3. `@/config`, `@/shared/lib`, `@/shared/hooks`, `@/shared/api`, `@/shared/query`, `@/shared/store`, `@/types`
4. `@/components`, `@/entities`, `@/features`
5. `@/app`
6. Relative imports
7. Side-effect imports / styles last

Always use absolute aliases (`@/...`) — never `../../../`.

## Naming

- Files: `kebab-case.ts(x)`. Exceptions: route files dictated by Next
  (`page.tsx`, `layout.tsx`, etc.).
- React components: `PascalCase`.
- Hooks: `useThing`.
- Stores: `useThingStore`.
- Query hooks: `useThingsQuery`, `useThingQuery`, `useCreateThingMutation`.
- Server fetchers: `getThing(s)`. Always `async`. Marked with
  `import 'server-only'` at the top of the file.
- Schemas: `<ThingName>Schema` (Pascal + `Schema`).
- Types: `Thing`, `ThingListParams`, `ThingDto`.
- Booleans: `is*`, `has*`, `should*`, `can*`.
- Event handlers: `handleSubmit`, `onClick` (the latter for props).

## Exports

- Named exports for components, hooks, stores, utilities.
- Default exports allowed only for: Next route files (`page`, `layout`,
  `error`, `loading`, `not-found`, `route`, `opengraph-image`, `sitemap`,
  `robots`, `manifest`).
- One component per file unless trivially related (`Card`, `CardHeader`).

## Component conventions

```tsx
type Props = {
  title: string;
  description?: string;
};

export function Section({ title, description, children }: React.PropsWithChildren<Props>) {
  return (
    <section className='py-8'>
      <h2 className='text-xl font-semibold'>{title}</h2>
      {description ? <p className='text-text-secondary'>{description}</p> : null}
      <div className='mt-4'>{children}</div>
    </section>
  );
}
```

Rules:

- Props type named `Props` (or `ThingProps` when re-exported).
- No `React.FC`. Type props explicitly.
- No prop drilling more than 2 levels. Lift to feature/entity state instead.
- Components stay small and presentational. Business logic goes to hooks /
  entity functions.

## Accessibility

- Semantic HTML first; `role=` only when no native element fits.
- Every interactive element must be reachable by keyboard.
- Form labels are mandatory (`<label htmlFor>` or `aria-label`).
- Focus must be visible (we keep Tailwind `focus-visible` rings).
- Images: meaningful `alt`. Decorative images: `alt=""`.
- Color contrast AA minimum.
- Modals: trap focus and restore on close (use shadcn primitives).
- Use `aria-live` for async updates announced to screen readers.

## Forms

- React Hook Form + Zod resolver:

```tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { TenderCreateSchema, type TenderCreateInput } from '@/entities/tender/model';

export function TenderCreateForm() {
  const form = useForm<TenderCreateInput>({
    resolver: zodResolver(TenderCreateSchema),
    defaultValues: { title: '', summary: '' },
  });
  // ...
}
```

- Single source of truth for shape and validation = Zod schema.
- Show inline errors next to the field, summarize only on submit.

## Errors

- Server: throw typed errors (`new ApiError(status, message, payload)`),
  let Next.js error boundary catch them.
- Client: `useQuery` and `useMutation` `error` is the source of truth.
  Render an error component, do not `console.error`.

## Styling

- Tailwind utility classes only. No CSS Modules unless absolutely needed.
- Reusable variants via `class-variance-authority` (`cva`).
- Compose classnames with `cn(...)` from `shared/lib/utils`.
- Design tokens in CSS variables in `globals.css`; never hardcode hex inside
  components.
- Mobile-first; use `sm: md: lg: xl:` to scale up.

## Performance

- Avoid unnecessary client components.
- Memoize only when profiling proves a problem.
- Code-split heavy client widgets with `next/dynamic({ ssr: false })`.
- Use `Image` with proper `sizes` for responsive images.

## Forbidden

- `any`, `// @ts-ignore`, `// @ts-nocheck`.
- `console.log` left in committed code (warn rule).
- Manual DOM manipulation outside `useRef`/Radix primitives.
- Mixing Tailwind and inline `style` for the same property.
- Inline event handlers in JSX that trigger heavy work without memo.
