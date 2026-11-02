# Code-Review 999e, Runde 1 (Schlussrunde, `git diff bdfc4bb b75ffe7`)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: Ein reines Verschieben. `paidAmountOf` und `checkPaidDate` stehen in `backend/src/services/payment-entry.ts:10-28` Zeichen für Zeichen gleich wie zuvor in `statement.service.ts:823-841` (Base), samt Kommentaren. Neu ist nur das `export`. Die einzigen Aufrufer sind `statement.service.ts:785` und `:812`, beide über den neuen Import `:42`. `isRealDate` hat in `statement.service.ts` keinen Aufrufer mehr, deshalb fällt sein Import weg. `formatCHF` (`:28`), `swissToday` (`:40`) und `CodedError` (`:35`) werden dort weiter gebraucht und bleiben. Der Import-Graph hat keinen Zyklus: `payment-entry.ts` importiert nur `coded-error`, `pdf-format`, `real-date` und `today`. Die Datei hat ein eigenes Anliegen (die Prüfung einer eingegebenen Zahlung: Betrag #959, Tag #138) mit einem Kopfkommentar, und das passt zur Fix-Anweisung des Fat-File-Checks (`tools/fitness/fitness.ts:150`). `ratchet.json` ist unverändert (`fat.files` 1029). `--update` ist optional, und kein Check verlangt es (`fitness.ts:334`, `:493`). Kein Text, keine Antwort und kein Verhalten ändert sich, also braucht es kein Szenario, keine messages und keinen Contract. Die Commit-Nachricht nennt das beibehaltene Verhalten. ponytail-review: nichts zu streichen.

## Nicht bestätigt

- `bun run fitness` besteht auf b75ffe7: vom Aufrufer gemeldet. Die gezählten LOC habe ich nicht nachgemessen. `wc -l` ergibt 1103 Zeilen insgesamt. Der Check zählt `loc` aus dem Strukturbericht (`fitness.ts:416`), nicht die Rohzeilen.
- `bun run lint` auf beiden Dateien, Backend `bun run type-check`, Backend `bun test` für statement-lock, api-contracts, statement-payment und statement-carry-over: vom Aufrufer gemeldet.
- Prettier auf `payment-entry.ts` (CI prüft neu hinzugefügte Dateien): vom Aufrufer gemeldet (`--write`), nicht nachgeprüft.
- Commit-Gates (fallow, deepcheck, testcheck) auf b75ffe7: nicht ausgeführt. Ein Modul mit zwei Funktionen und einem eigenen Anliegen; nur gelesen.
