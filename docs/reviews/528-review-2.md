# Code-Review #528, Runde 2 (Delta `git diff 7e22d79 23f44db`, Commits 901a7aa, 23f44db)

Geschlossen: C-2, C-3, C-6, C-7, C-8, C-9, C-10. C-1 abgelehnt (Begründung des Aufrufers: Hintergrund mit Heizung CHF 1000 «Pro Fläche (m²)»; nicht erneut geprüft, kein Teil des Deltas). C-4, C-5 bleiben als Minor im Bericht 528-1.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-11 | Major | src/routes/statements/[id]/+page.svelte:228-231, backend/src/services/statement.service.ts:330, :344; Commit 23f44db | P-1 ändert, was der Entwurf zeigt (Hinweis folgt den gespeicherten Positionen statt den Rechnungen), ohne Szenario in `tests/e2e/features` und ohne `No scenario: <reason>` |
| C-12 | Minor | src/routes/statements/generate/PreviewChecks.svelte:56-60 | Die Zuordnung von `buildingId`/`buildingName` je Vorschau-Zeile ist ungetestet: der neue DOM-Test mountet `SplitKeysHint` direkt mit fertigen Gebäudenamen; nimmt man die `map` in PreviewChecks wieder heraus, bleibt jeder Test grün |
| C-13 | Minor | backend/src/services/statement.service.ts:344 | Der Hinweis des Entwurfs nennt jetzt die gespeicherten Rechnungen der Positionen (`lineItems[].invoices`): eine seit dem Erstellen gelöschte Rechnung steht mit ihrer alten Beschreibung im Hinweis, und ihr Link führt auf «nicht gefunden»; der Text «ändern Sie den Verteilschlüssel der Rechnung» ist dann nicht ausführbar |
| C-14 | Minor | docs/api-specification.md:293 | `GET /statements/:id` liefert seit 23f44db `splitKeys` (Vertrag `tests/contracts/statement.json` hat es), die Beschreibung der Antwort nennt es nicht |

## C-11 (Major): Verhaltensänderung P-1 ohne Szenario

**Beleg.** Bis 7e22d79 zeigte der Entwurf den Hinweis aus `data.later.splitKeys` (Rechnungen, wie sie jetzt sind); 23f44db zeigt ihn aus `statement.splitKeys`, gebildet in `withOtherKeys` aus den gespeicherten Positionen. Das sieht der Liegenschaftsverwalter genau im Fall der Persona: Verteilschlüssel einer Rechnung nach dem Erstellen geändert, Entwurf noch nicht neu berechnet: vorher Hinweis «… steht in mehreren Positionen», jetzt keiner (und umgekehrt bleibt er nach dem Zurückstellen stehen, bis neu berechnet ist). `git diff 7e22d79 23f44db -- tests/e2e` ist leer; die Szenarien statement-detail.feature:828-861 erstellen den Entwurf erst nach dem Erfassen der Rechnungen (Positionen und Rechnungen stimmen überein) oder prüfen nur die Frage (Z. 854). Der Commit-Text nennt kein `No scenario:`.

**Warum falsch.** `CLAUDE.md`, Workflow 1: jede Verhaltensänderung, auch eine sichtbare Fehlerbehebung (hier ein Persona-Major), beginnt mit einem Szenario; pg-Test und DOM-Test decken die Schichten darunter ab, das E2E-Stack kann den Zustand ohne weiteres herstellen (Schritt «die Rechnung von … wird nach dem Verteilschlüssel … verteilt» existiert, Z. 858).

**Zeigen.** Ein neues Szenario wie Z. 854, aber mit der Rechnung «Pro Fläche (m²)» beim Erstellen und der Änderung auf «Pro Einheit» danach: «Dann sagt der Entwurf nicht, dass "Hauswart" mit verschiedenen Verteilschlüsseln abgerechnet wird» und «Wenn … «Neu berechnen» wählt, Dann nennt die Frage … die Rechnung "Hauswart 2024-12-31" mit "Pro Einheit"». Auf 7e22d79 schlägt der erste Schritt fehl (Hinweis sichtbar), auf 23f44db hält er.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, Backend `bun run type-check`, `bunx vitest run --changed origin/main` (1101), Backend `bun test` statement-split-keys.pg.test.ts, api-contracts.pg.test.ts, statement-pdf-data.test.ts, split-keys.test.ts; E2E chromium aller `statement-*`-Features (289, auf 7e22d79, nicht auf 23f44db) und der Verteilschlüssel-Szenarien samt axe-/Sprachzeilen der neuen Zustände (35, auf 23f44db); Rotläufe des pg-Tests zu P-1 und des DOM-Tests «nennt auf dem Entwurf nichts …» (beim Lesen: beide wären auf 7e22d79 rot).
- Ob die Gebäudezeile in der Vorschau (`SplitKeysHint.svelte:30`) im E2E-Zustand `statement-generate split-keys` die Prüfungen der Vorschau-Schritte berührt: nur die 35 gemeldeten Szenarien, Schritte nicht nachgelesen.
- C-1: Hintergrund des Tank-Szenarios nicht erneut gelesen (ausserhalb des Deltas).

Geprüft: alle Dateien des Deltas; C-2 (`invoiceSplitKeys` nur noch in `statementChanges`), C-3 (Schlüssel mit `buildingId`, Gebäudename je Zeile, DOM-Test), C-6 bis C-10 (fr.json mit U+00A0, JSDoc-Reihenfolge, API-Doku, Test von `localSplitKeys`), P-3 in allen vier `messages/*.json`, Vertrag `statement.json`, Token `font-semibold`.
