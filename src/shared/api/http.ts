import { env } from '@/shared/config';

import { ApiError } from './api-error';

type FetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  /** Pass `next` options for Server Component caching. */
  next?: { revalidate?: number | false; tags?: string[] };
  /** Search params appended to the URL. */
  searchParams?: Record<string, string | number | boolean | undefined | null>;
};

function buildUrl(path: string, searchParams?: FetchOptions['searchParams']): string {
  const base = path.startsWith('http') ? path : `${env.NEXT_PUBLIC_API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  if (!searchParams) return base;

  const url = new URL(base);
  for (const [key, value] of Object.entries(searchParams)) {
    if (value === undefined || value === null) continue;
    url.searchParams.set(key, String(value));
  }

  return url.toString();
}

/**
 * Minimal typed HTTP client built on `fetch`.
 *
 * - Server-friendly: respects `next: { revalidate, tags }`.
 * - Throws `ApiError` on non-2xx responses.
 * - Parses JSON when the response Content-Type is JSON; otherwise returns `undefined`.
 */
export async function http<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { body, searchParams, headers, next, credentials, ...rest } = options;
  const url = buildUrl(path, searchParams);

  const init: RequestInit & { next?: FetchOptions['next'] } = {
    ...rest,
    // Always send session cookies. Same-origin requests already include them
    // by default, but being explicit makes the contract obvious and survives
    // a future move of the API to a different host (with proper CORS).
    credentials: credentials ?? 'include',
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    next,
  };

  const res = await fetch(url, init);

  if (!res.ok) {
    const payload = await safeJson(res);
    throw new ApiError({ status: res.status, url, payload });
  }

  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

async function safeJson(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return undefined;
  }
}
