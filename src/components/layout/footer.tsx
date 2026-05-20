import { siteConfig } from '@/shared/config';

export function Footer() {
  return (
    <footer className='border-border bg-surface border-t'>
      <div className='text-text-secondary mx-auto flex h-12 max-w-6xl items-center justify-between px-4 text-xs'>
        <span>
          © {new Date().getFullYear()} {siteConfig.name}
        </span>
        <span>Сделано на Next.js + shadcn/ui</span>
      </div>
    </footer>
  );
}
