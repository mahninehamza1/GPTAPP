'use client';

import { useEffect, useState } from 'react';
import type { BriefRecord } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPage() {
  const [items, setItems] = useState<BriefRecord[]>([]);

  async function load() {
    const res = await fetch('/api/briefs');
    const data = (await res.json()) as BriefRecord[];
    setItems(data);
  }

  async function remove(id: string) {
    await fetch(`/api/briefs/${id}`, { method: 'DELETE' });
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="mx-auto max-w-6xl space-y-4 px-4 py-8">
      <h1 className="text-2xl font-semibold">Admin — Submitted Briefs</h1>
      {items.map((item) => (
        <Card key={item.id}>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>{item.input.brandName}</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigator.clipboard.writeText(JSON.stringify(item, null, 2))}>Copy</Button>
              <Button variant="destructive" onClick={() => remove(item.id)}>Delete</Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-sm text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</p>
            <pre className="overflow-auto rounded-lg bg-secondary p-4 text-xs">{JSON.stringify(item.generatedBrief, null, 2)}</pre>
          </CardContent>
        </Card>
      ))}
      {!items.length && <p className="text-muted-foreground">No briefs submitted yet.</p>}
    </main>
  );
}
