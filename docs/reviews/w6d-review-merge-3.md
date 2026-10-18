# Code-Review Merge 5969738 (#94, Runde 3 der Merge-Reviews)

Merge von `origin/main` (8b2c710) in `claude/w6d-min-saldo-94` (6b6e3be), Merge-Basis b0fe7f2. Geprüft im Worktree `review-w6d-merge3` (detached auf 5969738).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

(C-23 und folgende nicht vergeben.)

## Vorgehen und Ergebnis

**Nichts verloren, keine Seite.**

- Dateien, die beide Seiten seit der Merge-Basis geändert haben: `backend/src/services/pdf.service.ts`, `backend/src/__tests__/statement-pdf-render.test.ts`, `docs/archive/implementation-plan-verlauf.md`, `docs/nebenkostenabrechnung-anforderungen.md`, `messages/{de,fr,it,en}.json`.
- Unsere Änderungen (`git diff -U0 b0fe7f2 6b6e3be`) und `git diff -U0 8b2c710 5969738` haben über das ganze Repository dieselben +/- Zeilen: Jede Änderung des Branches steckt unverändert im Merge.
- Die Änderungen von main (`git diff -U0 b0fe7f2 8b2c710`, 945 Zeilen) und `git diff -U0 6b6e3be 5969738` sind ebenfalls zeilengleich: Auch von main fehlt nichts, und der Merge bringt nichts Eigenes hinzu.
- `pdf.service.ts`: In de, fr und it stehen jetzt `waivedDue` / `waivedRefund` (unser Wortlaut) direkt vor dem neuen `sharesNote` von main (#249 «Kosten des Gebäudes» / «der Anteil Ihrer Wohnung an den Kosten des Gebäudes»; fr/it Wohnungsanteil aus 4fded38). en hatte keinen Konflikt und ist korrekt (Z. 331–333). `pickWaivedNote` (Z. 558) ist unverändert.
- `implementation-plan-verlauf.md`: Die Sessions W9d (#351, #249), W3e (#348) und W6d (#94) stehen in dieser Reihenfolge am Ende, vollständig.
- Die von main entfernten Schlüssel `statements_part_month` / `statements_list_and` verwendet der Branch nirgends (`grep` in `src`, `backend/src`, `tests`: keine Treffer).

**Fordert der neue Wortlaut von main eine Änderung an unseren Verzichtstexten? Nein.**

- #249 ersetzt im PDF «Liegenschaft» durch «Gebäude» / «Kosten des Gebäudes». Unsere Texte (`waivedDue`, `waivedRefund`, `statements_summary_waived_*`, `backend_reminder_below_minimum`, in allen vier Sprachen) nennen weder Gebäude noch Liegenschaft, nur «Der Betrag … CHF 5.00». Der neue Render-Test `not.toContain('Liegenschaft')` (Fixture `due`) wird durch sie nicht berührt.
- Regeln von #348, mit `i18n.test.ts` festgehalten: Guillemets statt gerader Anführungszeichen (de, en): unsere Texte haben keine Anführungszeichen. Feldfehler (`_error_`) enden mit Punkt: unsere Schlüssel sind keine `_error_`-Schlüssel und enden ohnehin mit Punkt.
- `docs/design/i18n-begriffe.md` (main: «Kosten des Gebäudes») und die Zeile «Saldo / Nachzahlung / Rückerstattung» passen zu unseren Texten. Unsere Ergänzungen in `nebenkostenabrechnung-anforderungen.md` (Z. Zahlungsfrist, Zahlteil, Punkt 11) verwenden «Liegenschaft» nicht. Die übrigen Treffer für «Liegenschaft» in dieser Datei stammen weder aus unserer noch aus der Änderung von main.

## Nicht bestätigt

- lint, `bun run check`, Backend-Type-Check, vitest (2841 grün), Backend-Tests mit Coverage-Floor, E2E @statements chromium+api (168 grün): vom Aufrufer gemeldet, nicht selbst ausgeführt. Da beide Seiten zeilengleich übernommen sind, hatte ich keinen Anlass, einen Lauf anzuzweifeln.
- Fachliche Prüfung des Verzichts-Wortlauts selbst: nicht Teil dieses Merge-Reviews, siehe frühere Reviews (`docs/reviews/w6d-review-merge.md`, `w6d-review-merge-2.md`).
