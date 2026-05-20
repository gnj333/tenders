import { type NextRequest, NextResponse } from 'next/server';

import { mockStore } from '@/entities/tender/lib/mock-store';
import { TenderCreateInputSchema, TenderListParamsSchema } from '@/entities/tender/model/tender.schema';

export async function GET(request: NextRequest) {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const parsed = TenderListParamsSchema.safeParse(searchParams);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid query', details: parsed.error.flatten() }, { status: 400 });
  }

  const { q, status, category, page, pageSize } = parsed.data;

  const filtered = mockStore.list().filter((t) => {
    if (status && t.status !== status) return false;
    if (category && t.category !== category) return false;
    if (q) {
      const needle = q.toLowerCase();

      return t.title.toLowerCase().includes(needle) || t.summary.toLowerCase().includes(needle);
    }

    return true;
  });

  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  // Imitate a small backend delay so loaders are visible in dev.
  await new Promise((r) => setTimeout(r, 200));

  return NextResponse.json({ items, total: filtered.length, page, pageSize });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = TenderCreateInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid body', details: parsed.error.flatten() }, { status: 400 });
  }

  const id = mockStore.nextId();
  const slug = parsed.data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);

  const created = mockStore.create({
    ...parsed.data,
    id,
    slug,
    status: 'open',
    publishedAt: new Date().toISOString(),
  });

  return NextResponse.json(created, { status: 201 });
}
