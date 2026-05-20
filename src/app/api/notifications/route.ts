import { NextResponse } from 'next/server';

import type { Notification } from '@/entities/notification/model/notification.schema';

/**
 * Mock notifications endpoint. Returns a fresh shuffled list on every call so
 * polling visibly does something. Replace with a real backend.
 */
const SAMPLE: ReadonlyArray<Omit<Notification, 'createdAt' | 'read'>> = [
  {
    id: 'n1',
    title: 'Опубликован новый тендер',
    body: 'Поставка медицинского томографического оборудования — приём заявок открыт.',
  },
  { id: 'n2', title: 'Срок подачи скоро истечёт', body: 'Услуги центра мониторинга кибербезопасности — осталось 3 дня.' },
  { id: 'n3', title: 'Тендер завершён', body: 'Организация школьного питания — определён победитель.' },
  { id: 'n4', title: 'Новый комментарий', body: 'Заказчик задал уточняющий вопрос по ремонту автомобильных дорог.' },
];

export async function GET() {
  const now = Date.now();
  const items: Notification[] = SAMPLE.map((s, i) => ({
    ...s,
    createdAt: new Date(now - i * 1000 * 60 * 7).toISOString(),
    read: Math.random() > 0.6,
  }));
  const unread = items.filter((n) => !n.read).length;

  return NextResponse.json({ items, unread });
}
