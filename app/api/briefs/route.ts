import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { briefInputSchema } from '@/lib/schema';
import { generateBrief } from '@/lib/brief-generator';
import { runIntegrations } from '@/lib/integrations';
import { listBriefs, saveBrief } from '@/lib/storage';

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = briefInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const generatedBrief = generateBrief(parsed.data);
  const record = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    input: parsed.data,
    generatedBrief,
  };

  await saveBrief(record);
  await runIntegrations(record);

  return NextResponse.json(record);
}

export async function GET() {
  const briefs = await listBriefs();
  return NextResponse.json(briefs);
}
