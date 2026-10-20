# Code-Review 5 zu PR #518 (#450/#490): CI-Fix «Ohne Häkchen»-Hinweis

Worktree: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/review-450-code5` (8e88ca48).
Delta `fa62cdab..8e88ca48`: der Merge 5bf78f73 (origin/main, konfliktfrei, nicht Teil dieses Reviews) und der Fix-Commit 8e88ca48 (2 Dateien, +11/−1). Geprüft habe ich nur 8e88ca48.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/routes/contracts/AgreedCategories.svelte:24 | Im Fall, den der Fix abdeckt (in `agreed` steht eine Kategorie, die das Formular nicht zeigt), sagt der Hinweis jetzt «Ohne Häkchen rechnet Dwello diesem Mieter keine Nebenkosten ab». Beim Bearbeiten behält das Speichern die nicht gezeigte Kategorie aber als vereinbart (siehe V-1), und Dwello rechnet sie weiter ab. Vorher fehlte der Hinweis; jetzt ist er in diesem Fall falsch. Ein echter Vermieter erreicht den Fall nur mit mehr als 100 Kategorien oder wenn er eine Kategorie gleichzeitig in einem anderen Tab ändert. Darum Minor; die eigentliche Ursache ist vorbestehend (V-1). |

Kein Blocker, kein Major.

Ponytail-review: Lean already. Ship. (net: −0 lines possible)

## Ursache: ist sie schlüssig belegt?

**Mechanismus: ja.** Der Snapshot zeigt 17 leere Kästchen und keinen Hinweis. Das alte `agreed?.length === 0` kann dann nur falsch gewesen sein, wenn `agreed` noch IDs enthielt:
- `choose()` (AgreedCategories.svelte:25–30) entfernt nur die ID des angeklickten Kästchens aus `agreed`. Eine ID ohne Kästchen bleibt also stehen, auch wenn `untickAllCategories` (tests/e2e/tasks/contract-form.ts:194) alle gezeigten Kästchen abwählt.
- Wäre `agreed` `undefined` gewesen, wären die Kästchen angekreuzt geblieben (`isAgreed` gibt dann `true` zurück) und die Schleife hätte sie abgewählt. Daraus wird ein Array.
- Der neue DOM-Test `boxes(['c-not-shown'])` zeigt genau diesen Zustand. Ohne den Fix gilt `length === 1`, der Hinweis fehlt und der Test ist rot (beim Lesen geprüft). Ich habe ihn erneut laufen lassen: 5/5 grün.

**Woher die nicht gezeigte ID kam: wahrscheinlich ein Effekt paralleler Szenarien, nicht `limit=100`.**
- `agreeableCategories` (src/lib/server/category.ts:47–56) lädt `?limit=100` über **alle** Kategorien (sortiert nach `sort_order, name`, category.service.ts:67) und filtert erst danach `isAllowedUtilityCost`.
- `agreedCategoryIds` (agreed-category.service.ts) liefert die Kategorien, die der Vertrag vereinbart, sofern sie zum Zeitpunkt des Lesens umlagefähig sind.
- Die Seed-Migration 0002 legt etwa 20 Kategorien an, davon 12 umlagefähige. 17 Kästchen heisst also: rund 5 Kategorien paralleler Szenarien in `dwello_e2e`, weit unter 100. Die Grenze von 100 hat deshalb kaum gegriffen.
- Plausibler ist ein Wettlauf. Die Bearbeiten-Seite (`contracts/[id]/edit/+page.server.ts`) lädt zuerst den Vertrag (mit X in `agreedCategoryIds`) und danach die Kategorien. Dazwischen löscht ein paralleles Szenario X beim Aufräumen oder setzt sie auf nicht umlagefähig (`predefinedCategoryAllowance`/`categoryAllowance` samt Restore, tests/e2e/fixtures/backend.ts:446–466). X bleibt dann in `agreed`, aber ohne Kästchen.
- Welche Kategorie es in Run 39383443145 war, kann ich nicht belegen (siehe «Nicht bestätigt»). Für den Fix spielt das keine Rolle: beide Herkünfte führen in denselben Zustand, und den deckt der Fix ab.

## Weitere Stellen mit derselben Annahme

- **Prüfschritt des Assistenten** (src/lib/contract-wizard.ts:192, `agreedNames`, contract-form.ts:182): filtert über die gezeigten Kategorien. Er zeigt also, was die Kästchen zeigen («keine»), und hat dieselbe Annahme nicht. Die Vertragsansicht (`contracts/[id]/+page.server.ts:189–191`) arbeitet genauso.
- **`flatRateNotice`** (src/lib/contract-wizard.ts:91): `ticked = values.agreedCategoryIds?.length` zählt nicht gezeigte IDs mit. Dieselbe Annahme, vorbestehend (seit fa9cc056/#432) und vom Diff nicht berührt, siehe V-2.
- **Leere Liste speichern:** siehe V-1.

## Vorbestehend (nicht vom Diff verursacht; nach «Done means» offene Arbeit, falls gewünscht)

**V-1: Nicht gezeigte Kategorien gehen beim Speichern still verloren oder bleiben still erhalten.** Das Verhalten ist auf dem Basis-Commit 3add3b59 gleich; die Grenze `limit=100` stammt aus #91.
- *Bearbeiten:* `agreed` enthält X weiter, und `setAgreedCategories(..., { answeredOnly })` setzt `agreed = id IN (Liste)`. X bleibt also **still vereinbart** und wird abgerechnet, obwohl kein Kästchen dafür existiert und Prüfschritt sowie Vertragsansicht X nicht nennen.
- *Neuer Vertrag:* Fasst der Vermieter kein Kästchen an, bleibt die Liste `undefined`, und das Backend vereinbart alle umlagefähigen Kategorien, also auch X. Schon ein Klick baut die Liste nur aus den gezeigten Kategorien. Dann ist X **still nicht vereinbart**, weil `answered` alle umlagefähigen Kategorien umfasst.
- *Echter Fehler?* Nur ab mehr als 100 Kategorien insgesamt, die nicht umlagefähigen mitgezählt, also rund 80 eigene. Für die Zielgruppe (unter 50 Wohnungen) ist das unwahrscheinlich, aber nicht ausgeschlossen, und nichts schützt davor. Schwere als Bug: Minor bis Major je nach Einschätzung. Betroffen wäre ein Betrag in der Nebenkostenabrechnung ohne sichtbaren Hinweis. Dieselbe Grenze von 100 gilt auch in src/lib/server/invoice.ts:30.
- *Vorschlag:* ein `bug`-Issue. Ein erster Schritt wäre `?isAllowedUtilityCost=true` in `agreeableCategories`: den Filter kennt das Backend schon (category.service.ts:32), und die Grenze gälte dann nur noch für umlagefähige Kategorien. Robuster wäre, ohne Grenze zu laden oder eine Liste, die die Grenze erreicht, als Fehler zu behandeln. Nicht Teil dieses PR.

**V-2: `flatRateNotice` zählt nicht gezeigte IDs** (contract-wizard.ts:91, 95). Gleicher Randfall wie V-1:
- Mit Pauschale und ohne gezeigtes Häkchen erscheint die Pauschalen-Warnung, während der Hinweis aus C-1 gleichzeitig «keine Nebenkosten» sagt.
- Mit Akonto bleibt `ticked >= categories.length` wahr, auch wenn ein gezeigtes Kästchen abgewählt ist.

Vorbestehend; gehört zum selben Issue wie V-1.

## Weitere Punkte geprüft, ohne Befund

- **Test:** auf der untersten Ebene (DOM) und vor dem Fix rot (beim Lesen geprüft). Bestehende Tests für `[]`, `['c1']` und `undefined` decken den Rest ab: mit `undefined` gilt `!!agreed` als falsch, also kein Hinweis, wie zuvor.
- **E2E:** Das bestehende Szenario `contract-edit agreed-costs-none-advance` erwartet genau den Hinweis. Kein neues Szenario nötig: das sichtbare Verhalten im Normalfall ändert sich nicht.
- **Kein neuer Text,** keine neuen `messages`, kein neuer Bildschirm oder Zustand, kein API-Vertrag betroffen.
- **Nicht zur Anforderung #450 gehörig,** aber als Behebung der roten CI dieses PR zulässig (Skill pull-request, «Red CI»). Kein Befund.
- **Commit-Betreff:** Konvention eingehalten, 41 Zeichen.

## Nicht bestätigt

- Welche Kategorie in Run 39383443145 (Job 118497719288) in `agreed` stand und ob Löschen oder Umschalten auf nicht umlagefähig die Ursache war. Logs und error-context habe ich nicht gelesen; Beleg ist der Snapshot, wie ihn der Aufrufer beschreibt, plus der Code (edit/+page.server.ts, category.ts, agreed-category.service.ts, fixtures/backend.ts).
- Dass der Fix die Firefox-Flake in der CI tatsächlich beseitigt: E2E nicht gestartet (Vorgabe).
- lint, check, `src/__tests__/contract*` (315): vom Aufrufer gemeldet. Selbst erneut ausgeführt habe ich nur `agreed-categories.dom.test.ts`: 5/5 grün.
