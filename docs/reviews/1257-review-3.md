# Code-Review #1257, Runde 3 (Abschlussrunde, b67b82b..0136bf1, ohne docs/reviews)

Geschlossen: C-6, C-7

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-3 | Minor | backend/src/services/apartment.service.ts:280-293 | Noch offen wie in Runde 1 und 2: Prüfung und Löschen laufen ohne Transaktion. Wird dazwischen ein Mietvertrag erfasst, löscht `ON DELETE CASCADE` ihn mit der Wohnung. |

Im Delta gibt es keine neuen Befunde.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: auf 0136bf1 `bun run lint` und vitest `apartments-pages.dom.test.ts` (28 Tests). Auf a64bceb: volles `bunx vitest run` (4580), Backend `bun run test` (2102, 97.3 % Zeilen), `bun run fitness`, Backend `type-check`, E2E chromium `apartment-detail.feature` und `building-detail.feature` (37), axe- und Sprachzeilen `apartment-detail` (10). Den Rot-Lauf von C-7 («nur» aus de.json entfernt) meldet der Aufrufer. Nach dem Lesen kann er gar nicht anders als rot sein, weil der Test den Satz als Literal vergleicht. `bun run check` und die E2E auf 0136bf1 meldet der Aufrufer nicht. Die Änderung in `questions/apartment-detail.ts` tauscht nur ein Target gegen ein gleichwertiges; dass sie typprüft und grün läuft, habe ich nur gelesen, nicht ausgeführt.
- Weiterhin offen aus Runde 2: Ob der PR-Text `No scenario: <reason>` für den Alert ohne Code trägt, lässt sich erst nach dem Push prüfen.

Geprüft: Das Literal im DOM-Test stimmt Zeichen für Zeichen mit `messages/de.json:225` und mit dem deutschen Text in `docs/reviews/1257-fachreview-2.md:31` überein. `successToast` (`tests/e2e/targets/form.ts:13`) zeigt auf denselben Locator `toast-success` wie das entfernte `deletedToast`. Von `deletedToast` ist kein Verweis mehr übrig. Das Delta ändert nur Tests, und die Screenplay-Schichten bleiben eingehalten.
