# Code-Review #698, Runde 1 (Commit 119a7860)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | src/lib/contract-form.ts:51-53 | `advanceHelp` steht zwischen dem Kommentar «A date field typed over can end up in year 12026 …» und `impossibleYear`, zu dem der Kommentar gehört. Er steht jetzt über der Akonto-Hilfe und beschreibt dort etwas Falsches. `advanceHelp` gehört über den Kommentar oder an eine andere Stelle. |

Keine Blocker, keine Major.

Geprüft: Die fünf Hilfetexte (config/help.ts mit Heizprofile-Seite, Verteilschlüssel-Seite, DefaultsSection und Einstellungen; RentStep und ContractForm über `advanceHelp()`; TenantFormFields) beginnen mit `m.glossary_<x>_text()`. Die ersetzten Schlüssel sind in allen vier `messages/*.json` entfernt, im Code wird keiner mehr verwendet. Die Texte nach dem Glossartext sind in allen vier Sprachen vorhanden und im Test gepinnt. Die bestehenden Szenarien (#66 Akonto, #452 Punkt 7) und die geänderten Unit-Assertions prüfen nicht weniger als vorher. Die fünf neuen Szenarien und der Unit-Test wären auf der Basis rot, weil jeder alte Text anders beginnt («Bestimmt, wie», «Abgeltung», «Monatlicher», «Wie der Mieter», «… 12 Monate.»). Die Screenplay-Schichten sind eingehalten (Task mit `Text.of` aus `screenplay/`, Frage `Accessible.descriptionOf`). Die Features enthalten keine UI-Wörter, die Daten sind isoliert, es gibt keinen neuen Bildschirmzustand. ponytail-review: kein ungenutzter Code, keine Kopie eines bestehenden Helfers.

## Nicht bestätigt

- Der gemeldete Bereich `git diff 91245935 119a7860` umfasst 91 Dateien. 91245935 ist nicht die Eltern-Revision der beiden Commits, sondern eine ältere Basis vor dem Merge von #1353 (#1309/#1314). Ich habe nur `347c8bf9..119a7860` geprüft (4bc416bf, 119a7860; 21 Dateien).
- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bunx vitest run` (228 Dateien, 4787 Tests), `bun run lint`, `bun run check`, `bun run fitness -- --base origin/main`, Backend-Type-Check, Prettier auf neuen Dateien. Ebenso die E2E-Läufe in Chromium (die fünf neuen Szenarien zuerst rot, dann grün; heating-profiles, distribution-keys, settings, contract-new, tenant-new, tenant-edit, contract-edit, Hilfe; axe- und Sprachzeilen; 71 bestanden) und der Rotlauf des Unit-Tests vor dem Code.
- Den Wortlaut der fr/it/en-Texte gegen docs/reviews/698-fachreview-1.md habe ich nicht verglichen (docs/reviews ist vom Bereich ausgenommen). Geprüft ist nur, dass der Test sie wörtlich pinnt.
