# Code-Review #1277, Runde 2 (Abschlussrunde, Commit f760a8c, Delta 80df177..f760a8c ohne docs/reviews)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-4 | Minor | src/__tests__/contract-detail-page.dom.test.ts:583 | Der neue Test steht zwischen dem bestehenden Kommentar «kein Vorschlag: ein schnelles Bestätigen soll den Mietvertrag nicht aus Versehen heute beenden» und dem Test, den dieser Kommentar erklärt (`fragt beim Beenden nach dem Vertragsende, ohne einen Tag vorzuschlagen`, jetzt Z. 604). Der Kommentar steht damit über dem falschen Test: Er handelt vom vorgeschlagenen Tag, der neue Test aber von der Art. |

Geschlossen: C-1, C-2 (C-3 im Archiv begründet zurückgewiesen).

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: Der neue Test ist grün. Er wird rot, wenn `{:else if endKind === 'notice'}` durch `{:else}` ersetzt wird, und ebenso ohne die Zeile `if (!endKind)` in `checkEndDate`. Auf dem Merge laufen `check`, `lint` und vitest grün (4581 passed). Die CI von PR #1293 läuft noch.
- Nach Lesart passen beide Rot-Läufe: Ohne `else if` ist `contract-notice-received-input` sofort da (Z. 590). Ohne die Prüfung der Art blockiert nichts mehr, denn der 31.03.2099 liegt in der Zukunft und ist gültig, also wird `submitted` aufgerufen (Z. 596).
- `Spec change approved: #1277` im Text von PR #1293 habe ich nicht gelesen.

Geprüft: Der neue Test deckt C-1 ab (ohne «Kündigung» kein Eingangsfeld) und ebenso C-2 (keine Vorauswahl; ein Tag ohne Art wird abgewiesen, mit dem Text aus `contracts_end_kind_required`). Die Hilfsfunktionen `fireEvent`, `click` und `settle` aus `helpers/dom.ts` werden richtig benutzt. Die Archivzeilen in `docs/archive/sessions/1277.md` stimmen mit dem Delta und dem gemeldeten Merge überein.
