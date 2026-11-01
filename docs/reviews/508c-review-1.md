# Code-Review 508-3: Summe der Heizkosten, dritte Runde (d44c671..71a9809)

Geschlossen: C-2, C-6.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-3 | Minor | backend/src/__tests__/invoice-completeness.pg.test.ts:393-403 | Zum Teil offen. Der neue Test zeigt nur den Teil `unagreed`. `costs` pro Heizkategorie hat weiter keinen Test, der es vom alten `Math.max` unterscheidet. Marc vereinbart nach `createRental` alle umlagefähigen Kategorien (agreed-category.service.ts:53), also gibt er allein schon 2500.00. Mit `Math.max` über die Verträge bleiben alle sieben Fälle grün. Es fehlt ein Fall, in dem kein Vertrag alle Heizkategorien vereinbart, z. B. Marc nur «Chimney Sweep» und Eva nur «Heating». |
| C-4 | Minor | backend/src/services/statement-run.service.ts:366-368 | Zum Teil offen. Der Kommentar stimmt jetzt: listStatements sortiert absteigend nach `statementDate` (statement.service.ts:188), und `reverse` mit `Map` behält die neueste Abrechnung. Die Zeile hat aber keinen Test. Es gibt keinen Fall mit zwei versendeten Abrechnungen nach der alten Regel in einer Wohnung. |
| C-7 | Minor | Commit 71a9809, Nachricht | Die Tests für C-2 (Zeile 365) und C-3 (Zeile 393) laufen schon auf d44c671 grün. Sie halten also nur fest, was schon funktioniert: Der Code summiert unverändert, und `items.length < shares.size` gibt für Eva 1 < 2. Die Commit-Nachricht sagt das nicht, und sie meldet auch keinen roten Lauf. CLAUDE.md, Workflow 2, verlangt das in der Nachricht, im Text des Pull Requests oder in der Nachricht des nächsten Commits. |

Zu C-2: Ich nehme die Begründung des Aufrufers an. Die Zweige `less` und `equal` und die Schwelle 0.05 liegen im reinen `heatingSum`. `heating-sum.test.ts` prüft sie mit der dritten Stichprobe 530.00 (`less`) und mit 0.04 (`equal`). Der neue pg-Fall mit drei Verträgen fängt die Mutationen aus 508b-1 ab:
- `tenants` nur vom letzten Vertrag: Die Prüfung ≈ 2000 schlägt fehl.
- `billed` nur von einem Vertrag: Das Ergebnis heisst dann nicht mehr `more`.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - lint und backend type-check;
  - `invoice-completeness.pg.test.ts` (25), `heating-sum.test.ts` und `api-contracts.pg.test.ts` (128 zusammen);
  - der rote Lauf des C-6-Tests (1000.00 statt 3000.00): Beim Lesen ist er plausibel, denn der Schlüssel `categoryId` behält von den zwei Positionen nur die letzte;
  - die E2E-Szenarien auf 8ae697d (2 passed), auf 71a9809 laufen sie noch.
- Das Aufräumen im Test mit drei Verträgen: `may.remove()` (rental.ts:34-42) löscht die Wohnung, bevor das äussere `.finally` den April-Vertrag löscht. `deleteApartment` lehnt das nicht ab, denn der Vertrag ist am 30.04.2025 beendet. Ob die Verträge per Cascade mitgehen, habe ich im Schema nicht gefunden. Das Ergebnis von `deleteContract(april)` prüft der Test nicht. Der Aufrufer meldet den Test als grün.
- Wie bisher:
  - `apartmentShare` gleich über alle Verträge der Wohnung: `getInvoicesForStatement` nicht bis zum Ende verfolgt;
  - «Vereinbart ab» mitten in der Periode;
  - `calculateStatement` ohne Guard.

Geprüft: alle Dateien des Deltas (`statement-run.service.ts`, `invoice-completeness.pg.test.ts`; `508b-review-1.md` ist ein Bericht), «Chimney Sweep» ist eine Heizkategorie (0002_stammdaten.sql:26), die Rechnung nach Kategorie und Verteilschlüssel und `unagreed` nach Kategorien (C-6), ponytail-review (nichts Unbenutztes, kein kopierter Helfer).
