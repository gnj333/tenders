import type { Metadata } from 'next';

import { siteConfig } from '@/shared/config';

type BuildMetadataArgs = {
  title: string;
  description?: string;
  /** Path relative to the site URL, e.g. `/tenders/123`. Used for canonical & OG URL. */
  path?: string;
  /** Absolute or relative image URL. */
  image?: string;
  type?: 'website' | 'article' | 'profile';
  /** Set true to mark the route as non-indexable (e.g. drafts, dashboards). */
  noindex?: boolean;
  keywords?: ReadonlyArray<string>;
};

/**
 * Centralised metadata builder. Ensures every page has consistent OG/Twitter
 * tags, canonical URL, and a title template.
 *
 * Usage:
 *   export const metadata = buildMetadata({ title: 'Tenders', path: '/tenders' });
 */
export function buildMetadata(args: BuildMetadataArgs): Metadata {
  const { title, description, path, image, type = 'website', noindex = false, keywords } = args;

  const url = new URL(path ?? '/', siteConfig.url).toString();
  const ogImage = image ?? siteConfig.ogImage;
  const fullDescription = description ?? siteConfig.description;

  return {
    title,
    description: fullDescription,
    keywords: keywords ? [...keywords] : [...siteConfig.keywords],
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
    openGraph: {
      type,
      url,
      title,
      description: fullDescription,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: fullDescription,
      images: [ogImage],
      creator: siteConfig.twitterHandle,
    },
  };
}
