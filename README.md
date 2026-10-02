# Auto Market Analyzer

Prosty MVP do analizy ofert samochodów.

## Co już działa
- formularz kryteriów,
- skanowanie źródła testowego,
- mediana ceny,
- wykrywanie ofert >=12% poniżej mediany,
- responsywny panel.

## Następny krok
Podmienić `lib/providers/mock.js` na legalne źródło danych (oficjalne API / dozwolony feed / własny importer), dodać Supabase i historię snapshotów ofert.

## Start
```bash
npm install
npm run dev
```
