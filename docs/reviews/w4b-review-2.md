# Code-Review W4b (Runde 2, zugleich Abschlussreview vor dem Push)

Geprüft: `git diff 7e13aaa cdfdc23` im Worktree `review-w4b-code2` (detached auf cdfdc23). Alle 20 geänderten Dateien gelesen; dazu `statement.service.ts` (updateStatementStatus, updateStatement, resetPayment), `real-date.ts`, `today.ts`, `statement-pdf.service.ts` (getStatementPdf, paidDate im PDF), `demo-data.ts`, `api-contracts.pg.test.ts` (drift-Prüfung), `tests/e2e/CLAUDE.md` («No scenario», «Failure states»), Persona-Bericht `dr-weber-w4b.md`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | erledigt | backend/src/services/statement.service.ts:472, :490; src/lib/statement.ts:43 | `isRealDate` bzw. `isDay` wiederverwendet; `paidDate !== undefined` prüft auch `''`. Tests für 2025-13-01, 2025-01-32, 2025-00-10 (Unit) und 2025-13-01, '' (pg); ohne die Änderung rot (RangeError bzw. fehlender Code) |
| C-11 | Major | backend/src/services/statement.service.ts:505-507 | P-1 nicht behoben im Fall des Personas: ob das PDF eine Zahlung nennt, wird am Zahlungsdatum gemessen statt am Zeitpunkt des Erfassens. Ein beim Versand erstelltes PDF, das am oder nach dem Tag des Geldeingangs entstand (Demodaten immer; Versand und Zahlung am selben Tag; PDF heruntergeladen, bevor die Zahlung erfasst war), wird weiter verworfen |
| C-12 | Major | implementation_plan.md:14-15, tests/e2e/features/statement-detail.feature | Sichtbare Verhaltensänderung P-1 (PDF und Verlaufseintrag «PDF erstellt» bleiben nach dem Zurücksetzen) hat weder Szenario noch `No scenario: <Grund>` |
| C-13 | Minor | implementation_plan.md:14 | Begründung «failure between the BFF and the backend» trifft für die Ablehnung des Zurücksetzens nicht zu: `STATEMENT_NOT_PAID` (`backend_statement_not_paid`, «Laden Sie die Seite neu») erreicht der Verwalter ohne gestörten Request mit einer veralteten Seite (Zahlung in einem zweiten Tab schon zurückgesetzt); der E2E-Stack kann das erzeugen. Bei C-2 nur der FailRequests-Weg widerlegt |
| C-14 | Nit | tests/e2e/steps/statement-detail.steps.ts:135-136 | nach dem Entfernen des Schritts zwei Leerzeilen stehen geblieben |
| C-15 | Nit | backend/src/services/statement.service.ts:506 | `toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' })` ist zum dritten Mal ausgeschrieben (today.ts:4, statement-lock.pg.test.ts:18); ponytail `reuse:` `swissToday(date = new Date())` |
| C-10 | Nit | tests/e2e/features/statement-detail.feature:89 | aus Runde 1, unverändert offen |

Erledigt aus Runde 1: C-3 (Schritt entfernt), C-4 (fr/it/en «cette date ou une date ultérieure» u. a.), C-6 (Plan), C-7 (`paidAmount` aus Typ, Mapper und Contract; Contract-Prüfung `drift` verlangt nur die Felder der Datei), C-8 (500 bei unerwartetem Fehler), C-9. C-5 im Plan erklärt. C-2 abgelehnt; siehe C-13 zur Begründung.

Ponytail-Review: C-14 (`delete:`), C-15 (`reuse:`). Sonst nichts; der Delta ist kurz.

## C-11 (Major): das versendete PDF wird weiterhin verworfen, sobald es nach dem Geldeingang erstellt wurde

Anforderung P-1 (Dr. Weber): Das PDF, das beim Versand entstand und keine Zahlung nennt, bleibt beim Zurücksetzen mit seinem Verlaufseintrag; nur ein PDF, das die Zahlung bestätigt (`paidDate` im PDF nur bei Status `paid` beim Erstellen, statement-pdf.service.ts:136), wird verworfen.

Der Code entscheidet so:

```ts
const madeOnDay = existing.pdfGeneratedAt?.toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' });
const paidPdf = madeOnDay && existing.paidDate && madeOnDay >= existing.paidDate;
```

`paidDate` ist der Tag des Geldeingangs, den der Verwalter rückwirkend eingibt, nicht der Tag, an dem er die Zahlung erfasst. Ob ein PDF eine Zahlung nennt, hängt aber am Status beim Erstellen, also daran, ob es vor oder nach dem Erfassen entstand. `updateStatement` lässt das PDF beim Markieren als bezahlt stehen («Once paid, the PDF as sent stays»), ein bezahltes PDF entsteht also nur, wenn beim Erfassen keines da war. Fälle, in denen das Versand-PDF trotzdem verworfen wird:

