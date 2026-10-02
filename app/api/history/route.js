import { NextResponse } from 'next/server';
import { getSupabase } from '../../../lib/supabase';

export async function GET() {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ configured: false, scans: [] });
  const { data, error } = await supabase.from('scans').select('id, filters, summary, scanned_at').order('scanned_at', { ascending: false }).limit(20);
  if (error) return NextResponse.json({ configured: true, scans: [], error: error.message }, { status: 500 });
  return NextResponse.json({ configured: true, scans: data || [] });
}
