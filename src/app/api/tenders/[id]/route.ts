import { NextResponse } from 'next/server';

import { mockStore } from '@/entities/tender/lib/mock-store';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tender = mockStore.findById(id);

  if (!tender) {
    return NextResponse.json({ error: 'Tender not found' }, { status: 404 });
  }

  return NextResponse.json(tender);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ok = mockStore.delete(id);

  if (!ok) {
    return NextResponse.json({ error: 'Tender not found' }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
