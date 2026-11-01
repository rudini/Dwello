# Code-Review #679, Abschlussrunde (6ea20b140..352ce449b)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde. |

Geschlossen: C-1

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bunx vitest run src/__tests__/statement-actions.test.ts` (39 bestanden): vom Aufrufer gemeldet.
- Dass der neue Test vor der Korrektur rot war: vom Aufrufer gemeldet. Beim Lesen bestätigt: Mit dem alten Code ginge die Weiterleitung auf `/statements?status=draft&page=2` statt auf `/statements?status=draft` (`src/__tests__/statement-actions.test.ts:224-228`).
- Der vollständige E2E-Lauf (chromium + api): vom Aufrufer gemeldet, er läuft noch, das Ergebnis ist offen.

Geprüft: `src/routes/statements/[id]/+page.server.ts:122-126`. `slice(12)` schneidet genau `/statements?` ab. Eine fremde Adresse, `null` oder `/statements?page=3` führt auf `/statements`. Die übrigen Filter bleiben erhalten (der bestehende Test in Zeile 217-222 deckt das ab). Die Adresse enthält keinen Hash (`+page.svelte:73` setzt nur `pathname + search`). Die Prüfung auf fremde Ziele ist unverändert. Der neue Bericht `docs/reviews/679-review-1.md` gibt Runde 1 wieder.
