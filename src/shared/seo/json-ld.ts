import { siteConfig } from '@/shared/config';

type Thing = Record<string, unknown>;

/**
 * Serialize a JSON-LD object for use in a `<script type="application/ld+json">`.
 * Stringification escapes `<` so the output is safe to embed in HTML.
 */
export function jsonLd<T extends Thing>(data: T): string {
  return JSON.stringify({ '@context': 'https://schema.org', ...data }).replace(/</g, '\\u003c');
}

export const organizationJsonLd = () =>
  jsonLd({
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: new URL('/logo.png', siteConfig.url).toString(),
  });

export const websiteJsonLd = () =>
  jsonLd({
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/tenders?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  });

export const breadcrumbsJsonLd = (items: ReadonlyArray<{ name: string; href: string }>) =>
  jsonLd({
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: new URL(item.href, siteConfig.url).toString(),
    })),
  });
