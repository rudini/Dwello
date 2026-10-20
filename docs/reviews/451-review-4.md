# Code-Review #451, Runde 4 (letzte Runde der Abschlussprüfung)

Gegenstand: `git diff f72f1812 2736fe64` (ein Commit, 14 Dateien), Worktree `review-451-code3` auf 2736fe64. Vorbericht: `451-review-3.md` (C-12 bis C-18). Anforderung: #451 mit M-1, V-3 und V-8.

## Status der offenen Befunde aus Runde 3

| ID | Status | Beleg |
|---|---|---|
| C-12 | erledigt | `tests/e2e/features/statement-detail.feature:681-688`. Die Rechnung für Januar bis März ist vom 2024-04-10, die Heizkostenrechnung der Grundlage vom 2024-06-30 (`tests/e2e/fixtures/backend.ts:405`). Das Backend sortiert nach Rechnungsdatum (`invoice.service.ts`, `orderBy(invoices.invoiceDate)`), die Reihenfolge der Formel stimmt also. Die Werte habe ich nachgerechnet: Marc Huber hat ab Mai keinen der Monate Januar bis März, also 0 %. Über das ganze Jahr hat er 2+0+0+0+2+8+14+26 = 52 %. Das ergibt 520 / 2000 × 2000 = 520.00. Das passt zu `:66` (CHF 520.00). Das Format kommt aus `factor` in `LineInvoices.svelte:13-14` (`toFixed(2)` + « %»). Auf 2d830b6b stand dort `days/total`, das Szenario ist dort also rot. |
| C-13 | erledigt | `tests/e2e/features/invoice-new.feature:61-66`. Die Grundlage legt «Seeblick» ohne Tankbestand an (`:8-10`). Der positive Anker ist ein Teilstück von `invoices_service_period_help` (`messages/de.json:869`). Die negative Prüfung auf «Tag der Lieferung» trifft nur `invoices_service_period_fuel` (`:872`). Der neue Schritt `invoice-form.steps.ts:167-169` ruft nur die Frage `servicePeriodHelpText` auf, mit `.not.toContain` wie in `dashboard.steps.ts:143`. Auf 2d830b6b steht `fuel={isFuel(...)}` (`new/+page.svelte:146`). «Heizung» ist dort ein Brennstoff, der Satz erscheint also, und die negative Prüfung schlägt dort fehl. |
| C-15 | erledigt | `deliversToTank(tankCategory, categoryId)` (`src/lib/invoice.ts:19-20`) ist jetzt die einzige Regel. Sie gilt für «Neue Rechnung» (`new/+page.svelte:147`), «Rechnung bearbeiten» (`edit/+page.svelte:61`) und das Hochladen (`UploadRowFields.svelte:76`). `grep tanks` findet ausserhalb der Tests keinen anderen Vergleich mehr. |
| C-16 | teilweise erledigt | `invoices.test.ts:284-298` prüft die Daten zum Tank beim Laden der Liste (`buildings[].tank`) und beim Laden von «Rechnung bearbeiten». Ohne die Änderung an der Liste ist der Test rot, weil `tank` fehlt. Weiterhin prüft kein Test, dass die Hilfe beim Hochladen vom gewählten Gebäude abhängt (`InvoiceUploadDialog.svelte:262`). Siehe C-19. |
| C-17 | erledigt | Die Kommentare `invoice-new.feature:51-53` und `invoice-pages.dom.test.ts:858-859` nennen jetzt die Kategorie des Tanks im Gebäude. |
| C-18 | erledigt (als offener Punkt) | Zeile O-43 in `docs/design/offene-punkte.md:118`. O-42 gibt es auf `origin/main` schon, die Nummer stösst also mit keiner anderen zusammen. |

## Neue Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-19 | Minor | `src/routes/invoices/InvoiceUploadDialog.svelte:262` | Diese Zeile hat sich geändert (`buildings.find(...)?.tank` statt `tanks[buildingId]`), ist aber weiter ohne Test. Kein DOM-Test des Hochlade-Dialogs übergibt ein Gebäude mit `tank` (`grep -rln tank src/__tests__` findet keinen Test zum Hochladen). Würde das falsche Gebäude gesucht, bemerkte das kein Test. Das ist der Rest von C-16. |

Keine neuen Blocker oder Majors.

## Geprüft und bestätigt

- **Nichts Fremdes im Delta:** Jede der 14 Dateien gehört zu C-12, C-13 oder C-15 bis C-18. `tanks` ist aus `InvoicesListData`, aus `+page.svelte` und aus den Props des Dialogs entfernt. Kein Rest davon bleibt ungenutzt.
- **Sicherheit:** Der Client bekommt neu pro Gebäude die ID einer Kategorie. Das ist dieselbe Information wie vorher in `tanks`. Es gibt keinen neuen Aufruf.
- **Texte:** Das Delta bringt keinen neuen UI-Text.
- **E2E-Schichten:** Der neue Schritt ruft nur eine Frage auf. Die Szenarien beschreiben, was der Liegenschaftsverwalter sieht, nicht wie er die Seite bedient.

## Nicht bestätigt

- **Selbst ausgeführt:** `bunx vitest run src/__tests__/invoices.test.ts src/__tests__/invoice-pages.dom.test.ts`, 105 grün.
- **Vom Aufrufer gemeldet:** `bun run lint`, `bun run check`, `bunx fallow audit` und `bunx vitest run` mit invoices, invoice-pages.dom, statement-pages.dom, open-work und design-guard (661 grün).
- **E2E:** Der rote Lauf ohne die Korrekturen und der grüne Lauf von `statement-detail.feature:684` und `invoice-new.feature:62` laufen laut Aufrufer noch. Ergebnis unbekannt, nach Vorgabe nicht gestartet. Rot auf dem Stand vorher und grün auf 2736fe64 habe ich nur durch Lesen beurteilt (siehe C-12 und C-13). Dass das Teil der Rechnung für Januar bis März bei Marc Huber «0.00 %» und nicht ohne Teil erscheint, habe ich aus der bestehenden Prüfung `:57-66` und dem DOM-Test der Runde 3 geschlossen, nicht ausgeführt.
- **Backend-Tests:** nicht nötig, das Delta ändert kein Backend.
