# Code-Review Slice #96 / #104, Runde 3 (Abschlussrunde vor dem Push, dacc833..f140a36)

Worktree: `/tmp/claude-0/-home-user-Dwello/448bd968-db3f-51d5-8b5a-96a95e074d39/scratchpad/review-s3-code`, detached auf f140a36.

Geprüft habe ich die eigenen Commits des Zweigs:
- e4d77cb: Umbenennung der Migration und `docs/data-model.md`;
- 3372d73: der Merge mit `git show --cc` und `git diff 3372d73^1 3372d73 -- backend/src src/lib`;
- f140a36: die zwei Szenarien, `implementation_plan.md` und `docs/reviews/w1b-review-2.md`.

Die übrigen Commits im Bereich stammen aus `main` (#97/#101, #112/#52) und sind dort schon geprüft. Bei ihnen habe ich nur nach Wechselwirkungen mit diesem Zweig gesucht.

Dazu habe ich gelesen:
- `backend/src/db/migrate.ts`;
- `backend/migrations/0009_statement_numbers.sql` und `0010_line_item_invoices.sql`;
- `backend/src/services/statement-invoices.service.ts`;
- `generateStatementNumber` in `calculation.service.ts`;
- `CostTable.svelte` (`rentedShare`, `timeShare`) und `src/lib/server/statement.ts` (`byProfile`, `sharesOf`);
- die Grundlage und die Szenarien von `statement-detail.feature`;
- die Step-Definitionen der verwendeten Steps.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-17 | erledigt | tests/e2e/features/statement-detail.feature:410-426 | Zwei Szenarien sind dazugekommen. Ohne `byProfile` stünde «43.00 %» statt «43.00 % nach Heizprofil». Ohne `rentedShare` stünde «100.00 %» statt «366/366 Tage», weil die Hauswart-Rechnungen verschiedene Tage abrechnen und deshalb keine `billedDays` gespeichert sind. Die Zahlen stimmen mit der Grundlage überein: Heizung 1000, Eva Frei Jan bis Mär = 18 + 14 + 11 = 43 %, also CHF 430.00; Hauswart 600 + 1200 auf zwei gleiche Wohnungen = 900. Die Steps gibt es schon (`statement-detail.steps.ts:73, 275`), es ist kein Code im Szenario |
| C-24 | Nit | tests/e2e/features/statement-detail.feature:416 | Der Kommentar nennt die Review-ID «C-2». Diese ID steht nur in `docs/reviews` und sagt später niemandem etwas. Besser ist die Regel allein oder eine Issue-Nummer (#104), wie in den Kommentaren daneben |

Die offenen Minor/Nit aus Runde 2 (C-18 bis C-23) bleiben in `w1b-review-2.md`. Dieses Delta berührt sie nicht.

Merge und Umbenennung, ohne Befund:
- **Konfliktauflösung:** Der Import in `calculation.service.ts:15` enthält beide Seiten (`statementNumbers` aus main, `BilledInvoice` aus dem Zweig). `sql` kommt aus main.
- **Statement-Nummern:** `generateStatementNumber` ist unverändert so, wie main es hat. Der Zweig erzeugt Abrechnungen auf keinem neuen Weg. `statement-invoices.service.ts` liest keine Nummer. Neue Tests des Zweigs prüfen keine Abrechnungsnummer (`grep NK-|statementNumber` im Zweig-Delta von `tests/e2e` und `backend/src/__tests__`).
- **Mapper:** Main ergänzt in `src/lib/server/statement.ts` nur `pdfFileName`. Das hängt nicht mit `sharesOf` oder `byProfile` zusammen.
- **Reihenfolge der Migrationen:** `0010_line_item_invoices.sql` kommt nach `0008_contract_notice_received` und `0009_statement_numbers`. Die drei Dateien berühren verschiedene Tabellen.
- **Bestehende Entwicklungsdatenbanken:** Eine Datenbank dieses Zweigs, die noch `0008_line_item_invoices.sql` eingetragen hat, bricht mit einer klaren Meldung und dem Hinweis auf `db:reset` ab (`migrate.ts:30-35`). Auf main ist die Migration noch nicht, also betrifft das keine Installation.
- **Dokumentation:** `docs/data-model.md` nennt jetzt `0010`. Ausser im Plan nennt sonst nichts die alte Nummer.

ponytail-Bilanz: Das Delta hat zwei Szenarien, eine Umbenennung, eine Doku-Zeile und einen Import. Lean already. Ship.

## Blocker/Major

Keine.

## Nicht bestätigt

- Alle Checks des Aufrufers habe ich nicht wiederholt. Sie gelten als «vom Aufrufer gemeldet»:
  - `bun run lint`, `bun run check`, `bunx vitest run` (2679);
  - `cd backend && bun run test` (725, Coverage 94.1 %), `cd backend && bun run type-check`;
  - die zwei neuen Szenarien: rot mit abgeschaltetem `rentedShare`/`byProfile`, danach grün (chromium + api).

  Nach dem Lesen halte ich beide Rot-Nachweise für schlüssig, siehe C-17.
- Ob die Backend-Tests der zwei Seiten zusammen sauber laufen, kann ich nicht bestätigen. Gemeint ist das Zusammenspiel der neuen Tabelle `statement_numbers` aus main mit den pg-Tests dieses Zweigs (`statement-invoices.pg.test.ts`). Ich habe keinen Lauf gesehen, nur den gemeldeten (725 grün).
- Die übrigen E2E-Szenarien nach dem Merge, besonders die aus main in `statement-detail.feature` und `statement-generate.feature` neben den Szenarien dieses Zweigs: Ein Lauf nach 3372d73 ist nicht gemeldet. «Before marking anything complete» verlangt die betroffenen E2E-Szenarien, und der Plan führt sie noch als offen (`implementation_plan.md`, letzter Punkt).
- `daten-pruefer` steht im Plan noch als offen. Das ist kein Befund dieses Reviews.