- Demodaten (Reproduktion des Personas): `demo-data.ts:55-56` erstellt das PDF «as sent, kept after paying» am Ladetag (2026) und setzt `paidDate` auf Abrechnungsdatum + 21 (2025). `madeOnDay > paidDate`, also verworfen. Seepark Residenz → Sarah Meier 2024 → «Zahlung zurücksetzen» zeigt danach wie im Bericht «PDF erstellen», und «PDF erstellt» fehlt im Verlauf.
- Versand und Geldeingang am selben Tag, oder der Verwalter gibt das Abrechnungsdatum ein (die Meldung V-15 legt das nahe): `madeOnDay == paidDate`, verworfen.
- Das Versand-PDF wird erst nach dem Geldeingang heruntergeladen, aber bevor die Zahlung erfasst ist: verworfen.

Der neue pg-Test deckt nur den einen Fall «PDF gestern, Zahlung heute» ab.

Nachweis: in `statement-lock.pg.test.ts` für `sentId` (heute versendet) `await generateStatementPdf(sentId)` noch als versendet, dann `markPaid(sentId, today())`, dann `reset(sentId)`: `pdfBlob` ist `null`, obwohl das PDF ohne Zahlungsvermerk erstellt wurde. Oder `bun run dev:demo` mit dem Weg aus P-1.

Behebung: verwerfen nach dem Zustand beim Erstellen, nicht nach dem Zahlungsdatum. Zum Beispiel den Zeitpunkt des Erfassens festhalten und mit `pdfGeneratedAt` vergleichen, oder beim Erstellen festhalten, ob das PDF als bezahlt erstellt wurde. Die Wahl liegt beim Aufrufer.

## C-12 (Major): P-1 ohne Szenario oder `No scenario`

`CLAUDE.md`, Workflow 1: Jede Verhaltensänderung, die ein Nutzer sieht, bekommt ein Szenario ohne `@wip`. Wenn der E2E-Stack den Zustand nicht erzeugen kann, braucht sie einen Test darunter und `No scenario: <Grund>` im Plan. P-1 ändert, was die Detailseite nach dem Zurücksetzen zeigt («PDF herunterladen» statt «PDF erstellen», Verlaufszeile «PDF erstellt» bleibt). Im Plan steht zu P-1 nichts (nur die Persona-Zeile 18), und im Delta ändert sich kein Feature.

Nachweis: `git diff 7e13aaa cdfdc23 -- tests/e2e/features` ist leer; `grep -n "P-1\|PDF" implementation_plan.md` findet keine Zeile dazu.

Behebung: Mit der heutigen Regel kann der E2E-Stack das Behalten nicht erzeugen. Die Abrechnung wird im Szenario heute versendet, das Zahlungsdatum kann nur heute sein, und das PDF ist dann immer «am Zahlungstag» erstellt. Also entweder `No scenario: <Grund>` (Uhr) mit dem pg-Test, oder nach der Behebung von C-11 ein Szenario: versenden, PDF erstellen, als bezahlt markieren, zurücksetzen, das PDF ist weiter herunterladbar und der Verlauf nennt «PDF erstellt».

## Bestätigt

- C-1: Backend `checkPaidDate` mit `isRealDate` (Regex begrenzt Monat und Tag, kein RangeError), Aufruf auch bei `''`; Frontend `paidDateError` mit exportiertem `isDay` (mit `isNaN`-Prüfung). Kein Aufrufer schickt `''` als «heute» (BFF setzt `localToday()` als Vorgabe, statement-actions.ts:21).
- P-1 im Fall «PDF vor dem Tag des Geldeingangs erstellt»: bleibt (pg-Test, ohne Änderung rot, weil vorher immer `pdfBlob: null`); «PDF am Zahlungstag erstellt» wird weiter verworfen (bestehender Test V-1).
- Übersetzungen V-14/V-15: nur Werte geändert, Schlüssel in allen vier Dateien gleich; fr «Retirer le paiement saisi», it «Rimuovere il pagamento registrato» einheitlich über Knopf, Titel, Text, Meldungen und Verlaufszeile.
- Contract `statement-payment-reset.json` ohne `paidAmount`: `drift` prüft die Felder der Datei gegen die echte Antwort, das bleibt gültig.

## Nicht bestätigt

- Selbst wiederholt: `bunx vitest run` statement-status, statement-mapping, statement-pages.dom, statement-actions (109 grün).
- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, Backend type-check, `statement-lock.pg` + `api-contracts.pg` (41), gesamter `bunx vitest run` (2639; ein deepcheck-CLI-Test unter Last rot, allein grün), Rotlauf der neuen Tests.
- Kein pg-Test selbst ausgeführt (würde `dwello_test` neu anlegen). Den Nachweis zu C-11 habe ich durch Lesen von `demo-data.ts:55-56`, `updateStatement` (statement.service.ts:412-414) und `getStatementPdf` geführt, nicht durch einen Lauf.
- E2E nach diesem Delta nicht gelaufen (vom Aufrufer nicht gemeldet). Die Szenarien «Zahlung zurücksetzen …» und die Zeile `reset-payment-dialog` sind mit den geänderten fr/it-Texten nicht bestätigt (sprachen-bildschirme prüft nur, dass kein Deutsch erscheint, das sollte halten).
- Inhalt von `docs/reviews/w4b-fachreview-2.md` und `marco-w4b.md` nur soweit gelesen, wie der Delta sie umsetzt (V-14, V-15); ob deren übrige Befunde (z. B. Dr. Weber P-2 bis P-6) triagiert sind, steht nicht im Plan und ist nicht Teil dieses Reviews.
