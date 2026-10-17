# Review W8c (#65), `git diff 8f77372 de92910`

Geprüft im Worktree `review-w8c-code` (detached auf de92910). Gelesen: alle vier geänderten Dateien sowie die Verwendung der Konstanten (`invoice-completeness.service.ts:140-180`, `statement-wizard.ts:190-246`), Issue #65 und #130 (über `gh api`).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Nit | backend/src/services/invoice-completeness.service.ts:50 | «in its first 92 days» stimmt um einen Tag nicht: Der Code (`:173`) zählt das Vorjahr als erfasst, wenn `firstInvoiceDate <= addDays(before.start, 92)` gilt. Das sind der Starttag plus 92 Tage, also 93 Kalendertage. Genau wäre «within 92 days of its start». |
| C-2 | Nit | src/lib/statement-wizard.ts:196 | «Costs 15 % above … 30 % below» heisst im Code `change > AKONTO_ABOVE` bzw. `change < -AKONTO_BELOW`, also strikt «more than». Issue #65 schreibt «more than 15 % … more than 30 %». Der alte Kommentar hatte dieselbe Formulierung, der Fehler ist also nicht neu. |
| C-3 | Nit | implementation_plan.md:10 | In der Zeile «Files» fehlt `implementation_plan.md` selbst. Ohne Folgen. |

Keine Blocker oder Majors.

## Bestätigt

- **25 % / CHF 100** (`invoice-completeness.service.ts:47`): Der Code gibt nur dann keinen Hinweis, wenn `|change| < 100` oder `|change| <= previous * 0.25` gilt. Ein Hinweis kommt also bei mindestens CHF 100 und mehr als 25 %. Der Kommentar stimmt.
- **Marker #65**: Die Marker zu 15/30 %, 25 %/CHF 100 und 92 Tage sind jetzt Kommentare, die #65 nennen. Laut `grep -rn "#65" src backend tests` bleiben als Marker nur `statement-wizard.ts:236` (`GAP_DAYS`) und `PreviewChecks.svelte:121`. Beide sind wie verlangt für den blockierten dritten Punkt stehengeblieben.
- **F-16 (#76)**: Die zweite Hälfte ist ein eigener Marker `TODO(fachlich prüfen, #76)` auf `statement-wizard.ts:197`.
- **CategoryCheck.svelte:46**: Der Marker zeigt jetzt nur noch auf #130. Das passt zum Done means von #130 («stays … and points to this issue») und zum Done means von #65 («point to that issue or are removed»).
- Die Konstanten und ihre Werte sind unverändert. Es gibt keine Verhaltensänderung, ein Szenario ist also nicht nötig («No scenario: code comments only» trifft zu). Es gibt keine neuen Texte, keine UI-, E2E- oder a11y-Änderungen und nichts, was nicht zur Anforderung gehört.
- Ponytail-review: Der Diff besteht nur aus Kommentaren und dem Plan, nichts lässt sich streichen.
- Plan: Der blockierte Punkt ist als offenes Item mit Begründung eingetragen, die Session ist korrekt angelegt.

## Nicht bestätigt

- `src/__tests__/open-work.test.ts`: von mir erneut ausgeführt, grün (5 Tests).
- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run src/__tests__/statement-wizard.test.ts src/__tests__/design-guard.test.ts`, `cd backend && bun test src/__tests__/invoice-completeness.test.ts`: vom Aufrufer gemeldet. Da sich nur Kommentare geändert haben, besteht kein Anlass zu zweifeln.
- `tools/open-work/check-issues.mjs`: nicht gelaufen (kein Token), das übernimmt CI. Hinweis: #65 ist offen und trägt wieder das Label `entscheiden`, obwohl der Abschnitt «Decided (product owner)» auch den Lückenpunkt (`GAP_DAYS`) als entschieden aufführt. Das passt zur Rückfrage, von der der Aufrufer berichtet. Ob die Rückfrage tatsächlich im Issue steht, habe ich nicht geprüft (ich habe nur den Issue-Text gelesen, keine Kommentare).
