# Slice-Review w3b, Runde 1: #97 (Abrechnungsnummer ohne Wiedervergabe), #101 (PDF-Dateiname)

Geprüft: Worktree `review-w3b-code`, `git diff 76424e0 d65b754` (= Commits d0d4dce..5bddbb3 plus Merge d65b754, der nur
die Migration auf `0008` umbenennt, `docs/data-model.md` und `implementation_plan.md` anpasst). Alle 21 geänderten Dateien gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | `docs/api-specification.md:223` | Beschreibt den Anhang von `GET /:id/pdf` noch als `statement-<number>.pdf`; das Backend liefert jetzt `<number>.pdf` (`backend/src/routes/statements.ts:324`). Spec nachziehen. |
| C-2 | Minor | `tests/e2e/features/statement-generate.feature:80` | Das #97-Szenario prüft eine Geschäftsregel, die nicht von der UI abhängt, läuft aber nur über die UI (kein `@api`; `tests/e2e/CLAUDE.md`, «@api is for business rules»). Die Regel ist im `*.pg.test.ts` belegt, darum kein Major. |
| C-3 | Nit | `src/lib/server/statement.ts:114`, `src/__tests__/statement-endpoints.test.ts:121` | Der Ersatzname `'statement.pdf'` (Backend ohne `Content-Disposition`) ist ungetestet; der Testname sagt «Buchstaben, Ziffern, Punkt und Bindestrich», `\w` lässt auch `_` durch. |
| C-4 | Nit | `backend/src/__tests__/statement-creation.pg.test.ts:124` | «zählt nach der höchsten schon vergebenen Nummer weiter» ist auch auf dem Basis-Commit grün (max + 1). Er sichert das Verhalten, das bleibt (Startwert ohne Zählerzeile); rot nur gegen einen Zähler, der bei 1 beginnt. Gehört zur Anforderung «existing numbers do not change», nicht zu «seen red». |
| C-5 | Nit | BFF-Tests `statement-endpoints.test.ts:93`, `statement-list-load.test.ts:90` | Der `Content-Disposition`-Header des Backends ist in den BFF-Tests von Hand geschrieben; `tests/contracts` kennt nur JSON-Bodies. Weil `statement.routes.pg.test.ts` den genauen Header festhält, bleibt das ein Nit. |
| C-6 | Nit | `tests/e2e/steps/statement-detail.steps.ts:199` | Der Schritt «endet die Abrechnungsnummer von …» wird nur in `statement-generate.feature` gebraucht, steht aber in `statement-detail.steps.ts`. |
| C-7 | Nit | `implementation_plan.md:4-5` | Zwei Leerzeilen vor `## Session`. |

Ponytail-Review: `Lean already. Ship.` Die Bereinigung in `pdfFileName` verlangt #101 («safe ASCII»), der Parameter `options` von `generateStatements` hat einen Aufrufer. Den Ersatznamen aus C-3 könnte man streichen (net: -1 Zeile möglich); er schützt aber vor einem leeren Dateinamen.

Keine Blocker, keine Majors.

## Bestätigt (Code und Test)

- **#97, nie zweimal vergeben, Lücke bleibt:** `generateStatementNumber` (`backend/src/services/calculation.service.ts:445-458`) macht einen atomaren Upsert in `statement_numbers` (`ON CONFLICT … last_number + 1 RETURNING`). Bei zwei gleichzeitigen Erstvergaben gewinnt die eine den Insert, die andere läuft in den Konflikt, so entsteht kein Duplikat. Der Zähler läuft ausserhalb der Transaktion von `createStatement`: Scheitert das Speichern, bleibt eine Lücke. Das hat der Product Owner so entschieden. pg-Test `statement-creation.pg.test.ts:114` (zwei Entwürfe, den zweiten löschen, erneut erstellen ergibt first + 2) ist ohne die Änderung rot (max + 1 vergäbe die gelöschte Nummer neu).
- **Format und bestehende Nummern:** Präfix unverändert `NK-{8}-{Jahr}-`, 4 Stellen. Gibt es für ein Präfix noch keine Zeile, beginnt der Zähler nach der höchsten bestehenden Nummer (Test Z. 124). Bestehende Nummern werden nicht angefasst.
- **`docs/data-model.md`:** Abschnitt `statement_numbers` (Z. 300-311) beschreibt Ablage, Startwert und Grenze V-3. Die Migration heisst nach dem Merge richtig `0008`, auch in Z. 435.
- **Szenario #97** (`statement-generate.feature:80`): Die Seeds laufen über `POST statements/generate` (`tests/e2e/fixtures/backend.ts:157`) und damit über den Zähler. Ohne die Änderung erhielte Marc Huber `-0002`, das Szenario wäre also rot. Die Frage `listedStatementNumber` antwortet mit der Nummer selbst. Die Nummer steht in `StatementRow.svelte:37`. Weil das Heizprofil ausdrücklich genannt wird, folgt das Szenario der Isolationsregel zu Vorauswahlen.
- **#101:** Das Backend nennt die Datei `<number>.pdf`. Beide BFF-Routen geben den Namen über `pdfFileName` weiter, Bereinigung `[^\w.-]` (ohne Flag `u` nur ASCII). CR/LF und Anführungszeichen fallen weg, damit ist keine Header-Injection möglich, und Schrägstriche gibt es nicht. Unit-Tests prüfen Download (`attachment`), Ansicht (`inline`) und die Bereinigung für `/statements/[id]/pdf` sowie den Download über `/api/statements/[id]/pdf`. Zusätzlich hält `statement.routes.pg.test.ts` den Header des Backends fest. Szenario `statement-detail.feature` «Das PDF heisst wie die Abrechnungsnummer»: Die Frage ersetzt die Nummer aus dem Seitentitel (`statements_title`) durch `<Nummer>`. Der alte Name `abrechnung-<id>.pdf` liesse das Szenario scheitern.
- **Konventionen:** keine neuen UI-Texte, kein neuer Bildschirm (a11y- und Sprachlisten bleiben unverändert). Beide Szenarien tragen `TODO(fachlich prüfen, #294)`; #294 ist offen und hat die Labels `fachlich`, `entscheiden`. Die Screenplay-Schichten sind eingehalten: Steps rufen nur Tasks und Fragen auf. `generateStatements` reicht `options` auf dem UI- und dem API-Weg gleich weiter. Im Diff steht nichts, das nicht zur Anforderung gehört.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bunx vitest run` (2651), `cd backend && bun run type-check && bun run test` (704, Coverage 94.1 %) und E2E chromium+api für die Features statement-generate, statement-detail und statements (77 bestanden, vor dem Merge von main): vom Aufrufer gemeldet. Selbst nachlaufen lassen wollte ich `bunx vitest run` für die beiden BFF-Testdateien; der Lesezugriff auf `node_modules` (Symlink nach `/home/user/Dwello/node_modules`) war gesperrt.
- E2E nach dem Merge von main (die Migration heisst jetzt `0008`): nicht gelaufen, nur gelesen. Die Umbenennung ist im Merge sauber (`git diff 76424e0 d65b754 --stat`).
- Ob die Scenarios ohne die Änderung rot waren, habe ich nur durch Lesen geprüft (Seeds über den Zähler, Seitentitel mit Nummer). Selbst gesehen habe ich es nicht.
- Fachreview V-2 (Löschbestätigung) und V-4 (Zähler auch für #120) sind nicht umgesetzt. Beide sind dort Minor; die Triage liegt beim Aufrufer.
