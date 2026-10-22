# Code-Review #368 Slice B «Vereinbart ab», Runde 1

Bereich: `git diff c98684ba 11182cbd` (Worktree `review-368-B-code`, detached auf 11182cbd).

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | backend/src/services/calculation.service.ts:374, :381 (`heatingOfRun` vs. `fromDay`) | Wenn Heizkosten erst ab einem Tag vereinbart sind, wird die Heizkosten-Position nach den Monaten des Heizprofils ab diesem Tag geteilt. Der gespeicherte `heatingShare` wird aber weiter aus dem ganzen Mietvertrag berechnet. Bei einem Mietvertrag über die ganze Periode zeigen Abrechnungsseite und PDF deshalb, das Heizprofil sei «nicht angewendet», obwohl es angewendet wurde. Bei einem Einzug im Jahr nennt das PDF Monate, die nicht zum Prozentsatz passen |
| C-2 | Major | tests/a11y/screens.json:68–71, :346, :573 | Ein abgelehnter Tag ist ein neuer UI-Zustand, aber er fehlt in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`. Das gilt für den Assistenten (Fehler unter der Frage) und für das Mietvertragsformular (Fehler zum Formular). Die Texte `backend_agreed_from_before_start` und `backend_agreed_from_after_end` laufen damit nie durch axe und die Sprachprüfung |
| C-3 | Minor | backend/src/services/statement.service.ts:491 (`agreedStock`) | Heizkosten mit Tankbestand, vereinbart ab einem Tag nach dem Periodenende: Die Kategorie wird nicht abgerechnet. `fuelStock` wird aber trotzdem gespeichert, weil sie in `agreedCategoryIds` steht. Das PDF (`fuelOf`, statement-pdf.service.ts) druckt dann den Block «Heizkosten nach Verbrauch» und `sharesNoteFuel` für eine Kategorie, die gar nicht abgerechnet ist. Den Randfall Tankbestand-Kategorie (Fachreview V-5) prüft kein Test |
| C-4 | Minor | backend/src/services/contract.service.ts:479 | Das Bearbeitungsformular sendet die gespeicherten Tage jedes Mal mit. Wer ein Vertragsende vor einem gespeicherten «Vereinbart ab» einträgt, bekommt deshalb `AGREED_FROM_AFTER_END` und kann nicht speichern. Fachreview M-2 verlangt das Gegenteil: «Eine Vertragsende-Angabe, die später dazukommt, darf einen gespeicherten Tag nicht nachträglich ungültig machen; die Berechnung ergibt dann 0 Tage». Der Fehler steht zudem nur oben am Formular, nicht beim Feld. Die Prüfungen in `createContract` und `updateContract` (Z. 318, 479) prüft kein Test: `agreed-from.pg.test.ts` prüft Ablehnungen nur über `PUT /agreements` |
| C-5 | Minor | src/lib/contract-wizard.ts:226 | Die Übersicht im Assistenten «Neuer Mietvertrag» soll «Lift (ab …)» zeigen. Diese geänderte Zeile prüft weder ein Test noch ein Szenario: `contract-form.test.ts` prüft nur `agreedNames` |

## C-1 (Major): Der gespeicherte Heizanteil passt nicht zur ab einem Tag geteilten Heizkosten-Position

- **Was passiert:** `fromDay` gibt `shareOfGroup` einen Lauf mit `startDate = from` und `wholePeriod: false`. Damit teilt `byRunProfile` → `handleMidYearMoves` die Heizkosten-Position nach den Heizprofil-Monaten ab diesem Tag (`agreed-from.pg.test.ts` «rechnet Heizkosten ab einem Tag nach den Monaten des Heizprofils» bestätigt den Betrag). `heatingOfRun` (Z. 374) rechnet dagegen weiter mit dem unveränderten `contract`. Bei einem Mietvertrag über die ganze Periode ergibt das `{ byDays: true, reason: 'wholePeriod' }`, und so landet es in `utility_statements.heating_share` (statement.service.ts:490).
- **Warum es falsch ist:**
  - `src/lib/server/statement.ts:50–58` (`profileName`) zeigt auf der Abrechnung «{Heizprofil} (nicht angewendet: Mietvertrag über die ganze Periode)», obwohl die Position genau nach diesem Profil geteilt ist.
  - Im PDF ist `heatingOf` (statement-pdf.service.ts:173–181) bei `stored.byDays` leer. Die Heizkosten-Position erscheint dann ohne Profil und ohne Monate, nur mit einem Prozentsatz. Der neue Satz `sharesNoteAgreedFrom` («bei Heizkosten die Monate des Heizprofils ab diesem Tag») verweist auf Monate, die das PDF nirgends nennt.
  - Bei einem Einzug im Jahr ist der gespeicherte Anteil `byDays: false` mit den Monaten des ganzen Mietverhältnisses. `heatingLines` (pdf.service.ts:1134–1140) druckt diese Monate, setzt aber den Prozentsatz der Position (`lineShare`) daneben, und die beiden passen nicht zusammen.
  - In der UI erkennt `byProfile` (statement.ts:27–28) die Position nicht mehr als «nach Heizprofil», weil `periodShare` von `heatingShare.percent` abweicht.

  Die Anforderung «Heizkosten by the Heizprofil months» ist also rechnerisch erfüllt. Die Abrechnung erklärt den Anteil aber falsch, und der Mieter kann ihn nicht nachrechnen (Fachreview M-1).
- **Wie man es zeigt:** Im zweiten `describe` von `agreed-from.pg.test.ts` (Heizung ab 2024-10-01, Mietvertrag 2020–2025, Heizprofil) eine Abrechnung mit `POST /statements/generate` erstellen. Danach `statement.heatingShare` lesen: Er ist `{ byDays: true, reason: 'wholePeriod', … }`, während die Heizkosten-Position `periodShare` = Summe Okt.–Dez. des Profils hat. Oder das PDF erzeugen: Es enthält weder den Profilnamen noch die Monate Oktober bis Dezember.

## C-2 (Major): Der abgelehnte Tag fehlt in der a11y- und Sprachprüfung

- **Warum es falsch ist:** CLAUDE.md, «Design-Regeln/Process»: Ein neuer Zustand kommt in `screens.json` (mit `stateMeanings`), `accessibility.feature` und `sprachen-bildschirme.feature`, und zwar einmal pro Ort, an dem er erscheint. Für dieselbe Art Zustand gibt es schon Einträge: `billed-until-refused` (contract-new, contract-edit) und `agreement-save-failed` (statement-generate). Der neue Zustand erscheint an drei Orten: im Assistenten der Abrechnung als Fehler der Frage mit `backend_agreed_from_before_start` / `_after_end` (AgreementQuestion.svelte:48–50), auf contract-new über `savedFailed` und auf contract-edit über `saveError`. Keiner davon ist aufgenommen.
- **Wie man es zeigt:** `grep -n "agreed-from-refused\|agreement-from-refused" tests/a11y/screens.json` findet nichts. Dass fr/it/en hier kein Deutsch zeigen und axe 0 Verstösse meldet, prüft kein Test.

## Nicht bestätigt

- Alle vom Aufrufer gemeldeten Prüfungen auf 11182cbd, «vom Aufrufer gemeldet», keine davon selbst wiederholt:
  - `bun run lint`, `bun run check`, `cd backend && bun run type-check`;
  - Vitest (1150 + 617 Tests);
  - `agreed-from.pg.test.ts`, agreed-categories, `api-contracts.pg.test.ts`, statement-pdf-data;
  - E2E chromium+api für contract-detail, contract-edit, contract-new, statement-agreed-costs und statement-generate (260);
  - axe- und Sprachzeilen von `agreed-from` und `agreement-from`.
- Ob der Product Owner die gegenüber #407 geänderten Texte V-3 (`contracts_agreed_costs_help_edit`) und V-4 (`statements_not_agreed_text`) freigegeben hat (die Fachreview verlangt «dem Product Owner vorlegen»). Den Abschnitt «Decided (product owner)» von #368 habe ich nicht gelesen. Die Texte im Diff stimmen in allen vier Sprachen wörtlich mit den Vorschlägen der Fachreview überein.
- Ob das Zusammenlegen der unveränderten Schritte «… Einstellungen … geöffnet» / «… öffnet» in `tests/e2e/steps/agreed-costs.steps.ts:34–45` (Commit b2378c50, Code, den der Diff sonst nicht berührt) vom fallow-Duplikat-Gate verlangt war. Falls nicht, gehört es nicht zur Anforderung.
- Ob `apiCall`/`api.put` bei einem 400 `stored.error.code` und `params` so liefern, wie AgreementQuestion.svelte:48 sie liest. Belegt ist das nur durch den DOM-Test mit `contract-agreement-from-refused.json` und das gemeldete E2E; `$lib/api` habe ich nicht gelesen.

Geprüft: Migration, Schema, Route, Service und PDF (Liste «(ab …)», Satz M-1 in allen vier Sprachen, Test de); die Tage bleiben mit der Abrechnung gespeichert; die Ablehnungen sind codiert, mit Vertrag `contract-agreement-from-refused.json` und `contract.json`; Schalter und Felder im Formular inkl. V-6; Antwort «Vereinbart ab» im Assistenten inkl. V-2 und Fehler beim Speichern; Texte in allen vier `messages/*.json`; Marker #368 entfernt; die vier Szenarien ohne `@wip`, Steps über Tasks/Questions, die `@api`-Schritte über die Seed-API des Backends; die neuen Zustände `agreed-from` und `agreement-from` in screens.json und beiden Features; Tokens und Komponenten aus `src/lib/ui`.
