# Code-Review #130 (Rhythmus, Teilerregel #409 Punkt 1), Runde 1

Worktree: `review-130-code` (detached 7e10cba8), Bereich `3e728e19..7e10cba8` ohne `docs/reviews` und `implementation_plan.md`.
Gelesen: alle fünf geänderten Dateien vollständig im Diff, dazu `invoice-completeness.service.ts` ganz, der bestehende Unit-Test, `PreviewChecks.svelte`, die Targets und Questions der Kategorienprüfung, `tests/e2e/CLAUDE.md` (Regeln), `UBIQUITOUS_LANGUAGE.md` (Rechnungssteller, Gutschrift).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Nit | backend/src/__tests__/invoice-completeness.test.ts:271-275 | Der neue Test «4 statt 3» hat genau die Eingaben von «ordnet eine Rechnung am letzten Tag eines Abschnitts diesem Abschnitt zu» (Z. 248, Quartale [1,2,3] gegen 2024) und prüft weniger (nur `kind: 'gap'`). Ponytail `delete:` den Test, oder im bestehenden Test zusätzlich `kind: 'gap'` prüfen. -6 Zeilen. |
| C-2 | Nit | backend/src/__tests__/invoice-completeness.test.ts:277-281 | «Einzige Rechnung, wo das Vorjahr mehrere hatte» ist schon durch «nennt bei halbjährlichen Rechnungen das fehlende Halbjahr» (Z. 60, 1 statt 2) und «vergleicht eine Teilperiode» (Z. 125) festgehalten; der neue Test unterscheidet sich nur durch p = 4. Darf als Grenzfall der Regel stehen bleiben; sonst `delete:`. |
| C-3 | Nit | backend/src/services/invoice-completeness.service.ts:119-121 | Ponytail `shrink:` Zähler-Array plus `every` lässt sich als `const hit = new Set(current.map((i) => sliceOf(i.invoiceDate, coarse))); return hit.size === n && !hit.has(-1);` schreiben (n Rechnungen, n Abschnitte: genau eine pro Abschnitt). Nebenbei: heute schreibt eine Rechnung ausserhalb der Periode `hits[-1]++` als Nicht-Index-Eigenschaft; das Ergebnis stimmt trotzdem (ein Abschnitt bleibt dann 0), ist aber schwer zu sehen. -1 bis -2 Zeilen. |

Keine Blocker, keine Majors.

Ponytail: `net: -8 lines possible.` (C-1, C-3); sonst schlank.

## Geprüft und bestätigt

- **Regel #409 Punkt 1:** `coarserRhythm` prüft `2 ≤ n < p`, `p % n === 0` mit `p = min(Vorjahr, 12)` (`parts`), teilt die Periode mit derselben `slices`-Funktion in n gleiche Abschnitte und verlangt genau eine Rechnung pro Abschnitt. Es läuft nach dem Filter `bills` (Gutschriften in beiden Jahren ausgeschlossen) und nach dem bestehenden Abbruch `current.length >= previous.length`. Liefert es `true`, gibt `missingParts` `[]` zurück, `findingOf` geht weiter zu `changeFinding`: der Vergleich der Summen läuft weiter. In allen anderen Fällen bleibt der alte Weg unverändert.
- **Unit-Tests (Teilerregel, rot vor der Änderung, durch Lesen bestätigt):** 12→4 vierteljährlich (keine Lücke), 12→4 mit acht fehlenden Monatsrechnungen (Abweichung −67 %), 4→2 je Halbjahr (keine Lücke) mit der hingenommenen Grenze Q1+Q3 (Abweichung −50 %), 12(14)→6 mit Gutschrift (Deckel bei 12 und Ausschluss der Gutschrift: ohne Deckel wäre 14 % 6 ≠ 0, mit Gutschrift n = 7). Auf dem Basiscommit liefern alle eine `gap`, also rot.
- **Beibehaltenes Verhalten:** 4→3, eine einzige Rechnung, zwei Rechnungen im selben Halbjahr (n teilt p, aber ein Abschnitt doppelt) bleiben `gap`. Commit 0e382240 nennt sie in der Nachricht als Pins des beibehaltenen Verhaltens; der Basiscommit zeigt sie als `gap` (keine Teilerregel), keine Fehlerbehebung. Bestehende Tests, die eine Lücke erwarten (Halbjahr 1 statt 2, Teilperiode, 11 statt 12, 11 statt 14, Periode ab dem 16.), fallen nicht unter die Regel und laufen weiter grün.
- **Szenario** (`statement-generate.feature`, ohne `@wip`): 12 × 100 in 2023, 4 × 300 in 2024; vor der Änderung 12 Abschnitte, acht ohne Rechnung, also Befund und Bestätigung: rot durch Lesen bestätigt. Positiver Anker («enthält die Vorschau die Abrechnung von "Marc Huber"») vor den beiden Negativprüfungen; die Kategorienprüfung rendert aus denselben Vorschaudaten (`PreviewChecks.svelte`), der Anker genügt. Erste Rechnung 2023-01-31 liegt in den 92 Tagen, das Vorjahr gilt als erfasst. Die Summen sind gleich, also keine Abweichung.
- **E2E-Schichten:** Die neuen Steps rufen nur `verwalter.sees(...)` mit einer bestehenden Question (`categoryFindingOf`, Text oder null) und `seed.invoiceOn` (Vorbedingung über die Fixture, wie bestehende Steps, z. B. Z. 574). Keine `page`, keine Locators, kein `expect`. Feature-Text ohne UI-Wörter, Fachbegriffe «Rechnungssteller» und «Gutschrift» aus `UBIQUITOUS_LANGUAGE.md`.
- **Marker:** `TODO(fachlich prüfen, #130)` in `CategoryCheck.svelte` entfernt (Kommentar umformuliert, ohne Marker), wie vom Product Owner am 2026-10-19 entschieden; `grep "#130"` findet keinen weiteren Marker.
- **Ohne Bezug:** keine fremden Änderungen; kein UI-Text, keine Nachrichten, kein neuer Bildschirm oder Zustand (also keine Einträge in `messages/*.json` oder `screens.json` nötig), keine Änderung an einer API-Antwort (Form von `CategoryFinding` unverändert, kein Vertrag betroffen), keine Auth-Fläche.

## Nicht bestätigt

- `cd backend && bun test src/__tests__/invoice-completeness.test.ts`: im Worktree **neu ausgeführt**, 35 pass, 0 fail.
- Rote Läufe der vier neuen Unit-Tests und des Szenarios vor dem Code: nur durch Lesen bestätigt (siehe oben), nicht nachgespielt.
- `bun test src/__tests__/invoice-completeness` mit pg (45 pass), Backend-Type-Check, `bun run lint`, `bunx vitest run src/__tests__/open-work.test.ts` (5 pass), E2E chromium mit dem Filter (39 pass): vom Aufrufer gemeldet.
- Ob `getInvoicesForStatement` je eine Rechnung mit einem `invoiceDate` ausserhalb der Periode liefert (dann gilt C-3, Nebenbemerkung): nicht nachverfolgt, das Ergebnis ist in beiden Fällen richtig.
