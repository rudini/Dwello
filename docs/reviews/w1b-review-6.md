# Code-Review Runde 6 (abschliessend vor Push): Merge 19bf933 (origin/main W4b in claude/statement-detail-96-104)

Geprüft: `git show 19bf933 --cc` im Worktree `review-s6-code` (detached an 19bf933). Konfliktaufloesung in `tests/e2e/fixtures/screens.ts` und `docs/archive/implementation-plan-verlauf.md`, automatisch zusammengefuehrt `tests/contracts/README.md`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

## Begruendung

- **Eindeutige Seed-Namen:** In `seedFor` (`tests/e2e/fixtures/screens.ts:37-112`) sind die Mieter Anna, Bruno, Carla, Dora, Greta, Emil, Fritz, die Gebaeude Seeblick, Bergsicht, Talblick und die Wohnungen 1.01-1.04, 2.01-2.03, 3.01 je einmal angelegt. `idOf` liest aus einer Map nach Titel (`tests/e2e/fixtures/backend.ts:106`, `ids.set(title, ...)`); mit zwei «Emil» haette der zweite Eintrag den ersten ueberschrieben und `endedContract`/`partsStatement` haetten auf denselben Mieter gezeigt. Nach der Umbenennung zeigen `endedContract: idOf('Mietvertrag Emil')` (Bergsicht 2.02, 2010-2014) und `partsStatement: idOf('Abrechnung Greta 2025')` (Talblick 3.01) auf getrennte Datensaetze. Kein anderer Test oder Step nennt «Emil» oder «Greta» (grep in `tests/`, `src/`).
- **Gegenseitige Sicht der Bildschirme:** `statement-parts-detail` zeigt nur die Abrechnung Greta 2025 in Talblick (eigenes Gebaeude, eigene Rechnungen und Tankbestaende); die neuen Wohnungen 2.02/2.03 von main liegen in Bergsicht und gehen in deren Verteilung nicht ein. `apartment-detail-vacant` (2.02) und `contract-detail-ended` (Emil, inkl. `delete-dialog`, der sagt, ob Abrechnungen bestehen) haben keine Abrechnung; Gretas Abrechnung haengt an einem anderen Mietvertrag. Talblick erscheint in Listen-/Uebersichtsbildschirmen schon auf dem Branch vor dem Merge; 3.01 ist seit 2025-08-15 vermietet, loest also weder «Leer seit» noch «Wohnung {Nr} leer» aus. `tankBuilding` bleibt Bergsicht (ohne Tankbestand), Talblick hat Tankbestaende und aendert die Tankfrage nicht.
- **Sprachpruefung:** `tests/e2e/questions/language.ts` vergleicht mit Texten aus `messages/de.json`; «Greta» ist kein solcher Text.
- **Texte:** `messages/{de,fr,it,en}.json` haben nach dem Merge je 1543 Schluessel.
- **Plan-Archiv:** beide Sessions vollstaendig erhalten, die W4b-Session vor der W1b-Session; die W1b-Session ist eine Archivkopie, ihre Notiz «seed: Emil 2.02» in der W4b-Session stimmt weiterhin.
- **contracts/README.md:** beide neuen Zeilen (`apartments.json` von main, `statement-changed-invoices.json`/`invoice-statements.json` vom Branch) vorhanden.
- Von main geaenderter gemeinsamer Code (`src/lib/contract-status.ts` `historyPeriod`, `types.ts` `isFuture`/`lastContractEnd`/`reletStarts`) beruehrt die Statement-Dateien des Branches nicht.

## Nicht bestaetigt

- lint, check, vitest (2740), Backend-Tests (773, Coverage 94,4 %): vom Aufrufer gemeldet, nicht erneut ausgefuehrt.
- E2E von accessibility, sprachen-bildschirme, statement-detail, invoice-detail, apartment-detail: laeuft laut Aufrufer noch, Ergebnis nicht gesehen. Dass `statement-parts-detail`, `apartment-detail-vacant` und `contract-detail-ended` nach dem Merge axe-frei und ohne Deutsch sind, ist nur durch Lesen der Seed-Daten gestuetzt.
- Die uebrigen von main uebernommenen Dateien (W4b) sind in PR #316 reviewt und hier nicht erneut geprueft; die kombinierte Diff zeigt ausser den drei oben genannten Dateien keine Aenderung durch den Merge.
