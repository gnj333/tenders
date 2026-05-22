/**
 * Constants shared between route handlers and edge middleware.
 *
 * IMPORTANT: this file must NOT use `import 'server-only'` because it is
 * imported from `src/middleware.ts`, which runs on the Edge runtime.
 */
export const SESSION_COOKIE = 'session';
