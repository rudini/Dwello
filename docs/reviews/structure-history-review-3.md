# Code-Review: Strukturbericht-Verlauf, Abschlussrunde 1 (Delta 12945de07..389c64f33)

| ID | Schweregrad | Datei:Zeile | Befund |
| --- | --- | --- | --- |
| – | – | – | Keine offenen und keine neuen Befunde. |

Geschlossen: C-3, C-4

- C-3: `tools/arch-baseline/structure-history.sh:12` nimmt das Skript in den Fingerabdruck auf (`TOOLS`), und `.github/workflows/structure-report.yml:39-40` nimmt es in `hashFiles` auf, gleich in `key` und `restore-keys`. Eine Änderung nur am Skript verwirft damit den Cache lokal und in CI.
- C-4: Der Kommentar in `structure-history.sh:22` beschreibt jetzt, was die Schleife tut: Snapshots von Commits, die nicht mehr ausgewählt werden (ein späterer Commit am selben Tag, ein früherer HEAD). Das deckt sich mit der Auswahl in den Zeilen 17-21.

Geprüft: beide Dateien des Deltas vollständig gelesen; die Liste der Eingaben ist in Skript und Workflow gleich; der Kommentar in Zeile 5 stimmt mit dem Code überein; kein Test liest eine der beiden Dateien als Text; nichts im Delta hat mit der Anforderung nichts zu tun.

## Nicht bestätigt

- `bash -n` auf das Skript und Prettier auf den Workflow, beide für 389c64f33: vom Aufrufer gemeldet.
- vitest für tools/arch-baseline und open-work (36 bestanden), eslint, die Audits von testcheck und deepcheck, `bun run structure:report` von Anfang bis Ende: vom Aufrufer gemeldet, und zwar für 12945de07, also vor diesem Delta. Für 389c64f33 hat sie niemand ausgeführt.
- Das Verhalten in CI, also ob ein Cache-Treffer bzw. -Fehlschlag nach einer Änderung am Skript wirklich eintritt: nur anhand der `hashFiles`-Liste beurteilt, ohne Lauf.
- Den Merge e05856753 habe ich nicht geprüft, weil der Aufrufer ihn als konfliktfrei meldet und ausserhalb des Umfangs nennt.
