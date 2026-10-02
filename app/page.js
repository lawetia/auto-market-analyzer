'use client';

import { useState } from 'react';

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
  const [loading, setLoading] = useState(false);

  const update = (key, value) => setFilters(v => ({ ...v, [key]: value }));

  async function scan() {
    setLoading(true);
    const res = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(filters)
    });
    setData(await res.json());
    setLoading(false);
  }

  return (
    <main>
      <section className="hero">
        <div>
          <span className="badge">MVP</span>
          <h1>Auto Market Analyzer</h1>
          <p>Ustaw kryteria i przeskanuj rynek. Ta wersja pokazuje cały przepływ aplikacji i jest gotowa pod podpięcie źródeł OLX/OTOMOTO.</p>
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
        <button onClick={scan} disabled={loading}>{loading ? 'Skanuję…' : 'Skanuj rynek'}</button>
      </section>

      {data && <>
        <section className="stats">
          <div className="stat"><span>Znalezione</span><strong>{data.summary.count}</strong></div>
          <div className="stat"><span>Mediana ceny</span><strong>{data.summary.medianPrice.toLocaleString('pl-PL')} zł</strong></div>
          <div className="stat"><span>Najtańsza</span><strong>{data.summary.minPrice.toLocaleString('pl-PL')} zł</strong></div>
          <div className="stat"><span>Okazje</span><strong>{data.summary.opportunities}</strong></div>
        </section>
        <section className="card">
          <div className="tableHead"><h2>Oferty</h2><span>Źródło testowe</span></div>
          <div className="tableWrap"><table><thead><tr><th>Auto</th><th>Rok</th><th>Przebieg</th><th>Cena</th><th>Różnica</th><th>Status</th></tr></thead><tbody>
          {data.items.map(item => <tr key={item.id}><td><b>{item.title}</b><small>{item.location}</small></td><td>{item.year}</td><td>{item.mileage.toLocaleString('pl-PL')} km</td><td>{item.price.toLocaleString('pl-PL')} zł</td><td className={item.deltaPct < 0 ? 'good' : ''}>{item.deltaPct}%</td><td><span className={item.opportunity ? 'pill hot' : 'pill'}>{item.opportunity ? 'okazja' : 'rynek'}</span></td></tr>)}
          </tbody></table></div>
        </section>
      </>}
    </main>
  );
}
