/**
 * Public API of the `tender` entity (client-safe).
 *
 * Server-only fetchers (`getTenders`, `getTenderById`, etc.) live in
 * `@/entities/tender/server` so importing them from a client component
 * fails loudly at build time instead of leaking server code into the bundle.
 */

export { tenderKeys } from './api/tender.keys';
export {
  useCreateTenderMutation,
  useDeleteTenderMutation,
  useInfiniteTendersQuery,
  useTenderQuery,
  useTendersQuery,
  useTenderSuspenseQuery,
} from './api/use-tenders';
export { formatBudget, formatDeadline } from './lib/format';
export {
  type Tender,
  type TenderCreateFormValues,
  type TenderCreateInput,
  TenderCreateInputSchema,
  type TenderListParams,
  TenderListParamsSchema,
  type TenderListResponse,
  TenderListResponseSchema,
  TenderSchema,
  type TenderStatus,
  TenderStatusSchema,
} from './model/tender.schema';
export { TenderCard } from './ui/tender-card';
export { TenderStatusBadge } from './ui/tender-status-badge';
