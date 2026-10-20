# Code-Review 4 (Abschlussrunde, nur Delta) zu #453 «Abgerechnet bis»

Gegenstand: `git diff c2378283 07882d04 -- . ':!docs/reviews' ':!implementation_plan.md' ':!docs/archive'` im Worktree `review-453-code4` (detached, 07882d04). Das Delta ändert zwei Testdateien. ced07995 archiviert nur die Session. Vorheriger Bericht: `453-review-3.md`.

## Status der offenen IDs

| ID | Status | Beleg |
|---|---|---|
| C-7 (Minor) | offen, wie vereinbart belassen | Das Delta ändert `pdf.service.ts` nicht. |
| C-8 (Minor) | behoben | `backend/src/__tests__/billed-until.pg.test.ts:139-149`: «Abgerechnet bis» 30.04.2024, 100 ab Vertragsbeginn und 150 ab 01.09.2024. Erwartet werden 1000 (4 × 100 + 4 × 150). Würde der Abrechnungsbeginn bei `advanceLines` übergangen, kämen 1400 heraus. Wählte `amountOn` den falschen Betrag, kämen 800 oder 1200 heraus. Der Test fängt also beide Fehler. Der zweite Betrag wird im `finally` wieder gelöscht. Die Isolation bleibt erhalten, weil der nächste Test «Abgerechnet bis» selbst setzt. `backend/src/__tests__/statement-pdf-render.test.ts:608-612`: Die Fixture `billed` mit `advanceLines` prüft die Reihenfolge Summe «Akontobeiträge ab 01.03.2024 – 120.00», danach die Zeile «1 Monat × CHF 120.00 (…)». Der Code zeigt dieses Verhalten schon auf dem Basis-Commit (Prüfung in Runde 3). Die Commit-Nachricht nennt beide Tests als Tests für unverändertes Verhalten. Ein Rot-Lauf ist deshalb nicht nötig, und es geht um keinen Bugfix. |

## Neue Befunde

Keine. Es gibt keine Blocker, keine Majors und keine neuen Minors. Der neue Import `and` und `contractAdvancePayments` wird verwendet. Im Delta steht nichts, was nicht zur Aufgabe gehört.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht wiederholt: Backend-Type-Check auf 07882d04.
- Selbst wiederholt auf 07882d04 gegen `dwello_test_r453`: `bun test` für billed-until.pg und statement-pdf-render, 100 grün (das entspricht den gemeldeten 13 + 87).
- E2E und die Persona-Prüfung habe ich nicht gestartet (Vorgabe). Das Delta enthält nur Tests und braucht beides nicht.
