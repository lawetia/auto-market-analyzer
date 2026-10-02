'use client';

import { useEffect, useState } from 'react';

const initial = {
  make: 'BMW',
  model: 'Seria 3',
  yearFrom: 2012,
  yearTo: 2016,
  priceMax: 40000,
  fuel: 'diesel',
  gearbox: 'automat'
};

export default function Home() {
  const [filters, setFilters] = useState(initial);
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const update = (key, value) => setFilters(v => ({ ...v, [key]: value }));

  async function loadHistory() {
    const res = await fetch('/api/history', { cache: 'no-store' });
    const json = await res.json();
    setHistory(json.scans || []);
  }

  useEffect(() => { loadHistory(); }, []);

  async function scan() {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(filters)
      });
      const json = await res.json();
      setData(json);
      setMessage(json.persisted ? 'Skan zapisany w historii.' : 'Skan gotowy. Podłącz Supabase, aby zapisywać historię.');
      if (json.persisted) loadHistory();
    } finally {
      setLoading(false);
    }
  }

  async function saveSearch() {
    setSaving(true);
    setMessage('');
    const res = await fetch('/api/searches', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ filters })
    });
    const json = await res.json();
    setMessage(json.saved ? 'Wyszukiwanie zapisane. Cron będzie mógł skanować je automatycznie.' : 'Najpierw podłącz Supabase w Vercel.');
    setSaving(false);
  }

  return (
    <main>
      <section className="hero">
        <div>
          <span className="badge">AUTO MARKET / MVP</span>
          <h1>Znajdź auta poniżej rynku.</h1>
          <p>Ustaw parametry, skanuj oferty i buduj własną historię cen. Po podpięciu bazy zapisane wyszukiwania mogą być sprawdzane automatycznie.</p>
        </div>
      </section>

      <section className="card filters">
        <div className="field"><label>Marka</label><input value={filters.make} onChange={e=>update('make',e.target.value)} /></div>
        <div className="field"><label>Model</label><input value={filters.model} onChange={e=>update('model',e.target.value)} /></div>
        <div className="field"><label>Rok od</label><input type="number" value={filters.yearFrom} onChange={e=>update('yearFrom',+e.target.value)} /></div>
        <div className="field"><label>Rok do</label><input type="number" value={filters.yearTo} onChange={e=>update('yearTo',+e.target.value)} /></div>
        <div className="field"><label>Cena max</label><input type="number" value={filters.priceMax} onChange={e=>update('priceMax',+e.target.value)} /></div>
        <div className="field"><label>Paliwo</label><select value={filters.fuel} onChange={e=>update('fuel',e.target.value)}><option>diesel</option><option>benzyna</option><option>hybryda</option></select></div>
        <div className="field"><label>Skrzynia</label><select value={filters.gearbox} onChange={e=>update('gearbox',e.target.value)}><option>automat</option><option>manual</option></select></div>
        <div className="actions"><button className="primary" onClick={scan} disabled={loading}>{loading ? 'Skanuję…' : 'Skanuj rynek'}</button><button className="secondary" onClick={saveSearch} disabled={saving}>{saving ? 'Zapisuję…' : 'Zapisz automat'}</button></div>
      </section>

      {message && <div className="message">{message}</div>}

      {data && <>
        <section className="stats">
          <div className="stat"><span>Znalezione</span><strong>{data.summary.count}</strong></div>
          <div className="stat"><span>Mediana ceny</span><strong>{data.summary.medianPrice.toLocaleString('pl-PL')} zł</strong></div>
          <div className="stat"><span>Najtańsza</span><strong>{data.summary.minPrice.toLocaleString('pl-PL')} zł</strong></div>
          <div className="stat"><span>Okazje</span><strong>{data.summary.opportunities}</strong></div>
        </section>
        <section className="card">
          <div className="tableHead"><h2>Aktualny skan</h2><span>Źródło testowe</span></div>
          <div className="tableWrap"><table><thead><tr><th>Auto</th><th>Rok</th><th>Przebieg</th><th>Cena</th><th>Różnica</th><th>Status</th></tr></thead><tbody>
          {data.items.map(item => <tr key={item.id}><td><b>{item.title}</b><small>{item.location}</small></td><td>{item.year}</td><td>{item.mileage.toLocaleString('pl-PL')} km</td><td>{item.price.toLocaleString('pl-PL')} zł</td><td className={item.deltaPct < 0 ? 'good' : ''}>{item.deltaPct}%</td><td><span className={item.opportunity ? 'pill hot' : 'pill'}>{item.opportunity ? 'okazja' : 'rynek'}</span></td></tr>)}
          </tbody></table></div>
        </section>
      </>}

      <section className="card historyCard">
        <div className="tableHead"><h2>Historia skanów</h2><span>{history.length ? `${history.length} ostatnich` : 'brak zapisanej historii'}</span></div>
        {history.length === 0 ? <p className="empty">Po podłączeniu Supabase każdy skan będzie zapisywany tutaj.</p> : <div className="historyList">{history.map(scan => <div className="historyRow" key={scan.id}><div><b>{scan.filters?.make} {scan.filters?.model}</b><small>{new Date(scan.scanned_at).toLocaleString('pl-PL')}</small></div><div><span>{scan.summary?.count || 0} ofert</span><strong>{Number(scan.summary?.medianPrice || 0).toLocaleString('pl-PL')} zł</strong></div></div>)}</div>}
      </section>
    </main>
  );
}
