# Review #338 «Neu berechnen» – Runde 1

Worktree: `review-338-code` (detached 7f8798f3), Bereich `ae6710c9..7f8798f3` ohne `docs/reviews`, `implementation_plan.md`. Alle 25 geänderten Dateien gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Blocker | backend/src/services/statement.service.ts:409, 454-476 (mit 362-378) | Neu berechnen einer berichtigten Abrechnung (Entwurf mit `replacesId`) setzt `replacesId` auf null und `priorPayments` auf 0: `openReplaced` findet die ersetzte Abrechnung nicht mehr, weil der Entwurf selbst ihr Nachfolger ist. Damit fehlen die schon bezahlten Beträge im Saldo und die Verknüpfung zur ersetzten Abrechnung |
| C-2 | Major | messages/de.json:456 (Code aus statement.service.ts:457) | Die Ablehnung `STATEMENT_NOT_DRAFT` bei Neu berechnen zeigt «… kann nicht gelöscht werden.»: Der Code ist der des Löschens, sein Text passt nicht zu Neu berechnen |
| C-3 | Major | statement.service.ts:458, messages/*.json:436 | Die Ablehnung wegen offener Vereinbarungsfragen (`STATEMENT_AGREEMENTS_OPEN`) schickt den Verwalter zu «Abrechnungen erstellen … erstellt die berichtigte Abrechnung». Der Assistent fragt aber nur für Mietverträge ohne Abrechnung, also nie für einen mit Entwurf. Kein Test deckt diese Ablehnung |
| C-4 | Major | backend/src/__tests__/statement-recalculation.pg.test.ts:55-60 | «Done means» verlangt die Ablehnung für versendet **und bezahlt**. Der Test heisst «versendete oder bezahlte», prüft aber nur versendet |
| C-5 | Minor | tests/e2e/tasks/statement-detail.ts:78 | `recalculateDraft` klickt nur und wartet nicht auf den Zustand, zu dem es führt (`statement-recalculated`), wie es `tasks/accessibility.ts:334` tut |
| C-6 | Minor | src/routes/statements/[id]/MoreActions.svelte:39-43 | Die Bestätigung steht in «Weitere Aktionen» (auf 390 px weit unten). Nach dem Neuladen der Seite durch das POST ist sie nicht sichtbar und nicht fokussiert. Die übrigen Rückmeldungen (`form-error`, Mahnung, «versendet») stehen oben, `+page.svelte:178-183`. Titel = Button-Text «Neu berechnen» statt eines Ergebnisses («Neu berechnet») |
| C-7 | Minor | messages/it.json:1132 (und alle «Ricalcola» in it.json) | Italienische Buttons stehen im Infinitiv (`i18n-begriffe.md` Z. 5; «Eliminare il conteggio», «Rettificare il conteggio»): «Ricalcolare», auch in den Verweistexten |
| C-8 | Minor | messages/*.json `statements_recalculate_hint`; src/routes/statements/[id]/edit/+page.svelte:94 | Geänderter Text ohne Test (kein DOM- oder E2E-Test prüft den Wortlaut). Die Bearbeitungsseite ist auch bei versendeten Abrechnungen erreichbar, dort passt der Verweis auf «Neu berechnen … des Entwurfs» nicht |
| C-9 | Minor | statement-recalculation.pg.test.ts | Ungetestete Designentscheide: gleicher Heizprofil/Satz (Issue, «Stop and ask»), gleiches `statementDate`/`paymentDeadline`/`notes`, verworfenes `pdfBlob` |
| C-10 | Minor | docs/api-specification.md:248-250; docs/PRD-Dwello.md:541 | Neuer Endpunkt `POST /:id/recalculation` (409 `STATEMENT_NOT_DRAFT`, `STATEMENT_AGREEMENTS_OPEN`) fehlt in der Tabelle. Im PRD steht weiter «delete the draft and run the wizard again» |
| C-11 | Nit | tests/e2e/targets/statement-detail.ts:73-74 | `recalculateButton` steht unter dem Kommentar «#120: the correction …» |
| C-12 | Nit | backend/src/routes/statements.ts (recalculation) | Rückfalltext 'Statement generation failed' für eine Neuberechnung |
| C-13 | Nit | statement-recalculation.pg.test.ts:13 | ponytail `delete:` Felder `balance`, `lineItems` im Typ `Statement` ungenutzt. Sonst schlank: `calculatedRows` entfernt die Duplikation statt sie anzulegen. net: -1 Zeile möglich |

## Blocker/Major

### C-1 (Blocker): Neu berechnen löscht die Verknüpfung der berichtigten Abrechnung und die schon bezahlten Beträge

`calculatedRows` übernimmt `replacesId` und `priorPayments` aus `calculateStatement`. Dieses sucht über `openReplaced` eine ersetzte Abrechnung desselben Mietvertrags und derselben Periode **ohne Nachfolger** (`isNull(successor.id)`). Bei einer berichtigten Abrechnung ist der Entwurf, der gerade neu berechnet wird, dieser Nachfolger. Die Suche findet also nichts, und das `UPDATE` in `recalculateStatement` schreibt `replacesId: null` und `priorPayments: '0'`. Der Saldo rechnet die Zahlungen auf der ersetzten Abrechnung nicht mehr an. Dem Mieter würde damit nochmals verrechnet, was er schon bezahlt hat. Ausserdem hat die ersetzte Abrechnung keinen Nachfolger mehr: Der Assistent zählt den Mietvertrag dann nicht mehr als abgerechnet (`statement-generation.ts:73`, `replacedHere`) und kann eine zweite Abrechnung erstellen. Der Fall tritt genau dort auf, wo #338 gebraucht wird: Abrechnung berichtigen, danach eine Rechnung korrigieren, dann auf dem neuen Entwurf «Neu berechnen». Der Entwurf zeigt die Schaltfläche, weil er den Status `draft` hat.

Nachweis: Ein `*.pg.test.ts` erstellt die Abrechnung, setzt sie auf versendet und bezahlt (`paidAmount` > 0), ruft `POST /:id/replace` und `POST /:id/correction` auf, erfasst eine Rechnung und ruft `POST /<Entwurf>/recalculation` auf. Erwartet: `replacesId` gleich der ersetzten Abrechnung und `priorPayments` wie vorher. Heute schlagen beide Erwartungen fehl. Behebung: Für einen Entwurf `replacesId`/`priorPayments` aus dem Entwurf übernehmen oder `openReplaced` den eigenen Entwurf zulassen; den Saldo mit diesen Werten berechnen.

### C-2 (Major): Falscher Ablehnungstext bei Neu berechnen

`recalculateStatement` lehnt mit `STATEMENT_NOT_DRAFT` ab. Die BFF zeigt diesen Code über `backendMessage` als `backend_statement_not_draft` an: «Die Abrechnung ist kein Entwurf mehr und kann nicht gelöscht werden.» (fr/it/en entsprechend). Der Verwalter hat aber nicht gelöscht. Das ist erreichbar: Ein Tab zeigt noch den Entwurf, in einem anderen Tab wurde er inzwischen versendet, und der Verwalter klickt «Neu berechnen». Er liest dann einen Text zu einer anderen Aktion und erfährt nicht, was er tun soll (Seite neu laden, Abrechnung berichtigen). Nachweis: ein DOM- oder BFF-Test, der `recalculateStatement` (statement-actions.ts) eine 409 mit `code: 'STATEMENT_NOT_DRAFT'` gibt und einen Text zu Neu berechnen erwartet. Er schlägt heute fehl. Behebung: ein eigener Code (z. B. `STATEMENT_NOT_RECALCULABLE`) mit Text in vier Sprachen, oder ein neutraler Text für `STATEMENT_NOT_DRAFT`, der für beide Aktionen stimmt.

### C-3 (Major): Die Ablehnung wegen offener Vereinbarungen führt in eine Sackgasse und ist ungetestet

Die Neuberechnung lehnt offene Vereinbarungsfragen ab wie die Berichtigung. Der Text von `backend_statement_agreements_open` ist aber für die Berichtigung geschrieben: «Wählen Sie «Abrechnungen erstellen» …: Dort fragt Dwello danach und erstellt die berichtigte Abrechnung.» Der Assistent fragt nach Vereinbarungen nur für die Mietverträge, die der Lauf abrechnet (`contractAgreements` → `contractsInPeriod`, `statement-generation.ts:96-102, 125`). Ein Mietvertrag mit Entwurf zählt als abgerechnet. Der Verwalter folgt dem Text und findet dort weder die Frage noch eine berichtigte Abrechnung. Der typische Auslöser ist der Fall von #338: eine nachträglich erfasste Rechnung einer Kategorie, die der Mietvertrag noch nicht beantwortet hat. Kein Test (pg, DOM, E2E) deckt diesen Designentscheid. Nachweis: Ein `*.pg.test.ts` erstellt einen Entwurf, erfasst eine Rechnung einer Kategorie ohne Antwort im Mietvertrag und ruft die Neuberechnung auf. Erwartet 409 `STATEMENT_AGREEMENTS_OPEN`. Ein DOM- oder Unit-Test erwartet für den Entwurf einen Text, der zum richtigen Ort führt (Mietvertrag bearbeiten, «Vereinbarte Nebenkosten»). Heute erscheint der Text zur Berichtigung.

### C-4 (Major): Die Ablehnung für bezahlte Abrechnungen ist nicht getestet

Das Issue verlangt unter «Done means» ausdrücklich einen `*.pg.test.ts` für die «refusal for sent and paid». Der Test `rechnet eine versendete oder bezahlte Abrechnung nicht neu` setzt nur `sent`. Der Code (`status !== 'draft'`) deckt `paid` zwar mit ab, aber eine Punkt der Abnahme ist nicht erfüllt, und der Testname behauptet mehr, als er prüft. Behebung: in demselben Test zusätzlich `PUT /status { status: 'paid' }` (bzw. das Bezahlen wie in den bestehenden Tests) und die Ablehnung erneut erwarten. Weil das Verhalten durch denselben Zweig schon besteht, muss dieser Fall nicht rot gesehen werden; die Commit-Nachricht sagt das.

## Bestätigt

- Gleiche Nummer, neue Beträge, gespeicherte Rechnungen (#96) leer danach: pg-Test Z. 40-53 (`statementNumber`, `totalCosts`, `changed-invoices` = []). Er wäre ohne den Endpunkt rot (404).
- Weg ohne Ablehnung: Positionen in einer Transaktion ersetzt; `pdfBlob`/`pdfGeneratedAt` verworfen; `statementNumber`, `statementDate`, `paymentDeadline`, `createdAt`, `notes` und `status` stehen nicht in `values` und bleiben (gelesen, ungetestet: C-9). Heizprofil und Satz kommen aus dem Entwurf.
- Ablehnung versendet: 409 `STATEMENT_NOT_DRAFT` (pg-Test). Die UI bietet die Schaltfläche nur beim Entwurf an (DOM-Test `statement-pages.dom.test.ts` mit Prüfung auf null bei `sent`).
- Szenario «Entwurf neu berechnen» in `statement-detail.feature` ohne `@wip`. Es prüft die Position mit der neuen Rechnung als positiven Anker vor der Negativprüfung auf den Hinweis. Die Schritte rufen nur Task und Question auf.
- Neuer Zustand `recalculated` in `screens.json` (mit `stateMeanings`), `accessibility.feature` und `sprachen-bildschirme.feature`.
- Verweistexte (`statements_later_draft`, `statements_existing_note`, `statements_nothing`, `statements_building_recalculate` als Nachfolger von «all billed», Rechnungs-, Tankbestand- und Heizprofiltexte) zeigen in allen vier Sprachen auf «Neu berechnen». fr mit « … » und geschütztem Leerzeichen vor «:»/«;», Begriffe brouillon/bozza/draft und rectifier/rettificare/correct nach `i18n-begriffe.md`. Bedeutung de/fr/it/en übereinstimmend. Ausnahmen: C-7, C-8.
- Sicherheit: Die BFF-Aktion läuft über den bestehenden Form-Action-Weg (SvelteKit-CSRF, Session-Fetch), das Backend erhält nur die ID. Es fliessen keine neuen Daten zum Client.
- Tokens/Komponenten: nur `Button`, `Alert`, `flex flex-col`. Kein Befund.

## Nicht bestätigt

- lint, check, Backend-Type-Check, `bunx vitest run` gesamt (3112), Backend `bun test src/__tests__/statement*` (232 + 2) und E2E (105 + 9) inklusive Rot-Läufen: vom Aufrufer gemeldet, nicht wiederholt.
- Selbst wiederholt: `bunx vitest run` von statement-pages, statement-wizard, invoice-pages und buildings-pages DOM: 311 grün.
- Rot vor der Änderung bei den DOM-Texttests: vom Aufrufer gemeldet. Durch Lesen bestätigt, dass jede geänderte Erwartung den neuen Wortlaut prüft. Der Wortlaut von `statements_recalculate_hint` ist nirgends geprüft (C-8).
- C-1 und C-3 habe ich durch Lesen bestätigt (`openReplaced` Z. 362-378, `calculatedRows` Z. 409-410, `statement-generation.ts:65-102, 125-145`), nicht durch einen Lauf: Ich habe keinen Backend-Test gestartet, weil er in die Datenbank schreibt. Wie oft eine Kategorie ohne Antwort im Mietvertrag vorkommt (C-3), hängt davon ab, welche Kategorien das Vertragsformular beantwortet (`agreed-category.service.ts`, `answer`). Das habe ich nicht abschliessend geklärt.
- Gleichzeitiges Versenden während der Neuberechnung: Der Status wird ausserhalb der Transaktion geprüft (wie beim Löschen). Nicht als Befund geführt.
