import { buildMetadata } from '@/shared/seo';

export const metadata = buildMetadata({
  title: 'Контакты',
  description: 'Свяжитесь с нами: поддержка, продажи, партнёрство.',
  path: '/contacts',
});

export default function ContactsPage() {
  return (
    <section className='mx-auto max-w-3xl px-4 py-16'>
      <h1 className='text-text text-3xl font-semibold tracking-tight'>Контакты</h1>
      <p className='text-text-secondary mt-4 text-base leading-relaxed'>
        Мы на связи в будни с 9:00 до 19:00 по московскому времени. Напишите нам — ответим в течение рабочего дня.
      </p>

      <dl className='mt-10 grid gap-6 sm:grid-cols-2'>
        <div>
          <dt className='text-text-secondary text-sm'>Поддержка</dt>
          <dd className='text-text mt-1 text-base'>support@example.com</dd>
        </div>
        <div>
          <dt className='text-text-secondary text-sm'>Продажи</dt>
          <dd className='text-text mt-1 text-base'>sales@example.com</dd>
        </div>
        <div>
          <dt className='text-text-secondary text-sm'>Телефон</dt>
          <dd className='text-text mt-1 text-base'>+7 (495) 000-00-00</dd>
        </div>
        <div>
          <dt className='text-text-secondary text-sm'>Адрес</dt>
          <dd className='text-text mt-1 text-base'>Москва, ул. Примерная, д. 1</dd>
        </div>
      </dl>
    </section>
  );
}
