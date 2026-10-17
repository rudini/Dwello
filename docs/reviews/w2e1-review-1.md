# Code-Review W2e Slice 1 (Backend + BFF), Runde 1

Gegenstand: `git diff 4fca724 d53f732` im Worktree `review-w2e1-code` (detached, d53f732), dazu die Tests aus 08690ad..4fca724.
Anforderung: #358 «Done means», Fachreview `docs/reviews/w2e-fachreview-1.md` V-3, V-4, V-5, der vom Aufrufer beschriebene Entwurf.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | `backend/src/services/statement.service.ts:473,598,604,606` / `messages/*.json` | Vier neue Fehlercodes ohne `backend_<code>`-Meldung: `src/__tests__/backend-codes.test.ts` ist auf d53f732 rot |
| C-2 | Major | `src/routes/dashboard/+page.server.ts:70-71` | Die Übersicht zählt eine ersetzte Abrechnung weiter als Abrechnung der letzten Periode; widerspricht #358 «Decided» und Glossar «Ersetzt» |
| C-3 | Minor | `backend/src/services/statement.service.ts:629` | `STATEMENT_NO_RENTAL_DAYS_*` werden per Ternary gebildet und entgehen so `backend-codes.test.ts`; fehlende Meldungen bleiben unbemerkt. Fix: drei wörtliche Codes, z.B. `const code = paid > 0 ? { code: 'STATEMENT_NO_RENTAL_DAYS_PAID' } : …`, oder drei `new CodedError('…')` |
| C-4 | Minor | `backend/src/services/statement.service.ts:472-473`, `backend/src/routes/statements.ts:188-190` | Die neue Sperre `STATEMENT_REPLACED` in `updateStatement` hat keinen Test (ohne sie bleiben alle Tests grün), und `PUT /:id` gibt nur `{ error }` ohne Code zurück. Fix: pg-Test `PUT /:id` auf eine ersetzte Abrechnung, und die Route soll `errorBody` verwenden |
| C-5 | Minor | `src/lib/server/statement-generation.ts:57-58` | Die Bedingung «gleiche Periode» in `replacedHere` (V-3 im BFF) hat keinen Test; ohne den Periodenvergleich bleibt `statement-generation.test.ts` grün. Fix: ein Test, bei dem eine ersetzte Abrechnung einer anderen, überlappenden Periode den Mietvertrag weiter aus dem Lauf hält |
| C-6 | Minor | `docs/api-specification.md:217-218` | `/preview` und `/generate` nennen weder `priorPayments`, `replacesId` noch die Verknüpfung mit einer ersetzten Abrechnung derselben Periode; `GET /:id` nennt `replaces`, `replacedBy` und `priorPaidOn` nicht; die Ablehnung von `PUT /:id` bei einer ersetzten Abrechnung fehlt |
| C-7 | Nit | `backend/src/services/statement.service.ts:318` | Die Reihenfolge von `priorPaidOn` (`.reverse()`, die älteste zuerst) hat keinen Test; der Kettentest hat nur einen Eintrag. Ein Kettentest mit zwei bezahlten Abrechnungen zeigt sie |
| C-8 | Nit | `backend/src/services/statement.service.ts:353-369` | `openReplaced` nimmt `.limit(1)` ohne `orderBy`: Bei Altbeständen mit zwei offenen ersetzten Abrechnungen derselben Periode ist das Ergebnis nicht bestimmt. Erstellen Korrektur und Lauf gleichzeitig eine Abrechnung, läuft das zweite Insert auf den Unique-Index und endet als 500 bzw. `CALCULATION_FAILED` |
| C-9 | Nit | `backend/src/services/statement.service.ts:317,320` | ponytail `shrink:` `chain[0] && {…}` mit späterem `replaces ?? null` wird zu `const replaces = chain[0] ? { id: …, statementNumber: …, statementDate: … } : null;` und `replaces` direkt |
| C-10 | Nit | `implementation_plan.md:10` | Der Punkt «Slice 1» ist nicht abgehakt, nennt `replaced_by_id` (umgesetzt ist `replaces_id`) und keine geänderten Dateien |
| C-11 | Nit | `backend/src/services/statement.service.ts:310,316,317,349,356,473,600,629` | Neue Zeilen über `printWidth` 100 (Prettier); nur die eigenen Zeilen formatieren |

## C-1 (Major) Neue Fehlercodes ohne Meldung, Unit-Test rot

**Beleg.** `bunx vitest run src/__tests__/backend-codes.test.ts` auf d53f732:

```
AssertionError: expected [ 'STATEMENT_REPLACED', …(3) ] to deeply equal []
+   "STATEMENT_REPLACED",
+   "STATEMENT_NOT_REPLACEABLE",
+   "STATEMENT_NOT_REPLACED",
+   "STATEMENT_ALREADY_CORRECTED",
```

`grep backend_statement_(not_replace|already_corrected|replaced|no_rental) messages/de.json` findet 0 Treffer.

**Warum falsch.** CLAUDE.md, Conventions: Eine Ablehnung des Backends, die die Oberfläche zeigt, trägt einen Code und eine Meldung `backend_<code>` in allen vier Sprachen. Der Commit macht die Frontend-Unit-Suite und damit CI rot. Die Liste der Checks des Aufrufers enthält diesen Test nicht, darum fiel es nicht auf. Die drei Codes `STATEMENT_NO_RENTAL_DAYS_*` (V-5) fehlen ebenso, der Test sieht sie nur nicht (C-3).

