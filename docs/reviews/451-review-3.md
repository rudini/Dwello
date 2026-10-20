# Code-Review #451, Runde 3 (Abschlussrunde)

Gegenstand, im Worktree `review-451-code3` (detached, f72f1812), Berichte ausgenommen:
- `git diff 5b5dd2f1 2d830b6b^1`: Korrekturen der Runde 3 (C-9, C-10, C-11, V-21 bis V-26), Commit f6c4bb45
- `git show --remerge-diff 2d830b6b`: Merge von origin/main
- `git diff 2d830b6b f72f1812`: Korrekturen aus den Personas (Helga P-1, P-2, P-4; Dr. Weber P-1), Commit f72f1812

Vorbericht: `docs/reviews/451-review-2.md`. Anforderung: #451 mit «Decided (product owner)», darunter der Eintrag vom 2026-10-19 zu V-23, sowie `docs/design/personas/dr-weber-451.md` (P-1) und `helga-451.md` (P-1, P-2, P-4).

## Status der offenen Befunde aus Runde 2

| ID | Status | Beleg |
|---|---|---|
| C-9 | erledigt | `statement-wizard.dom.test.ts:952` setzt `heatingWithoutServicePeriod: []`. Selbst ausgeführt: grün. |
| C-10 | erledigt | Der JSDoc steht wieder über `servicePeriodOf`. `isFuel` gibt es nicht mehr, an seiner Stelle steht `deliversToTank` mit eigenem Kommentar. |
| C-11 | teilweise erledigt | Die Seite «Rechnung bearbeiten» hat jetzt einen DOM-Test (`invoice-pages.dom.test.ts:859`). Das Hochladen hat weiterhin keinen Test, siehe C-16. |

## Neue Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-12 | Major | `src/routes/statements/[id]/LineInvoices.svelte:13-14, 37`; `tests/e2e/features/statement-detail.feature` | Dr. Weber P-1: Die Detailseite rechnet in der Formel eine Heizrechnung nach Heizprofil jetzt mit dem Anteil nach Heizprofil. Das ist eine sichtbare Fehlerkorrektur, aber kein Szenario prüft sie. Der Commit nennt auch kein `No scenario: <reason>`. |
| C-13 | Major | `tests/e2e/features/invoice-new.feature:53-58` | Helga P-4: Die Hilfe zu Lieferungen steht jetzt nur noch bei der Kategorie des Tanks im Gebäude. Das geänderte Szenario prüft nur, dass der Text bei einem Gebäude mit Tank erscheint. Das war schon auf dem Stand vor dem Commit so, das Szenario war dort also auch grün. Dass der Text ohne Tank wegbleibt (die Korrektur selbst) und dass er zuerst steht, prüft nur der DOM-Test. |
| C-14 | Minor | `src/routes/statements/[id]/LineInvoices.svelte:16-20` | Dr. Weber P-1 ist nur halb behoben. Bei einer Heizrechnung nach Heizprofil ohne Leistungszeitraum steht über der Formel weiter «Ihre Mietstage 184 von 365 Tagen der Abrechnungsperiode» (`statements_part_no_period`). Die Formel rechnet aber mit «× 44.20 %». Woher die 44.20 % kommen, steht nirgends auf der Seite. Das PDF schreibt dort «Anteil nach Heizprofil: 44.20 %». |
| C-15 | Minor | `src/routes/invoices/UploadRowFields.svelte:75` | `fuel={!!tank && row.values.categoryId === tank}` wiederholt die Regel von `deliversToTank` (`src/lib/invoice.ts:18-19`), statt den Helfer aufzurufen. |
| C-16 | Minor | `src/routes/invoices/+page.server.ts:56, 72`; `src/routes/invoices/[id]/edit/+page.server.ts:27`; `InvoiceUploadDialog.svelte:264`; `InvoiceUploadRow.svelte:90`; `UploadRowFields.svelte:75` | Geänderte Zeilen ohne Test. Nur das Laden von «Neue Rechnung» hat einen Test für `tanks` (`invoices.test.ts:271`). Die Liste und «Rechnung bearbeiten» haben keinen. Beim Hochladen prüft kein Test, dass die Hilfe vom gewählten Gebäude abhängt (Rest von C-11). |
| C-17 | Minor | `tests/e2e/features/invoice-new.feature:52`; `src/__tests__/invoice-pages.dom.test.ts:858` | Beide Kommentare sagen noch «der Satz steht bei einer Brennstoff-Kategorie». Seit f72f1812 hängt der Satz aber vom Tank des Gebäudes ab. |
| C-18 | Minor | `src/routes/invoices/InvoiceDataFields.svelte:85-90` | Helga P-2 ist nur zum Teil beantwortet. Der Absatz zu Lieferungen steht jetzt zuerst. In einem Gebäude mit Tank hat die Hilfe bei dessen Kategorie aber weiter vier Absätze, das Entkalken des Boilers eingeschlossen. Der Kern von P-2, «Die Hilfe ist zu lang», bleibt also bestehen. Wie kurz die Hilfe sein soll, ist eine Entscheidung zum Design. Die Folge des Befunds klärt die Triage. |

