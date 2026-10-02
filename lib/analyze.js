import { searchListings } from './providers/mock';

export async function runAnalysis(filters) {
  const items = await searchListings(filters);
  const prices = items.map(x => x.price).sort((a,b)=>a-b);
  const median = prices.length ? prices[Math.floor(prices.length / 2)] : 0;
  const enriched = items.map(item => {
    const deltaPct = median ? Math.round(((item.price - median) / median) * 100) : 0;
    return { ...item, deltaPct, opportunity: deltaPct <= -12 };
  });
  return {
    filters,
    summary: {
      count: enriched.length,
      medianPrice: median,
      minPrice: prices[0] || 0,
      opportunities: enriched.filter(x => x.opportunity).length
    },
    items: enriched,
    scannedAt: new Date().toISOString()
  };
}
