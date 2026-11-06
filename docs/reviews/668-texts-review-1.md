# Code-Review Slice 668-texts, Runde 1 (8497f84..dfb15f9)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine Befunde. |

Geprüft: H15-9: `apartmentName` (`src/lib/contract-form.ts:237-239`) dient `apartmentOption`, `contractSummary` und `contracts/[id]/edit/+page.server.ts:36`; im Wizard bleibt kein « - » zwischen Wohnung und Gebäude, die Bearbeitungsseite zeigt dasselbe wie vorher (sie schrieb schon «·»); `m` wird nur beim Aufruf gelesen. H15-3: de/fr/it/en der drei Keys stimmen Zeichen für Zeichen mit dem Wortlaut in `docs/reviews/668-fachreview-1.md` überein, fr hat U+00A0 vor «?» und innerhalb von « » (Titel, Text, Link). Unit-Tests (`contract-form.test.ts`, `contract-wizard.test.ts`, `contracts-i18n.test.ts`) und DOM-Test (`contract-edit.dom.test.ts:982-1000`, Titel, dritter Satz, Link) wären auf der Basis rot; die drei Szenarien (bisher `@wip`, Schritte seit 84e7003, Screenplay-konform) schlagen auf der Basis an «-» bzw. am alten Titel fehl. Kein neuer Bildschirm oder Zustand (nur Text im bestehenden Hinweis), keine API-Änderung, nichts Unbezogenes im Diff, ponytail-review ohne Befund.

## Nicht bestätigt

- vitest 4206 bestanden, E2E contract-edit und contract-new 94 bestanden, axe-Zeilen 8 bestanden, lint sauber, Rotläufe für Unit-, DOM- und E2E-Tests: vom Aufrufer gemeldet.
- Die Mieterliste schreibt weiter «Wohnung 2.01 - Ahornhof» (`src/__tests__/tenant-list.test.ts:57`); das ist nicht Teil der Anforderung (Wizard wie Vertragsseiten) und kein Befund dieses Diffs. Ob #668 sie einschliesst, habe ich nicht geprüft (Issue nicht gelesen).
