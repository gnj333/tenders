import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Скрыть `X-Powered-By: Next.js` в проде
  poweredByHeader: false,

  // Скрыть dev-индикатор Next.js в углу
  devIndicators: false,

  // Type-safe маршруты: Link href проверяется на существование роута
  typedRoutes: true,

  // На dev печатать каждый серверный fetch в терминал: URL, время, cache status.
  // Помогает «отлаживать backend» так же, как Network DevTools на клиенте.
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },

  // Оптимизация импортов часто используемых пакетов (быстрее HMR/build)
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
