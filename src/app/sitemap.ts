import type { MetadataRoute } from 'next';

import { siteConfig } from '@/shared/config';

import { getAllTenderSlugs } from '@/entities/tender/server';

const STATIC_ROUTES: ReadonlyArray<{
  path: string;
  changeFrequency?: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority?: number;
}> = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/tenders', changeFrequency: 'hourly', priority: 0.9 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tenders = await getAllTenderSlugs().catch(() => []);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: new URL(path, siteConfig.url).toString(),
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  const tenderEntries: MetadataRoute.Sitemap = tenders.map((t) => ({
    url: new URL(`/tenders/${t.id}`, siteConfig.url).toString(),
    lastModified: new Date(t.updatedAt),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return [...staticEntries, ...tenderEntries];
}
