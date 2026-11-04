# Code-Review #1096, Slice 2 (2abe629db..149a5fe05), Runde 1 (mit Nachprüfung von Review 1096-1)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Geschlossen (aus `docs/reviews/1096-review-1.md`): C-1, C-2, C-3.

## Nicht bestätigt

- Vom Aufrufer gemeldet: lint, svelte-check, `vitest run src/__tests__/ui-layout-parts.dom.test.ts` (18 bestanden, beide neuen Tests zuerst rot, der Platzierungstest auch ohne `onfocusin` rot). Ebenfalls gemeldet: Chromium-E2E des Szenarios «Eine neue Erfolgsmeldung ersetzt die ältere», zuerst rot (die ältere Meldung stand noch), dann grün.
- Ob die erste Erfolgsmeldung im E2E-Szenario schon sichtbar ist, bevor das zweite Löschen beginnt: `deleteCategory` (tests/e2e/tasks/categories.ts:61-62, ausserhalb des Diffs) wartet nach dem Bestätigen auf nichts. Der rote Lauf, den der Aufrufer meldet, spricht dafür. Das Ersetzen einer schon gezeigten Meldung prüft zudem der DOM-Test (ui-layout-parts.dom.test.ts:119-136, 1000 ms zwischen den Meldungen). Ausgeführt habe ich nichts.
- Ob der Standard-Timeout von `expect.poll` (tests/e2e/screenplay/actor.ts:48) unter den 8 s Lesezeit liegt: Läge er darüber, könnte die ältere Meldung von selbst verschwinden, und der Schritt würde auch ohne die Änderung grün. Den Timeout in der Playwright-Konfiguration habe ich nicht nachgesehen. Der gemeldete rote Lauf spricht dagegen.

Geprüft: `addToast` (stores.ts:41-45) entfernt beim Hinzufügen nur ältere `success`-Meldungen; Fehler, Warnungen und Hinweise bleiben, wie #1096 «Decided» es verlangt. `region.contains(focused)` (ToastRegion.svelte:49-50) behebt C-1, der DOM-Test ist ohne Fix rot (jsdom-Rechteck 0 → `atTop` false) und ohne `onfocusin` ebenfalls (C-2). Der Kommentar in interactions.ts:108 ist berichtigt (C-3). Bestehende Tasks und Questions auf `successToast` (`Wait.until`, `Text.of` mit `single`) verhalten sich nicht schlechter. Der Schritt ruft nur eine Question auf, und die antwortet mit den Texten. Das Feature sagt, was der Liegenschaftsverwalter will. Es gibt keine neuen Texte, Bildschirme, Zustände oder Verträge und nichts Fremdes im Diff. ponytail-review findet nichts.