## Blocker/Major

### C-12 (Major): kein Szenario für die Formel nach Heizprofil auf der Detailseite

**Warum falsch.** Laut CLAUDE.md, Workflow 1, braucht jede Verhaltensänderung ein Szenario in `tests/e2e/features` ohne `@wip`. Das gilt auch für eine Fehlerkorrektur, die der Benutzer sieht. Fehlt es, muss der Commit `No scenario: <reason>` sagen. Vorher zeigte die Seite «1’520.00 × 184/365 + …». Diese Formel ergibt nicht den angezeigten Betrag (Persona: 658.89 statt 634.69). Jetzt steht dort «1’520.00 × 44.20 % + …». `grep -rn "Ihr Anteil:" tests/e2e/features` findet für die Detailseite nur die Position «Hauswart» nach Tagen (`statement-detail.feature:679`). Für eine Heizposition nach Heizprofil gibt es nur Prüfungen im PDF (`:447`). Der E2E-Stack kann den Zustand herstellen: Das Szenario um `statement-detail.feature:447` hat schon Heizprofil, Mieterwechsel und Leistungszeiträume.

**Nachweis.** Ein Szenario mit dem Schritt `nennt die Position "Heizung" "Ihr Anteil: … × (1’000.00 × 0.00 % + 1’000.00 × 52.00 %) / … = …"` im Ablauf von `:447`. Auf 2d830b6b schlägt es fehl (dort steht «× 0/…» bzw. Tage), auf f72f1812 ist es grün. Der DOM-Test (`statement-pages.dom.test.ts:823`) zeigt den Fehler auf der untersten Ebene, ersetzt das Szenario aber nicht.

### C-13 (Major): das Szenario zur Hilfe bei Lieferungen zeigt die Korrektur nicht

**Warum falsch.** Gleiche Regel wie bei C-12. Dazu verlangt sie für jedes neue oder geänderte Szenario einen roten Lauf vor der Änderung, ausser der Commit nennt es als Szenario, das bestehendes Verhalten festhält. Das tut f72f1812 nicht. Auf 2d830b6b ist «Heizung» ein Brennstoff («Heating», `migrations/0024_category_fuel.sql`), und `isFuel` zeigte den Text sobald die Kategorie gewählt war, mit oder ohne Tank. Das Szenario mit Tank ist dort also grün. Die Korrektur für Helga P-4 betrifft Fernwärme in der Kategorie «Heizung» ohne Tank: Dort bleibt der Text jetzt weg. Das prüft kein Szenario.

**Nachweis.** Ein zweites Szenario (oder eine zweite Prüfung) ohne Tankbestand: die Kategorie «Heizung» wählen, zuerst den allgemeinen Satz «Geben Sie den Leistungszeitraum bei Rechnungen für einen Zeitraum an» als positiven Anker prüfen, dann die negative Prüfung auf das kürzeste Wort, z.B. «Tag der Lieferung» (`tests/e2e/CLAUDE.md`, «Negative checks»). Auf 2d830b6b schlägt es fehl, auf f72f1812 ist es grün.

## Geprüft und bestätigt

