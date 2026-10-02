import { NextResponse } from 'next/server';
import { getSupabase } from '../../../../lib/supabase';
import { runAnalysis } from '../../../../lib/analyze';

export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ ok: false, error: 'Supabase not configured' }, { status: 503 });
  const { data: searches, error } = await supabase.from('saved_searches').select('*').eq('active', true);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  let completed = 0;
  for (const search of searches || []) {
    const result = await runAnalysis(search.filters);
    const { error: insertError } = await supabase.from('scans').insert({
      search_id: search.id,
      filters: result.filters,
      summary: result.summary,
      items: result.items,
      scanned_at: result.scannedAt
    });
    if (!insertError) completed++;
  }
  return NextResponse.json({ ok: true, completed, total: searches?.length || 0 });
}
