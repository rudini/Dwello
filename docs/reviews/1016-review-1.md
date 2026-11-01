# Code-Review 1016, Runde 1 (Slice und Abschlussrunde)

Commit 8d57cf7 (`git diff HEAD~1 HEAD`, Basis origin/main b4cc43a), Worktree `/tmp/scratchpad/review-1016-code-reviewer`.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | Commit 8d57cf7 (Message), `tests/e2e/features/statement-detail.feature:1307` | «No scenario» hält nicht: Die Änderung ist für den Benutzer sichtbar (das PDF, das er unter «Dokumente» ausdruckt, verlangt jetzt den offenen Betrag), und der E2E-Stack kann den Zustand herstellen. Das Szenario zu #1003 deckt die umgekehrte Reihenfolge ab und das PDF der Abrechnung, nicht das neue PDF «Zu versenden». |
| C-2 | Major | `backend/src/__tests__/statement-mail.pg.test.ts:502-514` | Der Test prüft nur, dass ein anderes `new_pdf`-Dokument «to_send» vorliegt (`id` verschieden). Ob dieses PDF die Zahlung nennt und den offenen Betrag verlangt, wie «Done means» von #1016 es verlangt, prüft er nicht. |

## C-1: Szenario fehlt, «No scenario» trägt nicht

Warum es falsch ist: `CLAUDE.md`, Workflow 1, verlangt für jede Verhaltensänderung, die ein Benutzer sieht, ein Szenario. Ein Bugfix, den der Benutzer sieht, ist ausdrücklich eingeschlossen. Die Ausnahmen in `tests/e2e/CLAUDE.md`, «No scenario» (Z. 65-77), betreffen nur Zustände, die der E2E-Stack nicht herstellen kann. Dieser hier lässt sich herstellen, und zwar nur mit Steps, die es schon gibt:
- Szenario «Nach einer Änderung liegt das neue PDF zum Versand bereit» (Z. 1295): versenden, dann nur die Bemerkung festhalten.
- Danach `der Liegenschaftsverwalter eine Zahlung von "10.00" Franken festhält` (Z. 107/1313).
- Danach `der Liegenschaftsverwalter das PDF der {string} an {string} in den Dokumenten herunterlädt` (`tests/e2e/steps/documents.steps.ts:65`) mit «Nebenkostenabrechnung, neues PDF».
- Zum Schluss `steht im PDF "Offener Betrag CHF 432.90"` (`statement-detail.steps.ts:340`).

Die Begründung im Commit («covered by the #1003 scenario») stimmt nicht. Das Szenario Z. 1307-1318 hält zuerst die Zahlung fest, dann die Änderung, und lädt danach das PDF *der Abrechnung* herunter (`das PDF der Abrechnung erstellt/herunterlädt`). Das neue PDF «Zu versenden», das schon vor der Zahlung erstellt war, kommt darin nicht vor. Genau das ist der Fall von #1016.

So zeigt man, dass es fehlschlägt: Das oben beschriebene Szenario wird auf b4cc43a rot. Das heruntergeladene neue PDF nennt dort den vollen Saldo und keine Zahlung «Bereits bezahlt».

## C-2: Der pg-Test zeigt nicht, was «Done means» verlangt

Warum es falsch ist: Issue #1016, «Done means»: «After a part payment, the new PDF «Zu versenden» names the payment and asks for the open amount, with a `*.pg.test.ts`». Der neue Test prüft nur `after[0].id !== before.id` und `status: 'to_send'`. Er bleibt grün, wenn das neue Dokument mit dem alten Inhalt neu angelegt wird. Das wäre etwa der Fall, wenn `keepNewPdf` ein gespeichertes oder zwischengespeichertes Blob übernähme oder `generateStatementPdf` die Teilzahlungen (#1003) nicht mehr berücksichtigte. Der Hilfscode für eine Inhaltsprüfung ist vorhanden: `backend/src/__tests__/helpers/pdf-text.ts`, schon in `reminders.pg.test.ts` verwendet.

So zeigt man, dass es fehlschlägt: In `keepNewPdf` das Blob des alten Dokuments übernehmen statt `generateStatementPdf` aufzurufen. Der Test bleibt grün, obwohl das PDF weiterhin zu viel verlangt. Mit einer Prüfung auf den Text des Dokument-PDFs, etwa «Bereits bezahlt CHF 10.00» und «Offener Betrag», würde er rot.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `cd backend && bun run type-check`, voller Backend-Lauf `bun test` (1962 pass), `bun run lint`.
- Rot des neuen Tests nur durch Lesen beurteilt: Ohne die Änderung an der Route bleibt das Dokument mit derselben `id` stehen, also schlägt `expect(after[0].id).not.toBe(before.id)` fehl.
- Ob für diese PDF-Änderung ein `fach-reviewer`-Lauf nach Workflow 1/5 nötig ist oder durch die Entscheidung in #1016 (Empfehlung V-4 aus `docs/reviews/1003-fachreview-1.md`) gedeckt ist: nicht geprüft, keine Code-Frage.
- Ausserhalb des Diffs gesehen, kein Befund dieses Slices: Nimmt man eine Teilzahlung zurück (`resetPayment`, `statement.service.ts:839ff.`), wird ein wartendes neues PDF nicht neu erstellt. Es nennt dann eine Zahlung, die nicht mehr gilt, und verlangt zu wenig. Das ist das Gegenstück zu #1016 und war schon auf der Basis so. Ob dafür ein Issue nötig ist, entscheidet der Aufrufer.

Geprüft: Die Bedingung `body.status === 'paid' && statement.newPdfToSend` greift nur bei einer Teilzahlung, auch auf einer überfälligen Abrechnung. `laterSendings` erhält den gespeicherten Status `sent` (`statement.service.ts:345, 361`), und eine volle Zahlung setzt `newPdfToSend: null`. `keepNewPdf` setzt `redeliverable` und ein versendetes Statement-Dokument voraus; beides gilt in diesem Fall. Fehler werden wie in `PUT /:id` nur geloggt (Z. 249). Die Antwort wird neu gelesen und hat dieselbe Form, ein Contract ist also nicht betroffen. Es gibt keine UI-Texte, keine Sicherheitsfragen und keinen ungenutzten Code; der Diff ist minimal.
