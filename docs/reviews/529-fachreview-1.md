# Fachreview #529, Runde 1 (Schritt 1): Glossarzeile «Nicht aktuelle Abrechnung»

Geprüfter Stand: Worktree `/tmp/claude/review-529-fach`, origin/main `fd00105`.

Ergebnis: Die Zeile stimmt **nicht** so, wie sie vorgeschlagen ist. Unten steht die berichtigte Zeile.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Laut Zeile wird jede versendete oder bezahlte nicht aktuelle Abrechnung berichtigt. Der Code verlangt die Berichtigung nur, wenn die Neuberechnung den Saldo oder eine Position ändert, und nicht nach «Nicht berichtigen» (E-3, E-6 von #454). |
| V-2 | Verwalter | Major | In der Zeile fehlt, dass ein Entwurf auch dann nicht aktuell ist, wenn er jetzt einen anderen Übertrag verrechnen würde (#506 C). Die Oberfläche nennt diesen Entwurf «nicht aktuell». |
| V-3 | Verwalter | Minor | Status: «versendete oder bezahlte» lässt «erledigt» weg (`CORRECTED`, statement-invoices.service.ts:101). Es fehlt auch, dass eine ersetzte Abrechnung nicht zählt (`counting`, :177). Die Spalte Code nennt nur `changedInvoices`, nicht aber `fuelStockChanged`, `carryChanged` und `correctionDue`. Fix: siehe berichtigte Zeile. |
| V-4 | Verwalter | Major | Bestand vor der Änderung: Die Rechnungsseite zählt ersetzte Abrechnungen mit (`invoiceStatements` ohne `counting`). Nach dem Berichtigen bleibt die Warnung «Abrechnungen nicht aktuell» deshalb dauerhaft stehen. |
| V-5 | Verwalter | Major | Bestand vor der Änderung: Ein Entwurf, der nur wegen eines anderen Übertrags nicht aktuell ist, erscheint in keiner Aufgabe der Übersicht. Er zählt weder zu «zu versenden» noch zu den nicht aktuellen Entwürfen. |
| V-6 | Verwalter | Minor | Bestand vor der Änderung: `invoices_missed_text` (messages/de.json:985) sagt ohne Bedingung «Versendete Abrechnungen berichtigen Sie …». Die Seite der Abrechnung sagt dagegen unter Umständen «Sie müssen die Abrechnung nicht berichtigen» (`statements_later_sent_none`, :1323). Fix: «Ob eine versendete Abrechnung zu berichtigen ist, sagt ihre Seite.» in allen vier Sprachen. |

## V-1 (Major): Bedingung der Berichtigung

- Beleg: `backend/src/services/statement-invoices.service.ts:126-130`
  `const correctable = CORRECTED.includes(statement.status) && (invoiceIds.length > 0 || fuelStock);` und
  `const due = check ? check.changes && check.result !== statement.correctionDeclined?.result : correctable;`.
  `recalculation` (statement.service.ts:603-611) vergleicht den Saldo und die Anteile der Positionen (`sharesOf`).
  «Nicht berichtigen» gibt es nur, wenn der Saldo, wie er eingefordert wird, nicht sinkt (`correctionDeclinable: due && !!check?.raises`, :135; `raises: after >= before`, statement.service.ts:611).
- In #454 hat der Product Owner entschieden: E-3 «the task «Abrechnung berichtigen» shows only when recalculating would change the balance or a line of this contract's statement», E-6 «Nicht berichtigen». Die Oberfläche sagt «Für {tenant} ändert das weder den Saldo noch eine Position. Sie müssen die Abrechnung nicht berichtigen.» (messages/de.json:1323).
- Warum falsch: Laut Glossar müsste der Liegenschaftsverwalter jede Abrechnung berichtigen, deren Periode eine Änderung hat. Das gilt auch für eine Rechnung, die den Anteil des Mieters gar nicht betrifft. Damit widerspricht das Glossar der Abrechnungsseite und der entschiedenen Regel.
- Fix: Die Pflicht zu berichtigen an die Neuberechnung knüpfen und «Nicht berichtigen» nennen (berichtigte Zeile unten). Ohne Neuberechnung, etwa wenn sich der Mietvertrag seither geändert hat, gilt jede Änderung als Grund zu berichtigen (:129-130).

## V-2 (Major): Übertrag beim Entwurf

- Beleg: `carryChanged` (backend/src/services/carry-over.ts:90) gilt nur für `status = 'draft'`. Der Versanddialog zeigt den Titel «Dieser Entwurf ist nicht aktuell» mit `statements_send_outdated_carry` (src/routes/statements/[id]/+page.svelte:78, SendDialog.svelte:93). Das Szenario dazu steht in tests/e2e/features/statement-minimum-balance.feature:174-184. Auch `draftsToSend` zählt den Entwurf als nicht aktuell (statement-invoices.service.ts:165, «Fachreview 506-1 V-8»).
- Warum falsch: Die Oberfläche verwendet den Begriff für einen Grund, den die Zeile nicht nennt.
- Fix: Den Satz zum Übertrag in die Zeile aufnehmen.

## V-4 (Major, Bestand vor der Änderung): Ersetzte Abrechnungen auf der Rechnungsseite

- Beleg: `invoiceStatements` (statement-invoices.service.ts:230) lädt mit `listStatements({ buildingId, limit: 1000 })` alle Abrechnungen, auch ersetzte (`statementFilterConditions`, statement.service.ts:130-145, filtert keinen Status). `stateIn` setzt für jede Abrechnung der Periode, der die Rechnung fehlt, `missedIn` (:240-243). Die BFF gibt `missedIn` ungefiltert weiter (src/lib/server/invoice.ts:126-129), und `MissedWarning` zeigt es an.
- Warum falsch: Eine ersetzte Abrechnung «bleibt unverändert erhalten» (Glossar «Berichtigte Abrechnung») und «zählt nicht als Abrechnung der Periode» (Glossar «Ersetzt»). Ihr fehlt die geänderte Rechnung also für immer. Darum zeigt die Rechnungsseite auch nach dem Berichtigen weiter «Für die Abrechnungsperiode … gibt es schon Abrechnungen ohne diese Rechnung» und «Versendete Abrechnungen berichtigen Sie …». Die Übersicht dagegen lässt ersetzte Abrechnungen weg (`counting(statements)`, :177). Der Liegenschaftsverwalter kann die Warnung nicht beheben.
- Fix: In `invoiceStatements` die ersetzten Abrechnungen für `missedIn` mit `isReplaced` übergehen. Für `billedIn` und `statements` bleiben sie drin, wie das Glossar «Abgerechnet (Rechnung)» es verlangt. Dazu gehört ein `*.pg.test.ts`: Rechnung ändern, Abrechnung berichtigen, dann ist `missedIn` leer. Nur aus dem Code gelesen, nicht ausgeführt.

## V-5 (Major, Bestand vor der Änderung): Entwurf mit anderem Übertrag fehlt in der Übersicht

- Beleg: `draftsToSend` zählt den Entwurf wegen `s.carryChanged` nicht zu den Entwürfen zum Versenden (statement-invoices.service.ts:165). `outdatedStatements` prüft für Entwürfe nur `draftOutdated(changes)`, also Rechnungen und Tankbestand, ohne `carryChanged` (:180). In src/lib/overview.ts:209 und :247-248 erscheint der Entwurf deshalb in keiner Aufgabe.
- Warum falsch: Der Liegenschaftsverwalter nutzt Dwello nur wenige Male im Jahr. Ein Entwurf, den er neu berechnen müsste, verschwindet dann aus der Übersicht und bleibt unversendet. Die Abrechnung wird so nicht innert der üblichen Frist zugestellt.
- Fix: `outdatedStatements` zählt bei Entwürfen auch `s.carryChanged`. Der Text der Aufgabe (`dashboard_task_outdated_drafts_text`) braucht dann den Übertrag als dritten Grund, und das braucht einen Entscheid, weil der Text in #454 E-4 / V-33 entschieden wurde. Die Alternative ist eine eigene Aufgabe für den Übertrag.

## Berichtigte Glossarzeile (zum Übernehmen)

| Begriff | Bedeutung | Code |
|---|---|---|
| **Nicht aktuelle Abrechnung** | Abrechnung, für deren Abrechnungsperiode seit dem Erstellen Rechnungen erfasst, gelöscht oder so geändert wurden, dass die Abrechnung sie anders abrechnen würde (Betrag oder abgerechnete Tage, Kategorie, Verteilschlüssel, Umlagefähigkeit), oder deren Anfangs- oder Endbestand (Stichtag oder Wert) sich geändert hat. Es zählen nur Rechnungen und Tankbestand der Kategorien, die ihr Mietvertrag beim Erstellen vereinbarte, und Rechnungen ohne Kategorie. Ein Entwurf ist auch nicht aktuell, wenn er jetzt einen anderen Übertrag verrechnen würde; der Liegenschaftsverwalter berechnet ihn vor dem Versand neu. Eine versendete, bezahlte oder erledigte Abrechnung berichtigt er, wenn die Neuberechnung den Saldo oder eine Position ihres Mietvertrags ändert oder sich die Abrechnung nicht neu berechnen lässt; sinkt der Saldo dabei nicht, kann er stattdessen «Nicht berichtigen» wählen, bis eine weitere Änderung ein anderes Ergebnis ergibt. Eine ersetzte Abrechnung zählt nicht. In der Oberfläche «nicht aktuell». | Berechnung (`statementChanges`: `changedInvoices`, `fuelStockChanged`, `carryChanged`; `correctionDue`) |

Begriff in allen Sprachen (passt zu i18n-begriffe.md:92/104 und zu messages/*.json:282-283, 983, 1320):

| key | de | fr | it | en |
|---|---|---|---|---|
| Nicht aktuelle Abrechnung | Nicht aktuelle Abrechnung («nicht aktuell») | décompte pas à jour («pas à jour») | conteggio non aggiornato («non aggiornato») | statement not up to date («not up to date») |

Geprüft: Diese Teile der Zeile stimmen mit dem Code überein. `billedAsIs` vergleicht Kategorie, Verteilschlüssel, Betrag und Tage in der Periode (:22-31). Eine Rechnung, die die Periode verlassen hat oder nicht mehr umlagefähig ist, zählt als gelöscht (`gone`, :79-82; `isValidUtilityCost`, invoice.service.ts:595). `agreedIn` nimmt die beim Erstellen vereinbarten Kategorien und Rechnungen ohne Kategorie (:34-35). `sameStock` vergleicht Kategorie, Stichtage und Werte, wie in E-2 entschieden (:87-95). `agreedStock` zählt den Tank nur, wenn die Brennstoff-Kategorie vereinbart ist (statement.service.ts:473-476). Eine Änderung des Heizprofils zählt nicht (messages/de.json:1510). Zum Mietrecht macht die Zeile keine Aussage.

## Nicht bestätigt

- Verteilschlüssel: Wenn der Liegenschaftsverwalter die Formel eines eigenen Verteilschlüssels (distribution-key.service.ts:167-197) oder die Fläche einer Wohnung ändert, macht das eine Abrechnung nicht «nicht aktuell». Die Zeile behauptet es auch nicht. Ob «Neu berechnen» dann mit den gespeicherten `key_values` oder mit den neuen Werten rechnet, habe ich nicht geprüft. Gesucht habe ich nur in `updateDistributionKey` und in docs/data-model.md:313.
- Abrechnungen vor #96, deren Positionen keine Rechnungen speichern, gelten nur dann als nicht aktuell, wenn eine Rechnung später erfasst wurde (:37-39, :77). Das ist Bestand für Altdaten und bewusst nicht in der Zeile.
- V-4 und V-5 habe ich aus dem Code gelesen, nicht mit einem Test ausgeführt.
