# Code-Review #199 / #408 Punkt 2, Runde 1

Gegenstand: `git diff c09ec4fd bf513f61` im Worktree `review-199-code` (Commit bf513f61; 61442eec = @wip-Szenarien).

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | backend/src/services/statement.service.ts:447 (mit :734 `correctStatement`), src/lib/server/statement-generation.ts:205 | Bei überschneidenden Altdaten lässt sich die berichtigte Abrechnung nicht mehr erstellen: Ist die ersetzte Abrechnung die einzige ihrer Periode und schneidet eine andere bestehende Abrechnung des Gebäudes diese Periode, lehnen Backend und BFF den Lauf mit `STATEMENT_PERIOD_OVERLAPS` ab. Auf dem Basis-Commit ging das. Kein Test. |
| C-2 | Minor | src/lib/accounting-period.ts:133-150, src/routes/contracts/[id]/MissingStatement.svelte:57, src/routes/statements/generate/OverlapWays.svelte:26 | Altdaten, deren Perioden sich schneiden: `missingWays` gibt für dieselben Tage mehrere Teile mit demselben `start` zurück (z. B. X 01.07.2023–30.06.2024 und Y 2024 im Gebäude, Mietvertrag ohne Abrechnung 2024: ein Teil 01.01.–30.06.2024 «existing» und ein Teil 01.01.–31.12.2024 «whole»). Folge: dieselben Tage stehen zweimal da, der Titel zählt zu viele fehlende Abrechnungen, und `{#each … (period.start)}` hat doppelte Schlüssel und doppelte `data-testid` (in dev `each_key_duplicate`). Dasselbe gilt in `OverlapWays` für zwei überlappte Perioden mit gleichem Beginn. Kein Test. |
| C-3 | Minor | src/lib/server/statement-generation.ts:125, messages/*.json `backend_statement_period_overlaps` | V-7 ist nur zum Teil umgesetzt: Die Ablehnung im BFF und im Backend nennt nur die erste überlappte Periode und nur das erste Gebäude. Schneidet der Lauf zwei Perioden, kann die angebotene «eine, die sie nicht schneidet» die zweite schneiden, und der Lauf wird wieder abgelehnt. |
| C-4 | Minor | src/__tests__/statement-generation.test.ts:126 | Der Test «lässt eine ersetzte Abrechnung … zu» zeigt nicht, dass eine ersetzte Abrechnung nicht zählt: Eine gleiche Periode (`einzug` 2024) ist vorhanden, darum gibt `overlappedBy` auch mit gezählter ersetzter Abrechnung `[]`. Dass `billingPeriods` und `overlapOf` die ersetzte Abrechnung beim Prüfen der Überschneidung auslassen, hält im Frontend kein Test fest (im Backend indirekt `statement-correction.pg.test.ts`). |
| C-5 | Minor | src/routes/statements/generate/BuildingStep.svelte:58 | Neue Zeile ohne Test: Ein vorgewähltes Gebäude (aus einem Entwurf oder nach Zurück aus Schritt 3) mit Überschneidung wird aus der Auswahl genommen. Weder ein DOM-Test noch ein Szenario prüft das. |
| C-6 | Minor | src/routes/contracts/[id]/+page.server.ts:105 | Neuer Zweig ohne Test: Können die Abrechnungen des Gebäudes nicht gelesen werden, zeigt die Seite keinen Hinweis auf fehlende Abrechnungen (`!ofBuilding`). Der vorhandene Test «lässt die Abrechnungen offen …» lässt alle Abrechnungsanfragen scheitern und endet schon vorher. |
| C-7 | Minor | backend/src/services/statement.service.ts:431-437, tests/e2e/tasks/statement-generate.ts:47-50 | Kommentare stehen an der falschen Stelle: Das JSDoc «Calculate a contract's statement and store it as a draft …» steht jetzt über `refuseOverlappingPeriod` statt über `generateStatement`. Der Kommentar «Steps "Abrechnungsperiode" … once the step has loaded …» steht jetzt über `chooseOfferedPeriod` statt über `chooseBuilding`. |

## Major

### C-1: Berichtigte Abrechnung bei überschneidenden Altdaten abgelehnt

**Warum falsch:**
- `refuseOverlappingPeriod` lässt alle ersetzten Abrechnungen weg (`status <> 'replaced'`), auch beim Vergleich «gleich».
- `correctStatement` (statement.service.ts:734) ruft `generateStatement` mit der Periode der ersetzten Abrechnung auf.
- Beispiel aus Fachreview V-1, Lindenhof: Marc 2024 und Lea 01.07.2024–30.06.2025, beide vor der Regel erstellt.
  - Ersetzt der Verwalter Marcs Abrechnung 2024, bleibt nur Leas Periode übrig. Diese schneidet 2024 und gleicht ihr nicht.
  - «Berichtigte Abrechnung erstellen» endet deshalb mit `STATEMENT_PERIOD_OVERLAPS`.
- Der BFF-Lauf ist ebenso betroffen: `overlapOf` lässt alle ersetzten Abrechnungen weg, `contractsInPeriod` lehnt den Lauf 2024 für Lindenhof ab.
- Auch die Seite des Mietvertrags hilft nicht. Sie bietet Marc nur Leas Periode 2024/25 und eine kurze Periode 01.01.–30.06.2024 an:
  - Leas Periode zählt Marc nicht als abgerechnet.
  - Die kurze Periode verknüpft keine Zahlungen (`priorPayments`), denn die Periode ist eine andere (Fachreview W2e V-3).
- Der Weg aus #120 (gleiche Periode, Zahlungen angerechnet) ist damit für diese Abrechnungen zu.
- Das widerspricht dem Entscheid des Product Owners: «Eine Periode, die einer bestehenden gleicht, ist erlaubt, auch wenn Altdaten sich schneiden», und «Bestehende Abrechnungen bleiben unverändert». Die ersetzte Abrechnung ist eine bestehende.

**So zeigt sich der Fehler:**
- In `statement-period-overlap.pg.test.ts` nach dem Muster von «lässt bei überschneidenden Altdaten …»:
  1. Eva 2024 erzeugen und versenden.
  2. Marcs Periode per `db.update` auf 01.07.2024–30.06.2025 setzen.
  3. Evas Abrechnung ersetzen (wie in `statement-correction.pg.test.ts`, `replace`).
  4. `correctStatement(evaId)` aufrufen.
- Erwartet: ein Entwurf 2024. Ist: `CodedError STATEMENT_PERIOD_OVERLAPS`.
- Im BFF entsprechend: `billedContracts` mit `{ auszug 2024, status: 'replaced' }` und `{ einzug 2024-07-01–2025-06-30 }` für die Periode 2024. Ergibt `overlap` ≠ null.

**Behebung:**
- Beim Vergleich «gleich» auch die Periode einer ersetzten Abrechnung ohne berichtigte Abrechnung zulassen, mindestens die des Mietvertrags des Laufs, wie `replacedHere` im BFF.
- Oder einen Entscheid des Product Owners einholen, falls die Sperre gewollt ist. Dann gehört der Fall unter «Blocked on me».

## Ponytail

Kein Befund, der über C-7 hinaus unbenutzten Code oder kopierte Helfer betrifft:
- Die Logik zu «partly billed» (BFF, Assistent, Texte, Szenarien, Steps, Targets, Questions) ist vollständig entfernt.
- `grep partlyBilled|billed_open|nothing_open|all_partly` findet nichts mehr.
- `uncovered` wird wiederverwendet statt kopiert.

## Bestätigt
- Backend `generate`:
  - lehnt eine Periode ab, die schneidet und keiner gleicht;
  - lässt bei Altdaten eine gleiche Periode zu;
  - zählt ersetzte Abrechnungen nicht;
  - Code und Params sind in `api-specification.md` beschrieben, die Meldung `backend_statement_period_overlaps` steht in allen vier Sprachen (`statement-period-overlap.pg.test.ts`, `statement-correction.pg.test.ts:251`).
- BFF: Lauf und Vorschau lehnen ab, bevor gerechnet wird (`statement-generation.test.ts` «erstellt und berechnet für ein solches Gebäude nichts», `statement-generate-actions.test.ts`).
- Schritt 2:
  - Das Gebäude ist nicht wählbar, «Alle Gebäude» lässt es aus.
  - Die Wege sind bestehende Periode (nur mit Mietstagen ohne Abrechnung, V-5) und kurze Perioden je Stück (V-2), nur beendet (V-4).
  - Für Leerstand gilt der Text aus V-3.
  - Die Einzahl/Mehrzahl folgt der Zahl der Abrechnungen (V-9). Der PO-Text «Die gewählte Abrechnungsperiode überschneidet sich damit.» steht wörtlich in de.
  - Belege: Unit- und DOM-Tests; Szenarien in `statement-generate.feature` ohne `@wip`.
- Seite des Mietvertrags: zeigt pro Teil seinen Weg, ohne Link, wenn eine eigene Abrechnung die Periode schneidet (V-1), mit Hilfetext #486 (`contract-actions.test.ts`, `contract-detail-page.dom.test.ts`, `contract-detail.feature`).
- V-6 (Texte ohne «ganz oder teilweise»), V-10 (Titel des @api-Szenarios), #487 (Glossarzeilen wie in Fachreview V-8 vorgeschlagen): im Diff.
- Der neue Zustand `buildings-overlap` steht in `screens.json` (mit `stateMeanings`), in `accessibility.feature` und in `sprachen-bildschirme.feature`.
- Rot ohne Änderung:
  - Die neuen Unit-, DOM- und pg-Tests und die Szenarien prüfen Felder, Texte und Ablehnungen, die es auf c09ec4fd nicht gibt.
  - Das @api-Szenario zur kurzen Periode hält nach der Commit-Nachricht von 61442eec kept behaviour fest. Auf der Basis schneidet 01.07.–31.12.2024 die Periode 2023/24 nicht, das Verhalten bestand also schon. Es ist keine Fehlerbehebung.
- Tokens (`bg-sunken`, `text-ink-muted`) und `Button` aus `src/lib/ui` stimmen mit `token-referenz.md`. Das deaktivierte Kontrollkästchen bleibt mit `aria-describedby` am Text.
- E2E-Schichten:
  - Die Steps rufen nur Tasks und Questions auf.
  - Die Questions geben Text, Adresse und Enabled zurück.
  - Die Features beschreiben fachlich, ohne «klickt», «Button» oder «Feld».

## Nicht bestätigt
- Selbst erneut ausgeführt: `bunx vitest run` mit `statement-generation`, `contract-actions`, `statement-generate-actions`, `contract-detail-page.dom`, `statement-wizard.dom`: 242 grün.
- Vom Aufrufer gemeldet:
  - `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` (alle), `bunx fallow audit`;
  - Backend-Tests (statement-pdf, statement-correction, statement-period-overlap einzeln grün);
  - Rot der @wip-Szenarien auf 61442eec;
  - E2E-Lauf (läuft noch).
- E2E-Seeds anderer Features: `seed.statement` geht über `statements/generate`, das jetzt ablehnt. Nur `statement-detail.feature` (Z. 333, 364, 402, 420, 560: Halbjahres- und Sommerperioden in Lindenhof/Rosenhof) gehört zum gemeldeten Lauf. Ob Hintergründe anderer Features (`contract-edit`, `invoice-detail`, `statement-minimum-balance`, `statement-agreed-costs`, `statement-management-fee`, `documents`, a11y-Seeds in `tests/e2e/fixtures/screens.ts`) sich schneidende Perioden in einem Gebäude erzeugen, konnte ich nur durch Lesen prüfen, ohne E2E. Per grep: keine weiteren eigenen Perioden ausser den genannten.
- Ob `heatingProfileOffered` nach dem Link aus Schritt 2 (Vollladen) zuverlässig im Schritt «Einstellungen» steht: nur aus `openStatementWizardFor` geschlossen, nicht ausgeführt.
- Ob Svelte 5 in der Produktionsausgabe bei C-2 sichtbar falsch rendert: nur aus dem Code (keyed each) geschlossen.
- Die Fachbegriffe in fr/it/en (z. B. «Établir la période de décompte courte») habe ich nicht gegen `docs/design/i18n-begriffe.md` geprüft.
