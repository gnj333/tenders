/**
 * Server-only public API of the `tender` entity. Importing this file from a
 * client component triggers a build-time error via `'server-only'`.
 */
export { createTender, getAllTenderSlugs, getTenderById, getTenders } from './api/tender.fetchers';
