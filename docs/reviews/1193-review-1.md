# Review #1193, Runde 1 (95f8390, `git diff 75b78a9 95f8390`)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Geprüft: `everyWordIn` (Kommas als Trenner, `backend/src/services/word-search.ts:6`) und `listBuildings` (Suche mit `postalCode`, Ort wortweise in PLZ und Ort, `building.service.ts:35-44`); ungenutzter `ilike`-Import entfernt; die zwei neuen pg-Tests schlagen beim Lesen ohne die Änderung fehl («1,» und «8610» treffen vorher nicht, `ilike(city, '%8610%')` trifft «Uster» nicht); die drei Szenarien schlagen ohne die Änderung fehl und sind isoliert (eindeutige Strasse über `seed.withNames`, das Gebäude wird nach dem Laden der Liste angelegt, also zeigt erst die neue Trefferliste «Seeblick»; nur positive Prüfungen, sortiert nach `updatedAt` absteigend, Seitengrösse 10); Schritte rufen nur Tasks und Questions; Szenarien sagen das Was; Fixture-Regex `^(?:(\d{4}) )?(.+)$` lässt alle bestehenden Aufrufe («Winterthur») bei 8400; keine neuen Texte, Bildschirme, Zustände oder Antwortformen (kein Contract betroffen); ponytail-review: schon schlank, nichts zu streichen.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bun run fitness`, `cd backend && bun run type-check`, `bun test` building-search, apartment-search, tenant-search, word-search und Wohnungs-pg-Tests (30 bestanden), E2E `buildings.feature` auf chromium (14 bestanden), Rotläufe der zwei Backend-Tests und der drei Szenarien, Prettier auf den geänderten Zeilen.
- Dass die Kommas jetzt auch in der Wohnungssuche ignoriert werden (`apartment.service.ts:111` nutzt dasselbe `everyWordIn`), deckt kein eigener Test ab. Beim Lesen sehe ich nur Treffer, die früher fehlten (ein Wort «B1,» traf vorher nichts), also keinen Fehler. Ich habe nur `backend/src/__tests__/apartment-search.pg.test.ts` und `word-search.test.ts` nach Komma-Fällen durchsucht und keine gefunden.
- Firefox und WebKit habe ich nicht laufen lassen. Ob die Seitengrösse 10 bei parallelen Läufen mit vielen Gebäuden unter «6003» reicht, ist nur gelesen: höchstens 3 Szenarien pro Browser.
