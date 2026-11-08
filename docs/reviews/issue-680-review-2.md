# Review #680, Runde 2 (`git diff 1b71633 5f747c5`, ohne docs/reviews und docs/design/personas)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde. |

Geschlossen: C-1, C-2

Geprüft: alle sechs geänderten Dateien. C-2: `restored()` (`src/lib/utils/list-filter.ts:26-28`) setzt beim ersten Aufbau jetzt bei jedem Ladetyp ausser `navigate` zurück, also bei `reload` und `back_forward`. Nur ein frisches Laden behält einen früh getippten Text (#754). Der Kommentar und JSDoc sagen das richtig. Fehlt der Eintrag, setzt der Code ebenfalls zurück. Das widerspricht #680 nicht und betrifft keinen unterstützten Browser. C-1: Der `it.each` in `src/__tests__/list-filters.dom.test.ts:259-277` deckt alle drei Ladetypen auf allen Listen ab. Ohne den Guard `navigation.type !== 'enter' ||` wird `navigate` rot, mit dem alten Vergleich `=== 'back_forward'` wird `reload` rot. Der Stub von `performance.getEntriesByType` wird vor dem `expect` wieder entfernt. Die `afterNavigate`-Mocks in den drei Seiten-DOM-Tests und der Stub in `form-selects.dom.test.ts` ergänzen nur, was der Code von Runde 1 verlangt. Sie lockern keine Prüfung. ponytail-review: kein Befund. Es gibt keine neuen Texte, Bildschirme, API-Änderungen oder E2E-Änderungen und nichts, was nicht zur Anforderung gehört. Helga H-1 ist entschiedenes Verhalten (#662/#680, siehe JSDoc von `applyFilterChoice`); die Zurückweisung trägt.

## Nicht bestätigt

- Vom Aufrufer gemeldet: vitest vollständig mit 4714 bestanden; der `reload`-Test war vor dem Fix rot, der `navigate`-Test rot, wenn man den `enter`-Guard herausnimmt.
- Vom Aufrufer gemeldet: die sechs Listen-Features auf Chromium mit 144 bestanden; lint und svelte-check sauber, nach dem Merge vor dem Push neu auszuführen.
- Zurücksetzen beim Neuladen in Firefox, also ob Firefox den getippten Text vor oder nach der Hydration wiederherstellt: Das zeigt kein Test. Der E2E-Stack läuft nur auf Chromium, und der DOM-Test stubbt den Ladetyp. Ich habe nur den Code gelesen.
- Der Merge-Commit 9b68c2f: wie verlangt nicht geprüft.
