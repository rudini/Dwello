# Code-Review #1130 / #1142, Runde 1

Gegenstand: `git diff 5af16a0 0f6e645 -- . ':!docs/reviews'`, Worktree `review-1130-code`.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine Befunde. |

## Nicht bestätigt

- Diese Checks hat der Aufrufer gemeldet, ich habe sie nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bun run fitness`, Backend-`type-check`, `bunx vitest run --changed origin/main` (529 bestanden), die Tests zu i18n, privacy, no-german, backend-codes und e2e-areas (565 bestanden), E2E `contract-new.feature` in Chromium (57 bestanden) und die Commit-Hooks.
- Die Rotphase des neuen Szenarios habe ich nur am Code beurteilt. Der Schritt prüft mit `toBe` auf den genauen Text. Mit dem alten Text von `contracts_apartment_help` schlägt er darum fehl.
- Ob die Beschreibung der Auswahl (`Accessible.descriptionOf(apartmentSelect)`) ausser der Hilfe noch weitere `aria-describedby`-Texte enthält, habe ich nicht im DOM nachgesehen. Im Szenario ist keine Wohnung gewählt, deshalb erscheint kein Hinweis «wird später frei». Der Aufrufer meldet das Szenario als grün.

Geprüft: Die drei Zeilen in `UBIQUITOUS_LANGUAGE.md` stimmen Wort für Wort mit den Vorschlägen überein (659 «Fehlende Begriffe», b665 «Fehlender Begriff»). Die drei Zeilen in `i18n-begriffe.md` und der Text von `contracts_apartment_help` in de/fr/it/en stimmen mit 1130-fachreview-1 überein (V-1, V-2). Der neue Text stimmt mit dem Code überein: Gesperrt ist nur eine Wohnung mit offenem Mietvertrag (`backend/src/services/apartment.service.ts:42-44`), und wählbare Wohnungen stehen zuerst (`src/lib/contract-wizard.ts:329`). Die Grundlage des Szenarios trägt den Schritt. Der Schritt ruft nur die Question auf, und die Formulierung ist fachlich, ohne UI-Wörter. Es gibt keinen neuen Bildschirmzustand, und der Diff enthält nichts, was nicht zur Anforderung gehört.
