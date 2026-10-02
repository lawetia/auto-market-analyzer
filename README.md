# Auto Market Analyzer

MVP narzędzia do obserwowania rynku samochodów, wykrywania ofert poniżej mediany i budowania historii skanów.

## Co działa
- kryteria auta,
- testowy provider ofert,
- mediana ceny i wykrywanie okazji,
- zapis skanów do Supabase,
- zapis automatycznych wyszukiwań,
- historia skanów,
- endpoint cron `/api/cron/scan`,
- Vercel Cron raz dziennie o 06:00 UTC.

## Supabase
Uruchom `supabase/schema.sql` w SQL Editor, a następnie dodaj w Vercel Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET` (opcjonalne lokalnie, zalecane na produkcji)

## Start lokalny
```bash
npm install
npm run dev
```

## Ważne
`lib/providers/mock.js` jest na razie źródłem testowym. Następny etap to legalne źródło rzeczywistych ofert (API/feed/import), bez obchodzenia zabezpieczeń OLX/OTOMOTO.
