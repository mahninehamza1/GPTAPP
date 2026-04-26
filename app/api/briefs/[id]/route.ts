import { NextResponse } from 'next/server';
import { deleteBrief } from '@/lib/storage';

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteBrief(id);
  return NextResponse.json({ ok: true });
}
