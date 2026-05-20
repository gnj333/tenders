import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { siteConfig } from '@/shared/config';
import { QueryProvider } from '@/shared/query';
import { organizationJsonLd, websiteJsonLd } from '@/shared/seo';

import { ThemeProvider } from '@/features/theme';

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    creator: siteConfig.twitterHandle,
    images: [siteConfig.ogImage],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#12111a' },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='ru' suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className='bg-background text-foreground min-h-dvh antialiased'>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <QueryProvider>
            <div className='flex min-h-dvh flex-col'>
              <Header />
              <main className='flex-1'>{children}</main>
              <Footer />
            </div>
          </QueryProvider>
        </ThemeProvider>
        <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: organizationJsonLd() }} />
        <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: websiteJsonLd() }} />
      </body>
    </html>
  );
}
