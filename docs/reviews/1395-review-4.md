# Code-Review 1395, Runde 4 (Merge c9c6be23, origin/main in den Zweig von #1395)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | backend/src/services/statement-invoices.service.ts:181-183, 206-216 | Semantischer Konflikt der beiden Seiten, ohne Textkonflikt: #1410 zählt eine gelöschte Rechnung mit abgelaufener Aufbewahrungsfrist nicht mehr (`deletedWithinRetention` in `changedInvoices`). Damit ist `invoiceIds` leer, und dank #1395 (`valuesTouched` jetzt auch für versendete, bezahlte und erledigte Abrechnungen) rechnet `recalculation` die Abrechnung neu, aber ohne die gelöschte Rechnung. Die Abrechnung erscheint als «Abrechnung berichtigen» mit der Begründung «Wohnung oder Verteilschlüssel geändert». Das widerspricht dem Satz, den der Merge in UBIQUITOUS_LANGUAGE.md übernimmt |

## C-1

**Warum das falsch ist.** #1410 legt fest: «Eine gelöschte Rechnung, deren Aufbewahrungsfrist abgelaufen ist, zählt nicht». Die Übersicht fordert den Liegenschaftsverwalter über eine eigene Aufgabe sogar auf, solche Rechnungen zu löschen.

Was jede Seite für sich tut:
- **Vor dem Merge auf main:** Eine versendete Abrechnung wird nie über `valuesTouched` geprüft. Die Löschung bleibt ohne Folgen.
- **Vor dem Merge auf dem Zweig:** Die Löschung zählte als geänderte Rechnung. Dort gab es #1410 noch nicht.

Was der Merge daraus macht:
- `changedInvoices` liefert eine leere Liste. `touched` ist dann wahr, sobald sich seit dem Erstellen irgendetwas am Gebäude geändert hat: `buildings.updated_at`, eine Wohnung oder ein Verteilschlüssel. Bei einer über 10 Jahre alten Abrechnung ist das so gut wie sicher.
- `recalculation(full)` rechnet mit den heutigen Rechnungen. Die gelöschte Rechnung fehlt dort (die Rechnungen werden hart gelöscht), also ist `check.changes` wahr.
- Damit gilt `valuesChanged = true` und `correctionDue = true` (Zeile 216: `valuesChanged && statement.status !== 'draft'`).
- Die Übersicht zeigt `laterText(0, false, true, false)`, also `statements_later_values_sent`. Der Grund, den sie nennt, stimmt nicht: Die Differenz kommt aus der gelöschten Rechnung, nicht aus der Wohnung oder dem Verteilschlüssel.

Bei Entwürfen bestand derselbe Pfad schon auf main. Erst #1395 öffnet ihn für versendete Abrechnungen, und genau dort tritt der Fall realistisch auf: Abrechnungen, die älter als 10 Jahre sind.

**So lässt sich das Versagen zeigen** (pg-Test, z. B. in `statement-outdated-values.pg.test.ts`):
1. Eine versendete Abrechnung einer Periode, die vor mehr als 10 Jahren geendet hat, rechnet eine Rechnung ab.
2. Diese Rechnung löschen.
3. Danach `buildings.updated_at` oder eine Wohnung des Gebäudes auf einen Zeitpunkt nach `created_at` der Abrechnung setzen.
4. `statementChanges(id)` aufrufen: `valuesChanged` und `correctionDue` sind wahr. `/api/v1/statements/outdated` führt die Abrechnung.

Erwartet wird nach #1410: Die Abrechnung ist nicht fällig. Möglich wäre auch, dass sie nur dann fällig ist, wenn die Neuberechnung ohne die abgelaufene Löschung einen anderen Saldo oder eine andere Position ergibt. Das muss der Fix oder der Product Owner entscheiden. Weil der Zweig erst mit diesem Merge auf #1410 trifft, gehört der Fall in diesen PR oder als Issue unter «Blocked on me».

Geprüft:
- UBIQUITOUS_LANGUAGE.md: Die Zeile «Nicht aktuelle Abrechnung» hat den Text des Zweigs (V-2) plus den Satz von main (#1410) vor «In der Oberfläche». Main hat an dieser Zeile sonst nichts geändert (Wort-Diff gegen die Merge-Base).
- src/lib/overview.ts: Die beiden Zeilen sind nur zusammengezogen und die Kommentare gekürzt. Typ und Logik sind unverändert, `retentionTasks` von main ist vollständig übernommen.
- statement-invoices.service.ts: Beide Seiten sind ohne Textverlust zusammengeführt.

## Nicht bestätigt

- Diese Checks hat nur der Aufrufer gemeldet:
  - lint, check und das Backend-type-check sind grün.
  - `bun run fitness -- --base origin/main --structure` meldet 0 Fehler.
  - vitest `--changed origin/main` ist grün (30 Dateien, 1361 Tests), dazu i18n, open-work, overview, design-guard und contract-rent-labels.
  - Die Backend-pg-Tests statement-outdated-values, statement-invoices und api-contracts sind grün.
  - Der p2-Benchmark misst 23 gegen die Ratchet von 21; die genehmigte Anhebung fehlt in diesem Commit.
- `wc -l` zählt 422 Zeilen für src/lib/overview.ts. Ob das Fat-File-Mass `loc` von fallow nach der Zusammenlegung 400 einhält, habe ich nicht nachgezählt (tools/fitness/fitness.ts:486). Ich habe weder fitness noch Tests ausgeführt.
- Ob es in der Praxis vorkommt, dass ein Gebäude oder eine Wohnung nach dem Erstellen einer über 10 Jahre alten Abrechnung geändert wurde, habe ich nur aus dem Code abgeleitet (`apartmentsChangedAt`, `lastValueChange`). Gegen Daten habe ich es nicht geprüft.
