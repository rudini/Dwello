# Code-Review #837 Zyklus 1 (Abrechnungen), Runde 2

Delta: `git diff a8008843 acbaae11 -- . ':!docs/reviews' ':!implementation_plan.md' ':!docs/archive'`, Worktree `review-i837-cr` (acbaae11). Vorheriger Bericht: `docs/reviews/i837c1-review-1.md`.

## Status der offenen IDs

| ID | Schwere | Status | Begründung |
|---|---|---|---|
| C-1 | Major | geschlossen | `edit/+page.svelte:27` bindet `statement.paymentDeadline ?? ''`: dasselbe leere Feld wie auf origin/main, und kein `undefined` erreicht `DateInput` (`value = $bindable('')`). Neuer Test `statement-pages.dom.test.ts:1965` mit `paymentDeadline: null`. Die Fixture hat `unpaid: false`, das Feld wird also gerendert. Auf a8008843 hätte der Test mit `props_invalid_value` geworfen; die Rot-Begründung ist damit schlüssig. Von mir wiederholt: grün. ADR 0005, Z. 41, ist angeglichen. |
| C-2 | Major | geschlossen | Die Aufteilung ist annehmbar. «Plan (one cycle per pull request, largest first)» in #837 steht nicht unter «Decided (product owner)». Die Reihenfolge bleibt: 1b folgt vor den Mietverträgen. «Done means» von #837 gilt für das ganze Issue, nicht für jeden Zyklus. ADR 0005 («Zyklus 1a», Z. 28-30, und «Nächste Zyklen») und `fitness-functions.md:127` nennen die Lücke jetzt. Voraussetzung: Der Pull Request schliesst #837 nicht. |
| C-3 | Minor | geschlossen | `replaces` kommt per `Pick` aus `ApiStatement` (types.ts:347), `totalAdvancePayments` damit als `string`. Der einzige Leser, `Correction.svelte:60`, wandelt es mit `Number(…)` um. Zur Laufzeit ändert sich nichts. |
| C-4 | Minor | geschlossen | ADR 0005, Z. 18, nennt jetzt Rückgabetyp statt `satisfies`. Die Aussage «stand bei `getStatement` schon da» stimmt: `Promise<StatementWithDetails \| null>` auf 508c311a~1, Z. 288. |
| C-5 | Minor | geschlossen | `backend/src/api/statement.ts:3` und `src/lib/types.ts:323` verweisen auf ADR 0005. Im Code bleibt kein «ADR 0004». |

## Neue Befunde im Delta

Keine.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht wiederholt: `bun run check` (0 Fehler), `bun run lint`, `bun tools/fitness/fitness.ts` (5/13/36, Spiegel 52), die Zählung «Felder, die `src/lib/types.ts` deklariert: 51» (ADR 0005, Z. 54; `tools/arch-baseline/05-knowledge.ts` nicht gestartet) und der volle Lauf von `statement-pages.dom.test.ts` (191).
- Selbst ausgeführt: `bunx vitest run src/__tests__/statement-pages.dom.test.ts -t "fehlende Frist"`, 2 bestanden. Den roten Lauf auf a8008843 habe ich nicht wiederholt, weil ich keine Datei ändern darf. Er ist aus dem Svelte-Quelltext abgeleitet (Runde 1).
- #837 (REST, Body und Kommentare): Noch kein Kommentar hält Zyklus 1b fest. Der Plan des Autors kündigt den Eintrag an («ADR 0005, #837»). Ob der Pull Request #837 offen lässt, lässt sich erst am Pull Request prüfen.

Geprüft: Alle sechs Dateien des Deltas sind gelesen. Der Testkommentar, der Feldkommentar zu `priorPayments` und die ADR-Texte sagen nichts Falsches.
