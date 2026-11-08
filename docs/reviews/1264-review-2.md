# Code-Review 1264, Runde 2 (Abschlussrunde, Delta ad49ee0..2585efd)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde |

Geschlossen: C-1

Geprüft: `contracts_apartment_help` in messages/{de,fr,it,en}.json:836 stimmt Wort für Wort mit dem Vorschlag in #1287 (Option 2, «Decided (product owner)») und docs/reviews/1264-fachreview-1.md:20 überein; die Pins in src/__tests__/contracts-i18n.test.ts:148-171 nennen dieselben vier Texte und schlagen mit den alten Texten fehl (rot beim Lesen bestätigt); die Szenariozeilen contract-new.feature:91 (auf origin/main ohne `@wip`, `Spec change approved: #1287` in der Commit-Nachricht) und :273 (Szenario «Die Hilfe zur Wohnung erklärt «nicht geprüft»» nur in diesem Branch, nicht auf origin/main) folgen dem neuen Text, und ApartmentStep.svelte:45-46 setzt die Hilfe so zusammen; der alte Wortlaut kommt in src, tests und messages nicht mehr vor; C-1: contract-form.steps.ts:374 nutzt `escapeRegExp` aus tests/e2e/questions/pattern.ts (dort wird zusätzlich `/` maskiert, das ändert am Ergebnis nichts), der Import kommt aus der Schicht questions; ponytail-review: kein unbenutzter Code, keine Kopie eines Helfers (die eigene Kopie der Maskierung ist mit C-1 weggefallen); im Delta nichts, was nicht zur Anforderung gehört.

## Nicht bestätigt

- lint, check, fitness auf 2585efd: vom Aufrufer gemeldet.
- vitest contracts-i18n / contract-wizard.dom (77 bestanden, #1287-Pins rot gesehen): vom Aufrufer gemeldet.
- E2E contract-new.feature chromium (61 bestanden): vom Aufrufer gemeldet.
- axe- und Sprachzeilen contract-new contracts-unknown / apartment-cleared, contract-edit contracts-unknown (6 bestanden): vom Aufrufer gemeldet.
- Die vollen Prüfungen auf dem Merge-Commit c9db890: laufen laut Aufrufer noch, Ergebnis nicht gesehen. Den Merge habe ich nicht über das Delta hinaus angesehen (laut Aufrufer konfliktfrei).
- #1287 ist noch offen (gh api, state «open»); das Schliessen gehört zum Pull Request, nicht zu diesem Delta.