**Fix.** Die sieben `backend_*`-Meldungen in `messages/{de,fr,it,en}.json` in diesem Slice nachtragen. Die Texte der Absagen ohne Mietstage stehen wörtlich in Fachreview V-5, die Fachreview ist also erfolgt (Schritt 1). Danach `bunx vitest run src/__tests__/backend-codes.test.ts`. Wenn die Texte bewusst erst mit Slice 2 kommen sollen, gehören die Codes auch erst in Slice 2: Kein Commit darf die Suite rot lassen.

## C-2 (Major) Die Übersicht zählt eine ersetzte Abrechnung als Abrechnung der Periode

**Beleg.** `src/routes/dashboard/+page.server.ts:66-71`: `lastPeriod` lädt `statements?periodStart=…&periodEnd=…` ohne Statusfilter und setzt `done = new Set(statements.map((s) => s.contractId))`. Das Backend filtert ohne `status` nicht (`statementFilterConditions`, `statement.service.ts:105-122`), also liefert es auch `replaced`. `missingPeriod` (`:75-87`) übergeht deshalb einen Mietvertrag, dessen Abrechnung der letzten Periode ersetzt ist und noch keine berichtigte Abrechnung hat.

**Warum falsch.** #358 «Decided»: Die ersetzte Abrechnung «does not count as the statement of the period»; ebenso `UBIQUITOUS_LANGUAGE.md:173` («zählt nicht als Abrechnung der Periode»). Diesen Slice setzt die Regel im Abrechnungslauf (`statement-generation.ts`) und am Mietvertrag (`contracts/[id]/+page.server.ts:106`) um, nicht aber in der Übersicht. Folge: Mietvertrag und Assistent nennen die Periode als offen, die Übersicht meldet sie als erledigt. Gerade dieser Hinweis soll laut Fachreview Frage 1 verhindern, dass eine ersetzte Abrechnung ohne berichtigte Abrechnung vergessen geht.

**So zeigt es sich.** In `src/__tests__/dashboard.test.ts` die Periode des Backends mit einer Abrechnung `{ ...statement, status: 'replaced' }` des Mietvertrags beantworten. `missingPeriod` ist dann `null` statt das Gebäude zu nennen.

**Fix.** In `lastPeriod` gilt `statements.filter((s) => s.status !== 'replaced')`, dazu der Test oben (rot vor dem Fix).

## Nicht bestätigt

- **Vom Aufrufer gemeldet, nicht wiederholt:** `cd backend && bun run test` (818 pass, Coverage 94.5 %), `bun run type-check`, `bun run lint`, `bun run check`, `bunx vitest run src/__tests__/statement-generation.test.ts src/__tests__/contract-actions.test.ts`. Die Backend-Tests habe ich wegen der geteilten Datenbank `dwello_test` nicht laufen lassen.
- **Selbst gelaufen:** nur `bunx vitest run src/__tests__/backend-codes.test.ts`, rot (C-1).
- **Rote Tests, nur gelesen:** Ich habe nur gelesen, nicht ausgeführt, ob die neuen Tests ohne die Änderung fehlschlagen. Die pg-Tests (`statement-correction.pg.test.ts`) scheitern ohne Endpunkte und Felder. Ohne `ne(status, 'replaced')` scheitert der Test der Vertragsdaten, ohne den Periodenvergleich in `openReplaced` der V-3-Test (`replaces: null`). Die zwei BFF-Tests scheitern ohne den Statusfilter. Ausnahmen: C-4, C-5 und C-7.
- **Szenarien:** `statement-detail.feature` und `contract-edit.feature` sind noch `@wip`. Slice 1 hat keine Oberfläche, die Szenarien werden erst mit Slice 2 grün. Darum melde ich das nicht als Befund; vor dem Pull Request muss es aber gelten. Für «a statement run of that period bills the contract again and links» (#358, 3. Punkt) gibt es keinen E2E-Ablauf. Fachreview V-9 empfiehlt einen in `statement-generate.feature`. Offen für Slice 2.
- **V-3, Hinweis bei überlappender anderer Periode:** Das Backend lehnt nicht ab, es verknüpft nur nicht (Test vorhanden). Der BFF-Lauf überspringt den Mietvertrag ohne Hinweis. Den Text «Die Abrechnung {number} ist ersetzt …» aus V-3 habe ich nicht gefunden; er gehört vermutlich zu Slice 2.
- **Ausser Umfang laut Aufrufer, nicht geprüft:** UI, PDF (V-2, V-11), Texte, a11y-Bildschirme und Audit-Log (#111). Der Hinweis auf #111 steht in `statement.service.ts:600`.
- **Weitere Verbraucher der Abrechnungsliste:** `invoicesInPeriod` (`statement-generation.ts:155,177`) zählt ersetzte Abrechnungen bei überlappenden Abrechnungen mit. Wozu die UI diese Zahl braucht, habe ich nicht geprüft. `getStatementCountsByStatus` zählt `replaced` nur in `total`. Beides wird in Slice 2 (Status-Reiter) relevant.
- **Sicherheit:** Die neuen Routen hängen hinter `authMiddleware` (`backend/src/app.ts:71,83`). BFF-Aktionen für `replace` und `correction` gibt es in diesem Slice noch nicht, die XSRF-Prüfung ist also erst in Slice 2 zu prüfen.
- **ponytail-review:** Ausser C-9 nichts zu kürzen. `correctionStatus` ist kein Duplikat von `resetPayment` (409 statt 400), und die Schleife in `correctionsOf` ist die kürzeste Form für die Kette. net: -2 lines possible.
