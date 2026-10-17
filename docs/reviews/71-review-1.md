# Code-Review #71 (Heizprofil im Leistungszeitraum), Runde 1

Worktree `review-71-code` (detached auf 5ef0f20), Bereich `git diff 7b1aaa3 5ef0f20` (c491eeb Szenario, 5ef0f20 Umsetzung). Ich habe alle 12 geänderten Dateien gelesen, dazu `prorating.service.ts` (`handleMidYearMoves`), `heating-profile.service.ts` (`calculateHeatingShare`), `fuel-stock.service.ts`, `statement-pdf.service.ts` (`heatingOf`, `lineItemOf`), `pdf.service.ts` (`timeShare`, `partText`) und die Verwendung von `invoiceParts` im Frontend (keine; `src/lib/server/statement.ts` zeigt nur den Profilnamen).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | backend/src/services/calculation.service.ts:190-192 | Ergeben die Heizrechnungen einer Position zusammen 0 (#237), liefert der Pfad mit Profil trotzdem `invoiceParts` (`daysOf` gibt hier `noDays`). Das PDF druckt dann die Rechnungen und «… / 0.00 = 0.00». Das widerspricht dem letzten Satz von Regel 5 («ergeben die Rechnungen zusammen null, nennt es sie nicht»). Der Betrag bleibt 0 wie bisher. Abhilfe: bei `group.totalAmount === 0` `noDays` zurückgeben. |
| C-2 | Minor | backend/src/services/pdf.service.ts:65 (und fr/it/en), :780 | `heatingNoteParts` erscheint auch, wenn keine Heizrechnung ohne Leistungszeitraum vorhanden ist (z. B. vier Quartalsrechnungen). Der Satz nennt dann «52.00 % für eine Rechnung ohne Leistungszeitraum», die es nicht gibt. Diesen Fall nennt M-1 ausdrücklich als Beleg. Er ist nicht falsch, aber leer; das sollte der Fach-Review in Schritt 5 prüfen. |
| C-3 | Minor | backend/src/services/pdf.service.ts:65, :102, :724 | Hat das Gebäude einen Tankbestand (Heizöl, Teilung nach Lauf) und gibt es eine zweite Heizposition mit eigenen Tagen, behaupten `heatingNoteParts` und `sharesNoteHeatingParts` für jede Rechnung mit Leistungszeitraum «zählen die Monate des Heizprofils darin». Für die Tanklieferung stimmt das nicht (#257, `calculation.service.ts:217`). Dafür gibt es keinen Test und kein Szenario. |
| C-4 | Minor | backend/src/services/statement-pdf.service.ts:179 | Neu ist, dass `heatingLine` Positionen mit Profil-Teilen auslässt. Das zeigt nur das E2E-Szenario («52.00 % für eine Rechnung ohne …» statt 26.00 %). Ein Test in `statement-pdf.pg.test.ts`, der `heating.percent` beim gespeicherten Wert prüft, fehlt (tiefste Schicht). |
| C-5 | Minor | backend/src/services/pdf.service.ts:166, :248 | Das Genus von `partProfileNone` passt nicht zum Bezugswort: fr «Parts des mois … : aucun» sollte «aucune» heissen, it «Quote dei mesi … : nessuno» sollte «nessuna» heissen. Beide Texte stehen im PDF. Die Render-Tests (`statement-pdf-render.test.ts`, it.each) halten die falsche Form fest. |
| C-6 | Minor | backend/src/services/calculation.service.ts:174 | ponytail `reuse:` Die Teil-Konstruktion (start, end, amount, days, total, noPeriod, whole) wiederholt `daysOf` Z. 155-163. Abhilfe: ein gemeinsames `partOf(invoice, rentalStart, rentalEnd)` aus beiden aufrufen, etwa −8 Zeilen. Dabei geht `fuelStock` verloren; das ist heute nicht erreichbar, weil Tankkategorien ausgenommen sind. |
| C-7 | Nit | backend/src/services/pdf.service.ts:790 | ponytail `shrink:` Der Wrapper `list = (shares) => monthList(shares, t)` ist unnötig; `monthList(…, t)` direkt aufrufen. |
| C-8 | Nit | backend/src/services/calculation.service.ts:170 | ponytail `delete:` `toDate` ist nur ein anderer Name für `new Date`. Direkt `new Date(...)` schreiben. |
| C-9 | Nit | backend/src/services/calculation.service.ts:182 | Bei einer Rechnung ohne Leistungszeitraum werden `profile.periodMonths` (12 Monate) gespeichert, das PDF druckt sie aber nie (`partProfileRun`). Das sind tote Daten in jsonb und harmlos. |
| C-10 | Nit | backend/src/services/pdf.service.ts:707 | `partLine` schneidet den Vorlagetext bis `{amount}` ab. Das koppelt die Profilzeile an den Aufbau von `partLine`/`partBeyond`/`partNoPeriod`. Es funktioniert in allen vier Sprachen (die Render-Tests decken es ab), ist aber zerbrechlich. |
| C-11 | Nit | implementation_plan.md:403 | Fachreview V-3 (Hilfesatz zum Heizprofil mit Warmwasser, Test am Rand 0 % gegen > 0 %) und V-4 (Hilfe zum Leistungszeitraum) sind weder umgesetzt noch als offen vermerkt. Regel 5 nennt V-3 inhaltlich. Die Triage gehört in den Plan oder in den Pull Request. |

Keine Blocker, keine Majors.

## Bestätigt

- **Rechnung (Option B):** `byProfile` normiert je Rechnung die Monate des Mieters im Leistungszeitraum (Teil in der Periode) auf die Monate dieses Zeitraums. Gerundet wird wie #232 (`roundToRappen(tenant/billed*100)`, Monatswerte aus `calculateHeatingShare`). Die Position wird nach Beträgen gewichtet (#226). Getestet in `heating-distribution.pg.test.ts`:
  - Einzug Mai: 0 % von Januar bis März, 26 %
  - bis März: 71.5 %
  - angebrochener Februar: 42.42 % mit Monaten
  - ohne Mietstage: 0
  - 0-%-Rückfall nach Tagen: 62/92
  - über die Periode hinaus: 905.03 nach Tagen, darin 100 %
  - Tankkategorie ohne Endbestand: unverändert 52 %, ohne Teile
- **Beispiel des Entscheids:** Ein Einzug im Juli oder Mai trägt nichts von Januar bis März. Das zeigen der pg-Test und der E2E-Szenariogrundriss (`statement-detail.feature:56-66`, ohne `@wip`).
- **Ganze Periode und Rückfälle:** Ein Mietvertrag über die ganze Periode und eine Periode mit 0 % geben `byDays` (`prorating.service.ts:216`, `:221`) und laufen wie bisher über `rentalShare`/`daysOf`. Eine Position, deren Rechnungen alle die ganze Periode abrechnen, bleibt beim Anteil des Laufs (`calculation.service.ts:219`).
- **Tankausnahme (V-2):** Erkannt wird sie an der Kategorie aus `listFuelStocks(buildingId)`, wie die Vollständigkeitsprüfung es tut, nicht an der Zeile «Veränderung Tankbestand».
- **Nachrechenbarkeit (#232):** Das PDF druckt je Rechnung die Monate des Zeitraums, die Monate des Mieters, beide Summen aus den gedruckten Werten (`monthSum`) und die Teilung. «Ihr Anteil» rechnet mit `percent.toFixed(2)`, also mit demselben gerundeten Wert, aus dem `periodShare` entsteht. Bei einer Rechnung ohne Leistungszeitraum entspricht der Wert dem Anteil des Laufs, denn die Eingaben sind gleich (Überlappung des Vertrags gegen die Periode).
- **Gespeicherte Abrechnungen:** Alte `invoiceParts` haben kein `profile`. Deshalb laufen `partLine`, `factor`, `heatingLine` und `sharesNote` für sie wie bisher. Bestehende Tests wurden nicht angepasst. M-2 liegt in #335 (offen, `fachlich`, `entscheiden`).
- **M-1, M-3, V-8:** Neue Sätze in allen vier PDF-Sprachen, Render-Tests für de/fr/it/en und für den Fall ohne Profil-Teile (`heated`, 44.20 %). Die neuen UI-Texte betreffen nur das PDF; `messages/*.json` ist nicht berührt. Der Marker `TODO(fachlich prüfen, #336)` zeigt auf ein offenes Issue mit `fachlich`/`entscheiden`.
- **Rote Tests (beurteilt durch Lesen):**
  - Diese pg-Tests würden ohne die Änderung fehlschlagen, weil sie ohne sie den Anteil des Laufs bekämen: Mai, März, Februar, 10. Januar, 0-%-Rückfall und über die Periode hinaus. Der Tank-Test ist bewusst ein Regressionsschutz und schon vorher grün.
  - Die Render-Tests schlagen ohne die neuen Texte fehl.
  - Beide E2E-Szenarien schlagen ohne die Änderung fehl (Betrag 1'040.00 statt 520.00, neue PDF-Zeilen).
- **E2E-Schichten:** Neu ist nur `{int}` → `{float}` im bestehenden Schritt, der weiter `verwalter.sees(heatingCostsOfTenant)` aufruft. Die Szenarien beschreiben das Ziel, nicht die Bedienung. Ein neuer Bildschirm oder Zustand entsteht nicht; `screens.json` und die a11y-Features sind nicht betroffen.
- **Dokumentation:** Regel 5 und `data-model.md` (CR2-N2) beschreiben die neue Regel einschliesslich V-1, V-3 (Text), Tank und #335.
- **Unbeteiligtes:** Der Diff enthält nichts außerhalb der Anforderung. Der Umbau `shareOfGroup`/`byRunProfile` in `calculation.service.ts` war für das Fallow-Gate nötig und betrifft nur den geänderten Block.

## Nicht bestätigt

- Diese Checks hat nur der Aufrufer gemeldet, ich habe sie nicht wiederholt:
  - `bun run lint`, `bun run check`, `cd backend && bun run type-check`
  - `cd backend && bun run test` (775 pass, 94.4 % Zeilen) und der Lauf der sieben betroffenen Backend-Dateien nach dem Refactoring
  - `bunx vitest run` (2756 pass)
  - E2E (chromium und api, gemeldet für den Stand vor dem Refactoring; nach dem Refactoring nicht erneut gelaufen)
  - fallow audit
- **Prettier auf den eigenen Zeilen:** `bunx prettier <file> | diff` lieferte keine Ausgabe. Ob Prettier im Worktree überhaupt lief, konnte ich nicht prüfen, denn die Kontrolle wurde abgelehnt. Einige neue Zeilen in `calculation.service.ts` (z. B. Z. 174, über 200 Zeichen) sehen nicht Prettier-formatiert aus.
- **Zeitzone:** `calculateHeatingShare` rechnet Monate in lokaler Zeit, die Daten kommen aber als UTC-Mitternacht (`new Date('YYYY-MM-DD')`). Das ist dasselbe Muster wie im bestehenden `handleMidYearMoves`; bei UTC und UTC+1/+2 geht es auf. In einer Zeitzone westlich von UTC habe ich es nicht geprüft.
- **Wortlaut fr/it/en:** Abgesehen von C-5 habe ich die Übersetzungen nicht gegen `docs/design/i18n-begriffe.md` geprüft.
