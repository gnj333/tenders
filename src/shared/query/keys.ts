/**
 * Top-level cache namespaces.
 *
 * Entities own their own leaf keys under `entities/<x>/api/<x>.keys.ts`.
 * This file only defines top-level namespaces to avoid collisions.
 */
export const queryNamespaces = {
  tender: 'tender',
  user: 'user',
  company: 'company',
  notification: 'notification',
  analytics: 'analytics',
} as const;

export type QueryNamespace = (typeof queryNamespaces)[keyof typeof queryNamespaces];
