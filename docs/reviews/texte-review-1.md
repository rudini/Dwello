# Code-Review Slice «texte», Runde 1 (Abschluss), Commit 42ffbbc

Bereich: `git diff 6a662f2 42ffbbc -- . ':!docs/reviews' ':!implementation_plan.md' ':!docs/archive'` (8 Dateien, Commits 34d5095, 42ffbbc)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Geprüft: Die neuen Sätze in `messages/{de,fr,it,en}.json` (`settings_updates_check_help` Schlusssatz, `backup_location` zweiter Satz) stimmen Zeichen für Zeichen mit der Tabelle in `docs/reviews/texte-fachreview-1.md:10–11` überein, der Rest beider Texte ist unverändert, «Schalten Sie die Suche aus …» bleibt; de `backup_location` entspricht der Glossarzeile «Sicherung» (`UBIQUITOUS_LANGUAGE.md:290`); `settings.feature:118–122` (Kommentar, Titel, Zitat) und `sicherung.feature:103` ändern nur, was #1456/#1457 freigeben, die Schritte «beim Schalter» (Z. 114/116) bleiben; die Schrittdefinitionen (`settings.steps.ts:106`, `sicherung.steps.ts:90`) bleiben unverändert (`toContain`), also nicht lockerer; kein anderes Zitat der alten Sätze in `src`, `backend/src`, `tests`, `messages` ausser dem vom PO belassenen Testtitel `backup.pg.test.ts:365`; die Unit-Tests prüfen, was ihre Titel sagen (`endsWith` mit führendem Leerzeichen für den Schlusssatz, `toContain` mit Leerzeichen beidseits für den mittleren Satz) und schlagen ohne die neuen Texte in allen vier Sprachen fehl; kein neuer Bildschirmzustand, daher keine Zeilen in `screens.json`/Accessibility-/Sprachen-Features nötig; ponytail-review: kein ungenutzter Code, keine Kopie eines bestehenden Helfers (es gibt keinen gemeinsamen Lader für `messages/*.json` in `src/__tests__`); nichts ausserhalb der Anforderung.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bun run fitness -- --base origin/main --structure`, `cd backend && bun run type-check`, `bunx vitest run --changed origin/main` (635), die 17 Vitest-Dateien, die `messages/*.json` oder Feature-Dateien lesen (839), E2E chromium `settings.feature` + `sicherung.feature` (41), axe- und Sprachzeilen backup (default, backup-error, update-backup) und config (default, backup-links, update-check-saved) (14), Prettier-Check der neuen Datei, Rot-Läufe der Unit-Pins (de in 34d5095, fr/it/en vor der Änderung der Texte).
- Nur als Hinweis ausserhalb des Diffs, kein Befund dieser Änderung: `docs/installation.md:92` (Betreiber-Doku, Englisch) sagt weiter «Dwello keeps the last 7 daily backups», also dieselbe Lesart, die #1457 im UI ersetzt hat. Die Anforderung nennt nur die UI-Texte; ob die Anleitung folgen soll, entscheidet nicht dieses Review.
- Der Code-Kommentar `src/routes/config/+page.svelte:14` («the switch saves when switched») liegt ausserhalb des Diffs und ändert kein Verhalten.
