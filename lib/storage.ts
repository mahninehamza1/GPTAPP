import { createClient } from '@supabase/supabase-js';
import type { BriefRecord } from '@/lib/schema';

const memoryStore: BriefRecord[] = [];

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabase() {
  if (!supabaseUrl || !supabaseServiceRole) return null;
  return createClient(supabaseUrl, supabaseServiceRole, { auth: { persistSession: false } });
}

export async function saveBrief(record: BriefRecord) {
  const supabase = getSupabase();
  if (!supabase) {
    memoryStore.unshift(record);
    return;
  }

  await supabase.from('briefs').insert({
    id: record.id,
    created_at: record.createdAt,
    brand_name: record.input.brandName,
    data: record,
  });
}

export async function listBriefs() {
  const supabase = getSupabase();
  if (!supabase) return memoryStore;

  const { data, error } = await supabase
    .from('briefs')
    .select('data')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => row.data as BriefRecord);
}

export async function deleteBrief(id: string) {
  const supabase = getSupabase();
  if (!supabase) {
    const idx = memoryStore.findIndex((item) => item.id === id);
    if (idx >= 0) memoryStore.splice(idx, 1);
    return;
  }

  await supabase.from('briefs').delete().eq('id', id);
}
