# Code-Review b665, Runde 2 (389fbd2..86ec2e4)

Geschlossen: C-1

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-2 | Minor | tools/arch-baseline/layers.json:46, tools/fitness/ratchet.json:655-657 | Die Aufteilung ist legitim: #1052 verlangt für `fe:ui` ausdrücklich Untermodule in `layers.json`, «where their folders already group them», und `illustrations/` ist ein solcher Ordner (11 Dateien, nur von Illustration und EmptyState importiert). Danach hätte aber `fe:ui` in `ratchet.json` gesenkt werden müssen, und das fehlt. Der Eintrag steht weiter bei `files: 56`, obwohl `fe:ui` jetzt 46 Produktivdateien hat (`find src/lib/ui -type f` ohne `illustrations/`). #1052 («After each split, `bun run fitness -- --update` lowers the limits») und fitness-functions.md §2 («Verbesserung festschreiben … wird mit der Verbesserung committet») schreiben das vor. So hat `fe:ui` 10 Dateien Spielraum, die keine Prüfung meldet. Erst damit spielt die Aufteilung den Ratchet tatsächlich aus. Fix: `bun run fitness -- --update`, damit `fe:ui.files` auf 46 sinkt. |

## Nicht bestätigt

- Vom Aufrufer gemeldet: vitest komplett (4181), check, lint, `fitness --base origin/main` sauber, fallow sauber auf 8c17129, E2E chromium contract-new und contract-edit (84), axe und Sprachzeilen (64), Rot-Läufe für V-1 und für die Text-DOM-Tests.
- Ob `fitness` nach der Aufteilung für das neue Modul `fe:ui/illustrations` einen Eintrag oder eine Meldung erwartet (Ce, Zyklus): Ich habe nur gelesen, `tools/fitness/fitness.ts` nicht ausgeführt.

Geprüft: Alle drei Schlüssel in de, fr, it und en stimmen Zeichen für Zeichen mit der Tabelle in #666 überein. Per Skript verglichen: Der einzige Unterschied ist U+00A0 in « Réessayer » (fr), wie die Fussnote des Issues es verlangt. Gegenüber main (4890f38) haben sich in den Szenarien ohne `@wip` nur die vier freigegebenen Zeilen geändert. Alle übrigen Änderungen stehen in Szenarien, die auf main fehlen. Alte Texte finden sich nirgends mehr in src/tests. Die Markierung `TODO(fachlich prüfen, #1142)` steht in ContractsUnknown.svelte:29, und #1142 ist offen (`domain`, `needs-decision`). V-1: `describedby` nennt zuerst den Titel, dann den Text. Das gilt für Wohnung (Assistent) und Vertragsbeginn (Assistent und Bearbeitung). Die IDs sind pro `testid` eindeutig, und die DOM-Tests sowie die Screenreader-Szenarien wären ohne `titleId` oder mit dem alten Text rot. C-1 ist behoben: Region und Test sind entfernt, der Kommentar in PeriodStep.svelte stimmt (die Ansage kommt aus der LiveRegion in ApartmentStep.svelte). Die Steps rufen nur Questions auf. Die Commit-Betreffe haben höchstens 50 Zeichen.
