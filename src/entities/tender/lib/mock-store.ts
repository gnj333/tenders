import type { Tender } from '../model/tender.schema';

import { mockTenders } from './mock-data';

import 'server-only';

/**
 * In-memory mutable store for the mock backend. Survives between requests in
 * the same dev process. Replace with a real database in production.
 *
 * NOTE: this resets on every server restart. For prototyping only.
 */
const store: Tender[] = [...mockTenders];

export const mockStore = {
  list(): ReadonlyArray<Tender> {
    return store;
  },

  findById(idOrSlug: string): Tender | undefined {
    return store.find((t) => t.id === idOrSlug || t.slug === idOrSlug);
  },

  create(tender: Tender): Tender {
    store.unshift(tender);

    return tender;
  },

  update(id: string, patch: Partial<Tender>): Tender | undefined {
    const index = store.findIndex((t) => t.id === id);
    if (index === -1) return undefined;
    const existing = store[index];
    if (!existing) return undefined;
    const next = { ...existing, ...patch, id: existing.id } satisfies Tender;
    store[index] = next;

    return next;
  },

  delete(id: string): boolean {
    const index = store.findIndex((t) => t.id === id);
    if (index === -1) return false;
    store.splice(index, 1);

    return true;
  },

  nextId(): string {
    const max = store.reduce((m, t) => Math.max(m, Number(t.id) || 0), 0);

    return String(max + 1);
  },
};
