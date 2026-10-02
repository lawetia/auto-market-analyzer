import { NextResponse } from 'next/server';
import { runAnalysis } from '../../../lib/analyze';
import { getSupabase } from '../../../lib/supabase';

export async function POST(request) {
  const filters = await request.json();
  const result = await runAnalysis(filters);
  const supabase = getSupabase();

  let persisted = false;
  if (supabase) {
    const { error } = await supabase.from('scans').insert({
      filters: result.filters,
      summary: result.summary,
      items: result.items,
      scanned_at: result.scannedAt
    });
    persisted = !error;
  }

  return NextResponse.json({ ...result, persisted, databaseConfigured: Boolean(supabase) });
}
