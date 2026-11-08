# Code-Review 1264, Runde 3 (CI-Fix), Bereich 0c0f1a3..cde50f4

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: In `messages/fr.json:840`, `:841` und `:2048` und in den Pins in `src/__tests__/contracts-i18n.test.ts:107`, `:129` und `:157` steht jetzt U+00A0 direkt innerhalb von « und » (Byte-Ansicht des Diffs). Das Leerzeichen vor « ist ein normales Leerzeichen geblieben, und sonst wurde nichts geändert. Abgesehen von U+00A0 gegenüber dem normalen Leerzeichen entspricht der Wortlaut aller drei Schlüssel der Vorgabe aus `docs/reviews/1264-fachreview-1.md`, die selbst normale Leerzeichen setzt. Die Regel in `src/__tests__/i18n.test.ts:60-66` ist damit für diese drei Schlüssel erfüllt. Sonst pinnt kein Test und keine E2E-Datei diese französischen Texte. Der Diff enthält nichts, was nicht zum Fix gehört. Die Commit-Nachricht hält sich an die Konvention.

## Nicht bestätigt

- `i18n.test.ts` und `contracts-i18n.test.ts` mit 88 bestandenen Tests, `i18n.test.ts` vor dem Fix rot, der volle Lauf `bunx vitest run` mit 4589 bestandenen Tests und Lint: vom Aufrufer gemeldet.
- Ob noch andere Schlüssel in `messages/fr.json` gegen die Guillemet-Regel verstossen, habe ich nicht mit einem Testlauf geprüft. Laut Aufrufer meldete CI nur diese drei Schlüssel.
