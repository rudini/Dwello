# Code-Review 1395-5 (Merge-Slice, Runde 2: Fix von C-1)

Delta: `git diff c9c6be23 2cad21a1 -- backend` (Worktree `review-1395-c1`, detached auf 2cad21a1).

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine offenen und keine neuen Befunde |

Geschlossen: C-1

Geprüft: `changedInvoices` meldet `expired` nur für hart gelöschte Rechnungen mit abgelaufener Aufbewahrungsfrist (`deletedWithinRetention` behält noch erfasste, aber anders abgerechnete Rechnungen, `invoice-retention.ts:120-139`), der Pfad ohne bekannte Positionen liefert `expired: false`; `changesOf` setzt `touched` dann nicht, `correctable` und die Neuberechnung bleiben für geänderte Rechnungen, Brennstoffvorrat und Schlüssel unverändert; `notUpToDate` liest `.ids.length`, der Entwurfspfad geht über dieselbe Zeile in `changesOf`. Verhalten entspricht damit `main` (versendete Abrechnung ohne Werteprüfung) und #1410. Der neue pg-Test baut genau den Fall aus C-1 (2014, versendet, Rechnung hart gelöscht, `buildings.updated_at` danach) und prüft `valuesChanged`/`correctionDue` false; ohne `!expired` wäre `touched` wahr und die Neuberechnung ohne die 732.00 ergäbe eine Differenz, also rot ohne den Fix.

## Nicht bestätigt

- Backend type-check; pg-Tests statement-outdated-values, statement-invoices, invoice-retention, api-contracts (207 grün); lint; `bun run fitness -- --base origin/main --structure` 0 Fehler; Prettier auf der Service-Datei; p2-Benchmark `/api/v1/statements/outdated` 23: vom Aufrufer gemeldet. Rotlauf des neuen Tests vor dem Fix: vom Aufrufer gemeldet, durch Lesen plausibel (siehe oben).
- Entwurf mit nach Ablauf der Aufbewahrungsfrist gelöschter Rechnung: kein eigener Test; gleiche Codezeile wie der getestete versendete Fall (`statement-invoices.service.ts:209`), daher nur durch Lesen bestätigt.
- Die nicht committete Anhebung der p2-Ratsche auf 23 liegt ausserhalb dieses Deltas und wurde nicht geprüft.
