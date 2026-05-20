# Coding Standards

## Tooling

- ESLint flat config (`eslint.config.mjs`) — enforced.
- Prettier with `prettier-plugin-tailwindcss`.
- Husky + lint-staged on commit.
- `npm run check` = typecheck + lint + format check. Must pass before PR.

## TypeScript

- `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`,
  `noFallthroughCasesInSwitch`.
- No `any`. Use `unknown` and narrow.
- Avoid non-null assertions (`!`). Prefer explicit guards.
- Prefer `as const` for tuples and key factories.
- Discriminated unions for state machines (`{ status: 'loading' } | { status: 'success'; data }`).
- Use `satisfies` for object literals when you want type inference + check.

## React / JSX

- Functional components only.
- Keep components under ~150 lines. Split when bigger.
- Hooks must be called unconditionally at the top.
- Effects: justify their existence. Most data flows belong to Query/Server.
- Stable keys in lists. Never use array index unless data is truly static.
- No `dangerouslySetInnerHTML` unless content is trusted/sanitized.

## Async

- Always `await` returned promises in server functions; don't pass them
  through implicitly.
- Use `Promise.all` for parallelizable independent calls.
- Use `cache(...)` from React for request-scoped memoization in server code.

## Errors

- Throw `ApiError` (typed) from `shared/api`.
- Server Components: throw — the nearest `error.tsx` will catch.
- Client: surface via Query/Mutation `error` state, render an error UI.

## Comments

- Comment **why**, not **what**.
- TODO comments must include an owner or ticket: `// TODO(name): ...`.
- Public functions in `shared/` and `entities/<x>/api/` get a JSDoc block.

## Git workflow

- One concern per commit.
- Conventional commits: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`,
  `test:`, `perf:`, `style:` (no functional change).
- Lint-staged runs `eslint --fix` and `prettier --write` on staged files.

## Tests (placeholder)

Testing is not configured yet. When added:

- Vitest + Testing Library for unit/integration.
- Playwright for e2e.
- Co-locate tests next to the unit: `thing.tsx` + `thing.test.tsx`.
- Mock the network at the HTTP layer (MSW), not at hook level.

## Performance hygiene

- Avoid unnecessary `useState` for derived data — derive instead.
- Avoid recreating functions/objects passed as props when downstream is
  memoized. Use `useCallback`/`useMemo` only when needed.
- Watch bundle size; `next build` reports per-route JS.

## Security

- Never trust client input — validate with Zod at the boundary.
- Sanitize HTML before injection.
- Use HTTP-only cookies for auth tokens.
- Never log secrets or PII.

## Imports & organization (recap)

- Absolute imports `@/*`.
- One module exports one concept (helper file = helpers only; component file
  = one component + close relatives).
- No re-exports across feature boundaries except via `index.ts`.

## Anti-patterns (forbidden)

- Top-level `'use client'` on `page.tsx` of indexable routes.
- Importing `shared/store` from Server Components.
- Storing fetched API data in Zustand.
- `console.log` in committed code.
- `any`, `@ts-ignore`, `@ts-nocheck`.
- Inline hex colors.
- Hardcoded URLs (use `siteConfig.url`).
- Hardcoded API base URL (use `shared/config/env.ts`).
- Duplicate query keys (entity owns them).
- New folders at the root of `src/` outside the documented map.
