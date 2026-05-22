import type { ReactNode } from 'react';

/**
 * Shared shell for the auth section.
 *
 * Server Component: just a presentational wrapper, no client logic. Each
 * `/login` and `/register` `page.tsx` is also a Server Component and owns
 * its own `metadata` and `<h1>` — this layout intentionally does NOT render
 * a page-level heading.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <section className='mx-auto flex w-full max-w-md flex-col items-stretch gap-8 px-4 py-12 sm:py-16'>{children}</section>;
}
