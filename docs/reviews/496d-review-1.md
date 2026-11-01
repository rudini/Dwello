# Review 496d, Runde 1 (Abschlussrunde vor dem Push)

Bereich: `git diff 9b8e97d d830562` ohne `docs/reviews`, `implementation_plan.md`, `docs/archive`, `docs/design/personas`. Geändert sind `backend/src/services/data-export.service.ts` und `backend/src/__tests__/data-export.pg.test.ts`.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Geprüft: V-18 (`readme_already_paid`), V-19 (`readme_settled_carry`, nach dem Satz zum Offenen Betrag) und V-20 (`readme_documents`) stehen in de/fr/it/en Wort für Wort wie in der Tabelle von `docs/reviews/496-fachreview-4.md:17-19`. Der Unterschied ist nur das geschützte Leerzeichen ` ` in fr, das die Datei schon verwendet. Die genannten Spalten «Übertrag aus Abrechnung» und «Von Hand ausgeglichen am» und ihre fr/it/en-Namen stimmen mit `data-export.service.ts:141-142` überein. 496c C-1: Das Datum rechnet von `swissToday()` aus und ist immer der 1.1. des nächsten Jahres, liegt also immer in der Zukunft; die Erwartung nennt dieses Datum. 496c C-2: Die neuen Prüfungen für `keyCustom`, `profileCustom` und `statement` würden rot, wenn `named(...)` oder das Wort zurückgesetzt würde. Sie halten Verhalten fest, das es auf 9b8e97d schon gibt (`:211-212`, `:229`); die Commit-Nachricht sagt das. Die zwei neuen und die geänderte README-Prüfung (de) scheitern am Basistext. Aufgeräumt wird in `finally` (`inArray`, Verteilschlüssel, Heizprofil). Die Diff enthält nichts, was nicht zur Anforderung gehört. 496c C-3 bleibt auf Entscheid offen und steht in seinem Bericht.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, pg-Tests data-export und api-contracts (117 grün), open-work, i18n, no-german-in-code (501 grün), E2E chromium datenexport (9 grün), Prettier auf den hinzugefügten Dateien. Ausgeführt habe ich nichts.
- Den README-Wortlaut in fr/it/en prüft kein Test; den pg-Test gibt es nur für de. Ich habe ihn nur durch Lesen mit der Tabelle in `docs/reviews/496-fachreview-4.md:17-19` verglichen.
- Ob die Datenbank Heizprofile mit einer Monatssumme von 99.96 % (12 × 8.33) annimmt: Im Schema habe ich nicht nachgesehen. Laut dem Aufrufer laufen die pg-Tests grün.
