# Code review #1094, Runde 1

Bereich: `git diff 64a84bc71 6deeed60f -- . ':!implementation_plan.md'` (Worktree `review-1094-cr`)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | src/lib/server/statement.ts:276, src/routes/documents/refused/+page.svelte:31-35 | Mit gesetztem `back` heisst der Weg aus der Fehlerseite jetzt «Zurück» statt «Zu den Nebenkostenabrechnungen», obwohl er nicht zur Detailseite zurück, sondern zur Liste führt; kein Test prüft die Beschriftung |
| C-2 | Minor | src/lib/server/statement.ts:276 | Die Prüfung `filtered?.startsWith(\`${list}?\`)` hat keinen Test: ohne sie (z. B. `?list=/settings` oder `?list=/invoices?x` bei `STATEMENT_NOT_FOUND`) bleiben alle Tests grün |
| C-3 | Minor | src/routes/statements/[id]/SendDialog.svelte:133 | Der zweite PDF-Weg der Detailseite («PDF ansehen» im Versanddialog, `/statements/{id}/pdf?ansehen`) gibt `list` nicht mit; seine Fehlerseite einer inzwischen gelöschten Abrechnung führt weiter zur ungefilterten Liste |

## C-1 (Major): Der Weg zurück heisst «Zurück», führt aber zur Liste

Die Fehlerseite wählt die Beschriftung nach `data.back`: mit `back` zeigt sie `m.ui_back()` («Zurück»), nur ohne `back` «Zu den Nebenkostenabrechnungen». Vor dem Diff hatte eine gelöschte Abrechnung, die von der Detailseite aus angefordert wurde, kein `back`, und der Knopf hiess «Zu den Nebenkostenabrechnungen». Das ist der Weg, den die Anforderung meint («the way back «Zu den Nebenkostenabrechnungen»», Issue P-1). Jetzt setzt `pdfRefusal` in diesem Fall `back=/statements?…`, und der Knopf heisst «Zurück». Der Liegenschaftsverwalter kommt aber von der Detailseite der gelöschten Abrechnung. «Zurück» lässt ihn diese Seite erwarten, und er landet in der Liste. Das ist eine sichtbare Textänderung, die das Issue nicht entschieden hat, und sie macht die Seite unklarer, als die Personas sie gemeldet haben. Der neue Schritt «von dort zu den Nebenkostenabrechnungen zurückkehrt» klickt nur auf `pdf-refusal-back` und prüft die Beschriftung nicht. Deshalb bleibt der Fehler unsichtbar.

So zeigt man den Fehler: Im neuen Szenario «Von der Fehlerseite eines PDF der Detailseite zurück zur gefilterten Liste» vor dem Zurückkehren die Beschriftung von `pdf-refusal-back` lesen: sie ist «Zurück». Ein Unit-/DOM-Test der Seite mit `code=STATEMENT_NOT_FOUND&back=%2Fstatements%3Fstatus%3Ddraft` zeigt dasselbe. Behebung zum Beispiel so: Die Seite nennt die Liste, wenn `back` ein Pfad der Liste `data.list` ist (`/statements` oder `/statements?…`). Dazu kommt eine Frage nach der Beschriftung im Szenario oder ein Test auf der untersten Ebene.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bunx vitest run --changed origin/main` (431), `bunx vitest run src/__tests__/pdf-refusal.test.ts` (zuerst rot), `bun run fitness`, `bunx fallow audit`, E2E Chromium statements.feature + statement-detail.feature (147 grün; die beiden neuen Szenarien zuerst rot; der Lauf nach dem Verschieben in `$derived` steht noch aus).
- Ob `openStatement` mit `Wait.until(statementStatus)` alle bisherigen Aufrufer weiter trägt: Es gibt nur einen Aufrufer (`statements.steps.ts:100`), und `statement-status` steht ohne Bedingung auf der Detailseite (`+page.svelte:231`). Den Lauf habe ich nicht gesehen.

Geprüft: Rot ohne den Diff (Unit-Test und beide Szenarien); Herkunfts- und `//`-Prüfung von `back` in `documents/refused/+page.server.ts` (ein `?list=` mit dem Präfix `/statements?` kann nicht auf eine fremde Seite führen); keine neuen Texte; P-2 (die Seite nennt die Abrechnung nicht) unverändert; Screenplay-Schichten; ponytail-review: nichts zu kürzen.
