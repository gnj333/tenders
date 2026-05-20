import { buildMetadata } from '@/shared/seo';

export const metadata = buildMetadata({
  title: 'О сервисе',
  description: 'Узнайте, как сервис помогает находить и участвовать в государственных тендерах.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <section className='mx-auto max-w-3xl px-4 py-16'>
      <h1 className='text-text text-3xl font-semibold tracking-tight'>О сервисе</h1>
      <p className='text-text-secondary mt-4 text-base leading-relaxed'>
        Сервис собирает информацию о государственных закупках в едином поисковом интерфейсе, чтобы поставщики, агентства и
        консультанты находили подходящие тендеры за минуты, а не часы.
      </p>
      <h2 className='text-text mt-10 text-xl font-semibold'>Зачем это нужно</h2>
      <p className='text-text-secondary mt-2 text-base leading-relaxed'>
        Информация о тендерах разбросана по сотням площадок, часто плохо проиндексирована и труднодоступна для мониторинга. Мы
        объединяем её в одном месте с понятной структурой, оповещениями и выгрузкой.
      </p>
    </section>
  );
}
