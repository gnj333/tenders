import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

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
};

export default nextConfig;