- **Fachreview 3 im Delta:** V-21 (it «combustibile del serbatoio»), V-22 (de und fr wörtlich wie vorgeschlagen, `statement-generate.feature:666` nachgeführt, it und en wie empfohlen unverändert), V-24 (Vorzeichen wie `partLines` in `pdf.service.ts:869`, zwei Erwartungen im DOM-Test, auf dem Stand vorher rot), V-25 und V-26 (en/it) sind umgesetzt. Die Zeile in `i18n-begriffe.md` folgt dem Abschnitt «Fehlende Begriffe».
- **Glossar V-23:** Der Wortlaut ist gleich wie im Vorschlag der Fachreview. Die Änderung deckt der Eintrag «2026-10-19 … V-23» unter «Decided» in #451 (`gh api repos/rudini/Dwello/issues/451`). Die Regel stimmt mit `getInvoicesForStatement` (`delivery = !!tank?.covered && …`) überein.
- **Merge 2d830b6b:** In `schema.ts` sind `AdvanceLine` (main) und der erweiterte `BilledInvoice` (#451) beide da, ohne doppelte Typen. In `pdf.service.ts` sind die drei Typen in einem Import zusammengeführt. In `statement-generate.feature` stehen das Akonto-Szenario von #464 und die #451-Szenarien hintereinander, keines fehlt. Nirgends in den Features und Tests von #451 steht noch das alte Wort «Akontozahlung».
- **`tankCategories`:** Es nimmt die Kategorie des letzten Tankbestands (die Antwort ist nach `readingDate` aufsteigend sortiert, `fuel-stock.service.ts:12`). Das ist dieselbe Wahl wie bei `periodReadings` (`closing ?? readings.at(-1)`). Schlägt der Aufruf fehl, liefert es keine Kategorie. Der Test liest den Vertrag `tests/contracts/fuel-stocks.json`. Für die Sicherheit ändert sich nichts: Die Anfrage geht über das `fetch` des BFF wie die übrigen Loads, die ID ist kodiert, und der Client bekommt nur Gebäude- und Kategorie-IDs.
- **E2E-Schichten:** Der neue Schritt ruft nur die Task `chooseBuilding` auf. Die Task ist eine Tätigkeit aus der Domäne («ordnet die Rechnung dem Gebäude zu»), und die Feature-Datei beschreibt keine Bedienelemente.
- **Texte:** f72f1812 bringt keinen neuen Text. f6c4bb45 ändert de und fr bei beiden Schlüsseln, it und en bleiben nach der Empfehlung von V-22 gleich.
- **Rote Tests:** `invoices.test.ts:271` (ohne `tankCategories` fehlt `tanks`), der geänderte DOM-Test «Rechnung erfassen» (die negative Prüfung nach der Wahl der Kategorie und die Reihenfolge schlagen mit `isFuel` und der alten Reihenfolge fehl) und `statement-pages.dom.test.ts:823` (vorher «184/365») schlagen alle ohne die Änderung fehl. Der Test der Bearbeitungsseite hat nur die Daten `tanks` dazubekommen und hält bestehendes Verhalten fest.
- **Nichts Fremdes:** Jede Datei im Delta gehört zu C-9 bis C-11, zu V-21 bis V-26, zum Merge oder zu den genannten Persona-Befunden.

## Nicht bestätigt

- **Selbst ausgeführt:** `bunx vitest run` mit invoice-pages.dom, invoices, statement-pages.dom, statement-wizard.dom, statement-generation und den invoice-upload-Tests: 413 grün. `bunx vitest run --changed 5b5dd2f1`: 36 Dateien, 1306 grün.
- **Vom Aufrufer gemeldet, nicht wiederholt:** `bun run lint`, `bun run check`, `cd backend && bun run type-check`, fallow, `bunx vitest run --changed origin/main` sowie die Backend-Tests für PDF, Vollständigkeit, Verträge und Heizung nach dem Merge.
- **E2E auf f72f1812:** laut Aufrufer noch nicht fertig, Ergebnis unbekannt (nach Vorgabe nicht gestartet). Ob `invoice-new.feature:53` mit dem neuen Ablauf (Tankbestand, Seite neu laden, Gebäude wählen) grün ist, habe ich nur gelesen. Der Seed legt den Tankbestand in «Heating» an (`tests/e2e/fixtures/backend.ts:415`), das passt zur Wahl von «Heizung».
- **Vertrag für `part.profile`:** Die Detailseite liest jetzt `invoiceParts[i].profile.percent`. Der BFF reicht das Feld ungetypt durch (`src/lib/server/statement.ts:37-40`). `tests/contracts/statement.json` hat kein Teil mit `profile`. Würde das Feld im Backend umbenannt, bemerkte das kein Frontend-Test. Der DOM-Test baut die Daten nach dem Mapping selbst, wie die übrigen Tests der Detailseite. Ich habe das deshalb nicht als Befund geführt.
- **Detailseite, `%` mit gewöhnlichem Leerzeichen:** Das PDF setzt vor «%» ein geschütztes Leerzeichen, die Seite ein gewöhnliches. Ob die Zahl bei 390 px vom «%» getrennt umbricht, habe ich nicht geprüft.
- **`tankCategories`, ungültiges JSON:** `response.json()` steht ausserhalb des `.catch`. Ein 200 mit kaputtem Body würde auf «Neue Rechnung» und «Rechnung bearbeiten» einen Fehler 500 auslösen. Das ist nur gelesen, und das Backend liefert immer JSON.
