import { defaultShouldDehydrateQuery, isServer, QueryClient } from '@tanstack/react-query';

/**
 * Per request on the server, per tab on the client.
 *
 * Defaults are tuned for SSR:
 * - 60s `staleTime` to avoid immediate refetch after hydration.
 * - Pending queries are dehydrated to enable Server Action streaming.
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * Returns the QueryClient appropriate for the current environment.
 * Server: a fresh instance per request.
 * Browser: a singleton (created lazily, never during SSR).
 */
export function getQueryClient(): QueryClient {
  if (isServer) {
    return makeQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
}
