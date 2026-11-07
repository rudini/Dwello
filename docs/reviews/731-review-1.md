# Review 731, Runde 1 (75b78a9..ceef116)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: alle 11 geänderten Dateien gelesen. Hilfetext unter den Kennzahlen kommt aus `statusLabels`/`statusHelp` (`apartments_status_help_relet`/`_reserved`, in allen vier Sprachen vorhanden), nur Tokens, gültiges `dl`/`div`/`dt`/`dd`, kein neuer Bildschirmzustand (die Zeile `dashboard` `default` gibt es schon). Das geschützte Leerzeichen steht in `apartments_status_relet` in allen vier Sprachen. Die übrigen E2E-Stellen, die «Vermietet ab …» mit normalem Leerzeichen schreiben (Tasks-Map, Questions-Map, Filter-Szenario), funktionieren weiter: Text.of normalisiert mit `\s+`, und das deckt U+00A0 ab (`tests/e2e/screenplay/questions.ts:17`). Die DOM-Tests prüfen nur mit `toContain` auf andere Meldungen (`glossary_status_text`, Legende), die nicht geändert wurden. Rot ohne die Änderung: der Then-Schritt (ohne `stat-help-*` keine Elemente), der i18n-Test (ohne U+00A0) und `apartment.test.ts:309`. Die Steps rufen nur Questions auf, die Question liefert die Werte selbst (Begriff, Satz). Nichts im Diff gehört nicht zur Anforderung. ponytail-review: schon schlank, nichts zu kürzen. Tab-Titel: keine Änderung, so wie entschieden.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bun run fitness`, `cd backend && bun run type-check`, `bunx vitest run --changed origin/main` (656 bestanden), die Tests design-guard/tokens/no-german-in-code, `bunx vitest run` für i18n, apartment, help-page und apartments-pages, E2E `dashboard.feature` (53 bestanden, Szenariogrundriss vorher rot am Then-Schritt), axe- und Sprachzeilen von `dashboard` (28 bestanden), der i18n-Test vorher rot in allen vier Sprachen.
- 1280 px: Ob «…» jetzt in der Kachel mit dem Wort davor auf einer Zeile bleibt und die Beschriftungen sich nicht berühren, habe ich nicht gemessen. Das lässt sich nur im Browser zeigen; im Code steht nur das U+00A0 in den vier Meldungsdateien.
- Laufende Texte, die «Vermietet ab …» mit normalem Leerzeichen enthalten (`glossary_status_text`, `apartments_legend_text`), sind nicht geändert. Die Entscheidung nennt dafür nur `apartments_status_relet`; ob «…» dort im Fliesstext allein umbricht, habe ich nicht geprüft.
