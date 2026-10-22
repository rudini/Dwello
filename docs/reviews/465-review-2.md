# Code-Review #465, Runde 2 (Abschluss, ac690222..3bb0902c)

## Status der Befunde aus Runde 1

| ID | Schwere | Status | Nachweis |
|----|---------|--------|----------|
| C-1 | Major | geschlossen | `UBIQUITOUS_LANGUAGE.md:157` enthält die Zeile «Quelle der Monatsanteile» im Abschnitt «Heizprofil», mit Definition und Spalten wie in #465 entschieden. |
| C-2 | Minor | geschlossen | `statement-pdf.pg.test.ts:534-555`: `sources` wird aus `heatingShare` entfernt. Bei einem vordefinierten Profil gilt die heutige Quelle, bei einem gelöschten eigenen Profil entfällt die Zeile. |
| C-3 | Minor | geschlossen | `reminder-pdf.test.ts:30-35`: Der Empfänger «Łukasz Dragoș» wird im PDF der Mahnung so gedruckt, wie er erfasst ist. |
| C-4 | Minor | geschlossen | `config/+page.svelte:116,124` übergibt `type="tel"` bzw. `type="email"`. `SettingField.svelte:31` setzt daraus `inputmode` (für `decimal` und `number` bleibt die Zuordnung gleich), und `TextInput.svelte:38` erweitert den Typ. Geprüft im SSR-Test `config-pages.test.ts:74-75`. |
| C-5 | Minor | geschlossen | `docs/api-specification.md:190-191` und `docs/data-model.md:456-457` nennen jetzt `company_phone` und `company_email`. |

## Neue Befunde im Delta

Keine.

## Nicht bestätigt

- Rot-Läufe von C-2 (ohne den Rückgriff), C-3 (ohne eingebettete Schrift) und C-4 (SSR-Test): vom Aufrufer gemeldet. Gelesen habe ich, dass jeder Test ohne die jeweilige Änderung fehlschlagen muss: Ohne den Rückgriff fehlt die Quelle, Helvetica/WinAnsi kann «Ł» und «ș» nicht drucken, und ohne die Änderung fehlt `inputmode`.
- `bun run lint`, `bun run check`, `bunx vitest run --changed origin/main` (1373), Backend `statement-pdf.pg` («vor #465») und `reminder-pdf.test.ts`: vom Aufrufer gemeldet, Backend-Tests nicht selbst wiederholt. `bunx vitest run src/__tests__/config-pages.test.ts` habe ich selbst wiederholt: 12 Tests bestanden.
- Die Auslagerung von `sourceOf` liegt nicht im Delta, sondern ist schon in ac690222 enthalten (`statement-pdf.service.ts:176`) und wurde damit in Runde 1 geprüft.

Geprüft: alle 9 geänderten Dateien des Deltas.
