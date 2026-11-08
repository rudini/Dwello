# Code-Review 1328 – Abschlussrunde 1 (3cc003d6..c6968d6c)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: der neue Test in `backend/src/__tests__/statement-outdated-values.pg.test.ts:102-114` bildet die Anforderung ab (Entwurf mit `{units}` = gleichmässige Teilung; danach direkt in der Datenbank eine Formel, die bei 3.5 Zimmern durch null teilt, mit neuem `updatedAt`, damit `valuesTouched` greift; `valuesChanged` false, solange `recalculation` nichts liefert, `statement-invoices.service.ts:173`; nach Korrektur über die API auf `{rooms}` teilt «Neu berechnen» 3.5 : 5.5 statt gleich, also true). Aufräumen: Schlüssel in `keys` (afterAll), Zimmer von 2.02 in `clear` zurückgesetzt, Rechnungen und Abrechnungen in `clear`. Nach dem Lesen fällt der Test ohne die V-8-Bedingung (`!!check?.changes` -> `check ? check.changes : true`) am ersten `expect` und ohne Schlüssel-Zeitstempel in `lastValueChange` am letzten. Commit-Betreff entspricht Conventional Commits (≤ 50 Zeichen). Der Merge 3cc003d6 ohne Konflikte, Berichte und Archiv waren nicht Teil dieser Prüfung (laut Aufrufer kein eigenes Review nötig).

## Nicht bestätigt

- Die 11 Tests der Datei laufen grün, beide Rot-Läufe (V-8-Bedingung entfernt, Schlüssel-Zeitstempel aus `lastValueChange` entfernt), Prettier sauber: vom Aufrufer gemeldet.
- lint, check, fitness, type-check, vitest, pg und E2E (220) auf dem Merge: vom Aufrufer gemeldet.
- Dass die Formel `1 / ({rooms} - 3.5)` von der API abgelehnt würde (darum der direkte Datenbankzugriff): nicht nachgeprüft; für den Test unerheblich, er braucht nur eine Formel, die sich nicht berechnen lässt.
