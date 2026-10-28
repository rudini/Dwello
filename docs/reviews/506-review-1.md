# Code-Review 506-1: offener Übertrag (3841aac..a642fa8)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | backend/src/services/statement-invoices.service.ts:156-165 | Die Entscheidung vom 2026-10-28 («such a draft does not count as «zu versenden» (V-8)») ist nicht umgesetzt: `draftOutdated` und `draftsToSend` kennen `carryOverChanged` nicht. Ein Entwurf, den der Versanddialog «nicht aktuell» nennt, zählt auf der Übersicht weiter als «zu versenden». |
| C-2 | Minor | backend/src/services/carry-over.ts:38-50 | Bedingung (c) ist nur zum Teil getestet. Der einzige Test (`statement-carry-over.pg.test.ts:165`) läuft mit Akonto 0. Er bleibt grün, wenn man die Prüfung «Akonto über 0» oder «vereinbarte Nebenkosten» (`k.agreed`) entfernt, denn der Gegentest (`:122`) hat keine Pauschale. Kein Test zeigt, dass ein Vertrag mit Pauschale und Akonto über 0 nach der Periode oder mit Häkchen nicht offen ist. |
| C-3 | Minor | backend/src/services/carry-over.ts:39 | `c.flat_rate_utility_charge > 0` ist eine zusätzliche Bedingung, die die Regel (c) der Entscheidung und Fachreview V-3 nicht kennt («kein Akonto über 0 und keine vereinbarten Nebenkosten»). Bei einem Vertrag, der danach ohne Akonto, ohne Häkchen und ohne Pauschale weiterläuft (Nebenkosten im Mietzins), ist der Übertrag nie offen und wird keine Aufgabe. |
| C-4 | Minor | src/lib/server/statement-actions.ts:77-82, src/routes/statements/[id]/+page.server.ts:75-78, src/lib/server/statement.ts:79-80 | Neue BFF-Zeilen ohne Test auf der untersten Schicht. Die Aktion `settleCarry` (URL `/carry-settled`, Ablehnung → `backend_statement_no_carry_over` bzw. `statements_carry_settle_failed`) hat keinen Test wie `resetPayment` (`statement-actions.test.ts:142-149`). Kein Test zeigt, dass der Mapper `openCarry: true` und `carrySettledOn` weitergibt: die DOM-Tests setzen die Felder direkt. |
| C-5 | Minor | docs/api-specification.md:276, :283, :286, :29 | Die Doku ist nicht nachgeführt und beschreibt die API jetzt falsch. Es fehlen `POST /:id/carry-settled` mit `STATEMENT_NO_CARRY_OVER`, `carryOverChanged` in `changed-invoices`, `openCarryOvers` im Dashboard, das Zurücksetzen von `carrySettledOn` in `payment-reset` und `paidAmount` für einen von Hand ausgeglichenen Übertrag in `replace`. |

## C-1 V-8 nicht umgesetzt (Major)

- **Warum falsch:** Die Entscheidung des Issues vom 2026-10-28 (Punkt «C») sagt ausdrücklich: «such a draft does not count as «zu versenden» (V-8)». Der Aufrufer lässt das absichtlich weg (eine Abfrage pro Entwurf, Fitness-Ratchet P2). Das ist eine Abwägung gegen eine Entscheidung des Product Owners, die nach CLAUDE.md («Done means», «When to ask») nur der Product Owner treffen kann. Für den Liegenschaftsverwalter widerspricht sich die App: Die Übersicht zählt den Entwurf als versandbereit, der Versanddialog sagt «Dieser Entwurf ist nicht aktuell».
- **Wie zeigen:** Szenario 1 aus `statement-minimum-balance.feature:174` aufbauen (2025 erstellt, dann 2024 versendet) und `GET /api/v1/dashboard` lesen. Die Zahl der Entwürfe «zu versenden» enthält 2025. `draftsToSend()` ruft nur `draftOutdated(changesOf(...))` auf (`statement-invoices.service.ts:163`), und das prüft nur Rechnungen und Tankbestand.
- **Ausweg:** Umsetzen. Bei unter 50 Wohnungen kostet `carriedOver` je Entwurf eine Abfrage, nur über Entwürfe. Oder ein `needs-decision`-Issue, das den Product Owner fragt, ob V-8 entfallen darf, und den Punkt unter «Blocked on me» führen.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - `cd backend && bun run test` (1678 pass, Coverage 96.6 %)
  - `statement-carry-over.pg.test.ts` (50 pass, die neuen Tests vorher rot)
  - `api-contracts.pg.test.ts` (94 pass)
  - `bun run fitness:p2 -- --queries`
  - `bun run test:coverage` (3755 pass)
  - DOM- und Unit-Tests rot, wenn man den Frontend-Code herausnimmt
  - E2E chromium und api (188 passed, die fünf neuen Szenarien rot als @wip)
  - axe- und Sprachzeilen von `statement-open-carry-detail` und `dashboard` (26 passed)
  - `bun run lint`, `bun run check`, Backend-Type-Check, Commit-Hooks
- Ob «soldé/saldato/settled» und «report/riporto» zu `docs/design/i18n-begriffe.md` passen: dort nicht nachgeschlagen. Die Wörter folgen der Wortlaut-Tabelle der Fachreview 506-1.
- Ob die Seed-Daten Lea (Vertragsende 2023-12-31) andere Bildschirme der a11y- und Sprach-Läufe verändern (`tests/e2e/fixtures/screens.ts:161-170`): gemeldet ist nur der Lauf der zwei genannten Bildschirme.

Geprüft: alle 45 Dateien im Diff gelesen; Regeln (a), (b) und (c) sowie `carriedOver` gegen das Beispiel von V-1, Berichtigung (V-2), `resetPayment` (V-9), «Neu berechnen» übernimmt den neuen Übertrag (`calculatedRows` → `carriedFromId`), Texte in allen vier `messages/*.json` gegen die Wortlaut-Tabelle, Glossarzeilen, Verträge in `tests/contracts`, `screens.json`/`accessibility.feature`/`sprachen-bildschirme.feature`, Screenplay-Schichten und Negativprüfung mit Anker, rot vor der Änderung für alle neuen pg- und DOM-Tests.
