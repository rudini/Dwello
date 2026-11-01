# Code-Review 508-2: Summe der Heizkosten, Nachrunde (1a57dde..8ae697d)

Geschlossen: C-1, C-5.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-2 | Major | backend/src/__tests__/invoice-completeness.pg.test.ts:297-362 | Zum Teil offen. Neu sind Tests für die ersetzte Abrechnung und für den Vertrag ohne Heizkosten. Es fehlen weiter «zu wenig» (530.00), «gleich viel» und drei Mietverträge auf der pg-Schicht, wie Fachreview 508-1 V-1 «Fix» sie verlangt. |
| C-6 | Major | backend/src/services/statement-run.service.ts:378 | `shares` hat nur `categoryId` als Schlüssel. Eine Heizkategorie mit Rechnungen unter zwei Verteilschlüsseln gibt aber zwei Positionen (calculation.service.ts:121-131, #528). Die Map behält nur die letzte, darum sind `costs` und der Anteil des Vermieters zu tief. `unagreed` zählt Positionen statt Kategorien. Das ist eine Regression gegenüber 1a57dde. |
| C-3 | Minor | backend/src/services/statement-run.service.ts:378, 386 | Die Rechnung pro Heizkategorie (ein Vertrag vereinbart nur eine von zwei Heizkategorien) hat keinen Test. Mit dem alten `Math.max` bleiben alle Tests grün, denn der neue pg-Test arbeitet mit `[]`, und diesen Fall hat schon der alte Code richtig gerechnet. |
| C-4 | Minor | backend/src/services/statement-run.service.ts:365-366 | Der Kommentar sagt «die erste Abrechnung nach der alten Regel». `sent` kommt aber aus einer Abfrage ohne `ORDER BY` (invoice-completeness.service.ts:338-357). «Erste» heisst also nur: zuerst in einer zufälligen Reihenfolge. Die Reihenfolge ist nicht an die Liste der Vorschau gebunden und hat keinen Test. |

## C-2 (Major): die Fälle aus V-1 fehlen weiter

**Warum falsch.** Fachreview 508-1, V-1 «Fix», lässt das Szenario nur «mehr» prüfen. Dafür verlangt sie: «Die Fälle «zu wenig» (530.00, dritte Stichprobe), «gleich viel» und drei Mietverträge auf einer tieferen Schicht prüfen (`runHeatingHints`, *.pg.test.ts)». `heatingSumsAt` hat immer denselben Aufbau, nämlich Marc gespeichert und Eva gerechnet. Die beiden neuen Tests ändern nur Evas Vertrag. `heating-sum.test.ts` gibt die schon zusammengerechneten Zahlen vor und prüft nicht `heatingSumsOf`.

**So zeigt man den Fehler.**
- Drei Mietverträge: Im `reduce` für `billed` (Zeile 385) oder für `tenants` (Zeile 379) nur das letzte Element nehmen, z. B. `rented.at(-1)` statt der Summe. Alle Tests bleiben grün, denn es gibt nur einen gerechneten Vertrag.
- Die Wege `less` und `equal` über die echte Zusammenrechnung, also mit der Rundung von gespeicherten und gerechneten Anteilen, prüft kein Test.

**Fix.** Der Helfer `heatingSumsAt` lässt sich erweitern. Drei pg-Fälle: die dritte Stichprobe «zu wenig» 530.00, die zweite «gleich viel» und ein dritter Mietvertrag in der Wohnung.

## C-6 (Major): mehrere Verteilschlüssel einer Heizkategorie fallen zusammen

**Warum falsch.** `groupInvoicesByCategory` bildet Gruppen nach `categoryId` und `distributionKeyId`. «Die lines of one Kategorie stay together, also with several keys (#528)». Ein Vertrag hat dann für die Kategorie «Heating» zwei Positionen, jede mit ihrem eigenen `apartmentShare`. In Zeile 378 bekommen beide den gleichen Schlüssel `item.categoryId`. `new Map` behält nur den letzten `apartmentShare`. Damit:
- ist `costs` um den Wohnungsanteil der anderen Position zu tief;
- ist `landlord = costs - tenants` zu tief oder negativ. Bei einem negativen Wert ist `landlordFor` gleich `null`, und der Leerstand verschwindet aus dem Satz;
- vergleicht `unagreed` (Zeile 386) `items.length` mit der Zahl der Kategorien. Vereinbart Vertrag A «Heating» mit zwei Schlüsseln, aber nicht «Warmwasser», ist `2 < 2` falsch, und der Anteil von A an «Warmwasser» heisst «Leerstand».

Vor dem Delta war `costs` das Maximum über `sumOf(items, 'apartmentShare')` pro Vertrag. Diese Summe zählte beide Schlüssel. Der Fix von C-3 hat den Fall also neu falsch gemacht.

**So zeigt man den Fehler.** Im Aufbau von `heatingSumsAt` die zweite Heizungsrechnung (`Heizung Q1`) mit einem anderen `distributionKeyId` anlegen als die erste, im Gebäude mit mindestens zwei Wohnungen, damit sich die Anteile unterscheiden. Erwartet ist `costs` gleich der Summe der beiden `apartmentShare` aus `calculateStatement`. Geliefert wird nur einer davon.

**Fix.** Als Schlüssel `` `${item.categoryId}/${item.distributionKeyId}` `` nehmen. `unagreed` aus den Kategorien bestimmen: eine Kategorie fehlt in den Positionen eines Vertrags. Positionen nicht zählen.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - lint, check, backend type-check;
  - `invoice-completeness.pg.test.ts` (22 pass), `api-contracts.pg.test.ts` (99 pass), `heating-sum.test.ts` (4 pass);
  - vitest `statement-generation.test.ts` und `statement-heating-sum.test.ts` (36 pass);
  - Prettier --check auf den neuen Dateien;
  - die roten Läufe: die zwei pg-Tests mit `unagreed: false` und ohne `!isReplaced`, C-5 mit der alten Zeile, der Vertragstest beim Umbenennen von `landlordFor`.

  Beim Lesen sind sie plausibel:
  - Ohne `!isReplaced` wird die ersetzte Abrechnung mit `tenantShare` 0 zu `own`, also ändert sich `billed`.
  - `drift` vergleicht jetzt das erste Element von `heatingSums`.
- Ob `apartmentShare` einer Kategorie bei allen Verträgen der Wohnung gleich ist: `group.totalAmount` aus `getInvoicesForStatement`, mit «Vereinbart ab» und «Abgerechnet bis». Die Map in Zeile 378 nimmt das an. Ich habe `getInvoicesForStatement` nicht bis zum Ende verfolgt.
- Ein Vertrag mit «Vereinbart ab» für Heizkosten mitten in der Periode: Seine Tage ohne Vereinbarung gehen in den Anteil des Vermieters, heissen aber «Leerstand» (`unagreed` bleibt falsch). Gleich wie auf 1a57dde.
- Wie bisher (Vorgabe des Aufrufers): `calculateStatement` könnte werfen, ein Guard fehlt.

Geprüft: alle Dateien des Deltas mit Code und Tests (die Berichte der Persona und des Daten-Prüfers sind kein Code), der neue Vertrag `statement-run-heating-sum.json` und seine Verwendung im Frontend-Test, `heatingSum` mit der Schwelle 0.05 (C-5), ponytail-review (nichts Unbenutztes).
