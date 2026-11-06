# Code-Review #669, Schlussrunde (5af99a9..e4dabbf, ohne docs)

Geschlossen: C-4, C-5

Keine neuen Befunde.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - fitness `--base origin/main` mit Exit 0
  - fallow sauber
  - lint 0, check 0
  - vitest 212 Dateien / 4234 Tests grün
  - Backend-Type-Check 0
  - Chromium «Mietvertrag bearbeiten|Neuer Mietvertrag|Mietvertrag erfassen» mit 126 bestanden
- Noch nicht abgeschlossen, laut Aufrufer: der Lauf von contract-new und der a11y- und Sprachzeilen für contract, overlap und mobile-menu.
- Das neue Szenario für C-5 (`contract-edit.feature:232-239`) hält eine Korrektur fest, deren DOM-Test laut Aufrufer in 45fcdf6 rot war. Darum braucht es keinen eigenen roten Lauf (CLAUDE.md, Workflow 2). Dass es die Ablehnung «ohne Mietverträge» erreicht, habe ich nur gelesen: `contractsState !== 'loaded'` in `ContractForm.svelte`. Gesehen habe ich es nicht.

Geprüft:
- C-4: Der Kommentar steht wieder über `createPartly`.
- C-5: Das Szenario prüft den ganzen Text aus der fach-review Runde 2.
- Merge 85c31ed: `--remerge-diff` zeigt nur entfernte Konfliktmarker, beide Seiten sind erhalten. In `src/` und `messages/` gibt es keinen Konflikt. Die Dialoge von #668 stehen nicht in Header, MobileNav oder Footer, die Meldungen liegen also weiter darüber.
- e4dabbf: Das Inlining entspricht der gelöschten `OverlapWarning.svelte`. Titel, `testid` `overlap-warning`, Text, `contracts_overlap_review_where` und `OverlapLink` sind gleich. `newTab` ist in «Prüfen» wie zuvor `false`. Es bleibt kein ungenutzter Import zurück.
