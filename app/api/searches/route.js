import { NextResponse } from 'next/server';
import { getSupabase } from '../../../lib/supabase';

export async function GET() {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ configured: false, searches: [] });
  const { data, error } = await supabase.from('saved_searches').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ configured: true, searches: [], error: error.message }, { status: 500 });
  return NextResponse.json({ configured: true, searches: data || [] });
}

export async function POST(request) {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ configured: false, saved: false }, { status: 503 });
  const body = await request.json();
  const name = body.name || `${body.filters?.make || 'Auto'} ${body.filters?.model || ''}`.trim();
  const { data, error } = await supabase.from('saved_searches').insert({ name, filters: body.filters, active: true }).select().single();
  if (error) return NextResponse.json({ saved: false, error: error.message }, { status: 500 });
  return NextResponse.json({ configured: true, saved: true, search: data });
}
