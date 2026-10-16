# Review: CI-Fix Zustand `statements pdf-missing` (dc8babe..2be4f7f)

Worktree: review-list-code4 (detached bei 2be4f7f). Delta: nur `tests/a11y/screens.json` (2 Zeilen).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Nit | tests/a11y/screens.json:347 | Die Diagnose des Aufrufers stimmt nicht ganz: Auf dc8babe hat das Beispiel `statements pdf-missing` **gar nichts** angelegt. `seedFor` (tests/e2e/fixtures/screens.ts:38) legt Daten nur an, wenn der Pfad ein `{…}` enthält oder der Zustand in der Ausnahmeliste steht. `?status=draft` hat keinen Platzhalter, und `pdf-missing` steht nicht in der Liste. Der Zustand lebte also nur von Entwürfen anderer Szenarien. Lokal liefen solche gerade mit, auf CI waren es auf Seite 1 offenbar nur Entwürfe mit PDF. Der Fix ist trotzdem richtig, und zwar aus einem stärkeren Grund: Erst `{building}` sorgt dafür, dass die eigenen Seeblick-Entwürfe überhaupt angelegt werden. Gilt nur für die Beschreibung im PR bzw. Commit, nicht für den Code. |

Keine Blocker oder Majors.

## Geprüft (bestätigt durch Code)

- **Filter wirkt auf die Liste:** `building` wird in `FILTERS` (src/routes/statements/+page.server.ts:32) auf `buildingId` abgebildet. Das Backend nimmt `buildingId` an (backend/src/routes/statements.ts:45/66) und filtert über `apartments.buildingId` (backend/src/services/statement.service.ts:102).
- **Platzhalter wird ersetzt:** `{building}` wird zu `seed.idOf('Seeblick')` (screens.ts, `ids.building`). Diese ID gehört zum eigenen Szenario, weil `unique()` jeden Namen mit einer UUID versieht. Parallele Szenarien kennen die ID nicht und können die Entwürfe nicht ändern.
- **Entwürfe ohne PDF im Gebäude:** Angelegt werden `statement` Anna 2025, Carla 2023 und Anna, Bruno, Carla 2024. Das sind 5 Entwürfe; Bruno 2025 wird auf `sent` gesetzt. Kein Seed-Schritt ruft `statementPdf` auf, und `sendStatement` setzt nur den Status. Bei Seitengrösse 10 (+page.server.ts:59) liegen alle 5 auf Seite 1.
- **Zustand erzeugt kein PDF:** `'pdf-missing'` in tests/e2e/tasks/accessibility.ts:227 wartet nur auf `statement-pdf-missing`. Kein anderer Zustand desselben Beispiels läuft dazwischen, denn jede Tabellenzeile ist ein eigenes Beispiel mit eigenem Seed.
- **Anzeige:** `statement-pdf-missing` erscheint, wenn `pdfGeneratedAt` fehlt (src/routes/statements/StatementRow.svelte:65–80).
- **Sprachprüfung:** Die neuen Daten in der Liste sind Nutzerdaten mit UUID-Namen, genau wie bei den übrigen geseedeten Zuständen.
- **Bedeutungstext** in `stateMeanings` ist nachgeführt und passt jetzt zum Verhalten.
- **Konventionen und Umfang:** Das Delta betrifft nur die Anforderung (#253 bzw. den CI-Fehler) und enthält keine fremden Änderungen. Keine neuen UI-Texte, kein neuer Bildschirm: Die Zeilen in `accessibility.feature` und `sprachen-bildschirme.feature` gibt es schon (Zeile 112/113).
- **Merge dc8babe:** nicht Teil des Deltas. Laut Aufrufer betraf der einzige Konflikt die Archivdatei. Nicht geprüft, weil ausserhalb von dc8babe..2be4f7f.

## Nicht bestätigt

- **Ob CI mit dem Fix grün wird:** Das braucht die parallele Last auf CI und lässt sich nur durch einen CI-Lauf zeigen. Dass der Fix vorher gefehlt hat, sieht man am Code (C-1): Ohne Seed kann die alte Abfrage leer oder ohne passende Zeile sein.
- **Lokal grün:** die 12 Zeilen axe/Sprache von `statements`, dazu lint, check und vitest (2637). Alles vom Aufrufer gemeldet, nicht selbst wiederholt.
- **`tests/unit/a11y-screens.test.ts` und `i18n-screens.test.ts`** (lesen screens.json): nicht selbst ausgeführt. Der Zugriff auf `node_modules` im Worktree verweist auf das Arbeitsverzeichnis des Aufrufers und wurde blockiert. Gelesen habe ich die Prüfung `stateMeanings` (a11y-screens.test.ts:22): Sie bleibt erfüllt, weil der Schlüssel `pdf-missing` weiter existiert. vom Aufrufer gemeldet (Teil von vitest 2637).
