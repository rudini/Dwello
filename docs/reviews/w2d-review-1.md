# Code-Review W2d (#79), Runde 1: Saldo zugunsten des Mieters auf 5 Rappen

Gegenstand: `git diff origin/main ba593eb` (Basis 43ce77e; Commits 355bbe6 Szenario, ba593eb Umsetzung), Worktree `review-w2d-code`. Alle 19 geänderten Dateien gelesen.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | `backend/migrations/0013_statement_balance_tenant_favour.sql` | `origin/main` ist seit der Basis weiter (f2131ee, #318 w7c) und hat schon `0013_contract_moved_out.sql`. Technisch läuft es (Sortierung nach Dateiname, Vorbild `0006_*` doppelt), aber die nächste freie Nummer ist 0014. Vor dem Push `origin/main` mergen, die Datei in `0014_…` umbenennen und den Filter in `migrations.pg.test.ts:93` sowie «migration `0013`» in `design-decisions.md:51` anpassen. Konflikte sind auch in `messages/*.json`, `data-model.md` und `implementation_plan.md` möglich. |
| C-2 | Minor | `src/__tests__/statement-pages.dom.test.ts:629-641` | Der neue DOM-Test bekommt den Saldo als Eingabe, und `CostTable.svelte` bleibt unverändert. Ohne die Änderung schlägt er also nicht fehl. Er hält nur fest, wie die neue Richtung angezeigt wird (V-6), und belegt das Verhalten von #79 nicht. Rot ist er nur durch das Umdrehen des Vorzeichens in der Komponente. Das ist als Absicherung in Ordnung, braucht aber den Hinweis im Kommentar oder in der PR. |
| C-3 | Nit | `backend/src/__tests__/statement-pdf-render.test.ts:202-203` | V-6 verlangte für den Fall «Ausgeglichen» auch `balancedRounded` und keinen Zahlteil. Der neue Fall prüft nur die Zeile «Ausgeglichen 0.00». Beides ist schon durch den bestehenden Fall 1000.02 (`:107 ff.`) und `pdf.service.ts` (`balance <= 0`, kein QR) abgedeckt. |
| C-4 | Nit | `UBIQUITOUS_LANGUAGE.md:156-157` | Dort steht noch «zugunsten des Mieters: geplant (#79)». Die Datei darf der Agent nicht ändern (Design-Regeln). Der Produktverantwortliche sollte die Angabe nach dem Merge selbst nachführen. |

Keine Blocker, keine Majors.

## Geprüft und bestätigt

- **`roundTo5Rappen`** (`pdf-format.ts:222`): `Math.floor(Math.round(roundToRappen(x) * 100) / 5) / 20 + 0`. Mit Node nachgerechnet, ohne Dateien zu schreiben:
  - Alle Rappenwerte −20000.00 … +20000.00, direkt und als verrauschte Differenz `(k+12345)/100 − 123.45`: 0 Abweichungen vom erwarteten `floor(k/5)·5`. Kein −0.
  - ±999999.99 → 999999.95 / −1000000. 1e−9 → 0. NaN bleibt NaN.
  - Eine Nachzahlung wird ab-, eine Rückerstattung aufgerundet, um höchstens 4 Rappen. +0.01…+0.04 wird 0.
  - `k/20` mit ganzzahligem `k` ergibt dasselbe Double wie das Dezimal-Literal, deshalb gelingen die `toBe`-Vergleiche.
- **Migration** (`0013_…sql`):
  - `numeric` ist exakt, `floor` rundet gegen −∞ (−979.4 → −980 → −49.00). Das Ergebnis passt in `DECIMAL(12,2)`.
  - Die Migration ändert nur `status = 'draft'`, und nur Zeilen, deren Saldo sich ändert. Dort setzt sie `pdf_blob`/`pdf_generated_at` auf NULL.
  - `total_costs` enthält die Verwaltungspauschale (`calculation.service.ts`), die Formel stimmt also mit `calculateBalance` überein.
  - `migrations.pg.test.ts:89-122` deckt Folgendes ab: Nachzahlung ab, Rückerstattung auf, +0.03 (alt 0.05) → 0.00, −0.01 (alt 0.00) → −0.05, eine unveränderte Zeile behält ihr PDF, «sent» und «paid» bleiben unverändert. Ohne die Migration schlägt der Test fehl.
- **Kein zweiter Rechenweg zum Saldo:**
  - `calculateBalance` → `roundTo5Rappen` ist der einzige Aufrufer (`calculation.service.ts:253, 403`). Vorschau und Erstellung laufen beide darüber.
  - QR-Betrag (`qr-bill.service.ts:337`), PDF (`statement-pdf.service.ts:134`), Mahnung (`reminder.service.ts:61, 85`), Erledigung bei 0 (`statement.service.ts:485`) und `paidAmount` (`:493`) lesen alle den gespeicherten `balance`.
  - `pdf.service.ts:554` und `CostTable.svelte:14` rechnen nur den Betrag vor Rundung für die Zeile «Rundung». Die Differenz von höchstens 0.04 liegt unter 0.05, die Zeile erscheint also.
  - `statement-wizard.ts:211` ist der Akonto-Hinweis, nicht der Saldo.
  - Auf `origin/main` (W6c, #324) leitet nichts einen QR-Betrag selbst her. Der Diff 43ce77e..origin/main fügt in `backend/src` keinen Saldo- oder Betragsweg hinzu.
- **Szenario** (`statement-rounding.feature`):
  - Die Werte sind nachgerechnet: 791.03→791.00, −48.97→−49.00, −0.01→−0.05, (1005·1.03)=1035.15 − 1035.12 = 0.03 → «Ausgeglichen CHF 0.00».
  - Jede Zeile schlägt mit der alten Rundung fehl: 791.05, 48.95, «Ausgeglichen», 0.05.
  - Die Steps gibt es schon: `statement-generate.steps.ts:240`, `statement-detail.steps.ts:66`. Kein `@wip`.
  - Die Erzählung sagt, was der Verwalter will. Die Begriffe stammen aus dem Glossar. Die Positionen bleiben genau («kostet CHF 1’031.03»).
- **Unit/PDF:**
  - `statement-pdf-data.test.ts` prüft jede Endziffer in beiden Richtungen, Gleitkomma-Rauschen und −0.
  - `statement-pdf-render.test.ts:96-105` rechnet mit `calculateBalance` und schlägt ohne die Änderung fehl.
  - Die neuen Erwartungen in `statement-generation.pg.test.ts` stimmen mit V-4 überein.
- **Texte:** `glossary_balance_text` ist in allen vier Sprachen nach dem Wortlaut aus V-5 geändert. `help-page.dom.test.ts` liest den neuen deutschen Satz. Keine weiteren UI-Texte geändert.
- **Doku:** PRD, Datenmodell, design-decisions (neue Zeile, «Session 12» bleibt als Verlauf) und Anforderungen Zeilen 94/148 (V-4) sind nachgeführt.
- **Sonst:**
  - Keine neuen Bildschirme oder Zustände, also keine a11y-Einträge nötig.
  - Keine API-Form geändert, also kein Contract nötig.
  - Keine E2E-Schichtänderung, keine Tokens, keine Sicherheitsfläche.
  - Nichts Fremdes im Diff.
- **Ponytail-Review:** Lean already. Ship. (`net: -0 lines possible.`)

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` (2737), `cd backend && bun run test` (759, Coverage-Untergrenze) und `bun run test:e2e -- --project=chromium --project=api --grep @statements` (124): vom Aufrufer gemeldet, nicht erneut ausgeführt. Ebenso vom Aufrufer gemeldet: die neuen Tests waren rot.
- Ob nach dem Merge von `origin/main` (C-1) alles grün bleibt: nicht geprüft, weil der gemergte Stand im Worktree nicht vorliegt. Für die Prüfung von C-1 habe ich einmal `git fetch origin` ausgeführt. Das hat nur Remote-Refs aktualisiert, keine Dateien.
- Features ausserhalb von `@statements` mit einem Saldo: Mit grep habe ich in den übrigen Features keinen gerundeten Saldo-Betrag gefunden (nur Mahnungs- und Einstellungstexte). Der volle E2E-Lauf in CI steht noch aus.
- Ob eine schon gespeicherte Mahnung oder ein Dokument eines Entwurfs den alten Saldo trägt: Entwürfe werden nicht gemahnt (`reminder.service.ts` verlangt eine versendete Abrechnung). Weiter habe ich das nicht verfolgt.
