# Review Slice 974, Runde 1 (ee1714f93..6fe5ddd99)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | docs/architecture/utility-tree.md:99 | «die Dauer wächst etwa mit der Grösse, die Grenze läge bei rund 8 GB» folgt nicht aus den beiden Messpunkten: 2,33-fache Grösse (1,2 auf 2,8 GB) ergibt die 4-fache Dauer (24 auf 97 s), also ein überlineares Wachstum. Linear ab 97 s gerechnet ergibt das rund 8,7 GB; mit dem gemessenen Exponenten (etwa 1,65) läge die Grenze bei etwa 5,5 GB. Der Satz sollte keine Linearität behaupten. Die Grenze ist entweder vorsichtig zu nennen (etwa «zwischen 5 und 8 GB») oder wegzulassen. |
| C-2 | Minor | tools/fitness/restore-check.ts:65-73 | Der neue `contains` mit dem Übertrag (`tail`) über die 16-MB-Stücke hat keinen Test. CI (`upgrade-check.sh`) führt nur den Fall ohne Treffer aus. Ob ein Klartext gefunden wird, der über die Grenze zweier Stücke reicht, oder überhaupt ein Klartext, zeigt keine Prüfung: Ein `contains`, der immer `false` liefert, bliebe grün. Den Pfad mit Treffer prüfte schon die Basis nicht, die Änderung macht die Logik aber verwickelter. |
| C-3 | Minor | tools/fitness/r1-benchmark.ts:85 | Das Verzeichnis aus `mkdtempSync` mit der Sicherung (0,9 bis 2 GB) wird nie gelöscht. Jeder Lauf lässt sie in `tmpdir()` liegen, und wiederholte Läufe füllen die Platte. Die Kopfzeile (Z. 5) nennt nur die beiden Datenbanken, die neu angelegt werden. |

Keine Blocker oder Major.

Ponytail-review: Schlank, nichts zu streichen.

Geprüft: Alle 5 geänderten Dateien sind gelesen. Die Anforderungen sind durch den Code belegt:
- Mengen: 5 Liegenschaften und 50 Wohnungen; 75 Mietverträge (je Liegenschaft 10 und 5 Nachmieter); Jahre 2016–2025; 2000 Belege über SQL; 500 PDFs als `documents` der Mieter. Die Zahlen in den Docs stimmen damit überein.
- Ablauf: Sicherung und Restore laufen über `restore-check.ts` mit diesem Checkout. Ausgegeben werden DB-Grösse, Grösse und Dauer der Sicherung sowie die Dauer des Restore. Über 300 s scheitert `restore-check`, und `execFileSync` wirft.
- Optionen und Doku: `--belege`, `--beleg-kb` und `--pdf-kb` haben Defaults mit Zufallsinhalt. R1 «Heute» und A2 sind nachgeführt, die Mengen sind dem PO zur Bestätigung genannt.
- Streaming-Fix: Der Übertrag (`tail`) ist so lang wie der längste Suchtext und deckt damit Treffer über die Stückgrenze ab. `latin1` arbeitet bytegenau.
- Rahmen: Die Namen «Benchmark-b-a» sind lang genug gegen Zufallstreffer. Der Diff enthält nichts, was nicht zur Anforderung gehört. `No scenario` ist für ein Messskript zulässig.

## Nicht bestätigt

- Vom Aufrufer gemeldet:
  - `bun run lint` und `bun run fitness`;
  - Prettier auf der neuen Datei und den geänderten Zeilen (`.prettierignore` schliesst `tools/` aus, die Prüfung der neuen Datei ist also leer);
  - der kleine Lauf `fitness:r1 -- --belege 2 --beleg-kb 10 --pdf-kb 10`;
  - die vollen Läufe (Defaults und `--beleg-kb 1000`) mit den Messwerten in den Docs;
  - der ENOMEM-Fehler vor dem Streaming-Fix.
- Nicht gemeldet und nicht laufen gelassen:
  - `bun run check`: `tsconfig.json:23` schliesst `tools/**/*.ts` ein und prüft damit `r1-benchmark.ts` auf Typen;
  - der Lauf von `upgrade-check.sh` in CI mit dem geänderten `restore-check.ts`.
