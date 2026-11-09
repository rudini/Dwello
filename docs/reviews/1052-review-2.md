# Review 2 – #1052 Teil 1 (Abschlussrunde, Merge 8284858b)

Bereich: 7a4b9b1d (Archiv und Bericht) und Merge 8284858b von origin/main (`git show --remerge-diff 8284858b`).

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: Konfliktlösung in `src/routes/contracts/new/RentStep.svelte:5` übernimmt mainʼs Import `advanceHelp as glossaryAdvanceHelp, type ContractFormValues` aus `$lib/contract-form` (Export in `src/lib/contract-form.ts:52`, Verwendung `RentStep.svelte:21`) und lässt mainʼs `plainAmount`-Import aus `$lib/invoice` weg; `plainAmount` kommt weiter aus `$lib/utils/format` (`RentStep.svelte:12`, Verwendung Zeilen 175–176). Der Remerge-Diff zeigt keine weitere Abweichung. `$lib/invoice` exportiert `plainAmount` nicht mehr (nur Import in `src/lib/invoice.ts:3`); kein Importeur von `$lib/invoice` in `src` oder `tests` holt `plainAmount` daher, und keine der 36 von main hereingemergten Dateien fügt einen `plainAmount`-Import hinzu. 7a4b9b1d ändert nur `docs/archive/sessions/1052-1.md` und `docs/reviews/1052-review-1.md`.

## Nicht bestätigt

- fitness (0 Fehler), lint, check, Backend type-check, vitest contract-wizard (dom und unit), contract-edit.dom, tools/arch-baseline (223 Tests), Prettier auf hinzugefügten Dateien: vom Aufrufer gemeldet, nicht selbst ausgeführt.
- Die von main hereingemergten Änderungen selbst (u. a. Feldhilfe-Glossar, #698/#749/#1269) wurden in ihren eigenen Pull Requests geprüft; hier nur auf Wechselwirkung mit der Aufteilung (`plainAmount`-Verschiebung) gelesen.
