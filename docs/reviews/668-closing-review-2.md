# Code-Review 668-closing, Runde 2

Worktree `review-668-closing-2` bei 35d3582, Delta `614a590..35d3582` ohne `docs/reviews`, `docs/design/personas`, `docs/archive` und `implementation_plan.md`. Geändert sind `LeaveConfirm.svelte`, `contract-edit.dom.test.ts`, `contract-edit.feature` und `contract-form.steps.ts`.

Geschlossen: C-4, C-5, C-6

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-7 | Minor | src/routes/contracts/LeaveConfirm.svelte:10-12 | Der Kommentar sagt das Gegenteil des Codes. «a link while the save runs still asks (668-closing C-6); so does the way to the sign-in» bezieht «so does» auf «still asks». Danach würde auch der Weg zur Anmeldung nachfragen. Der Code lässt `/login` aber ohne Rückfrage durch (Zeile 24), und der Test «lässt den Weg zur Anmeldung ohne Rückfrage gehen» prüft genau das. |

## Nicht bestätigt

- Produktentscheid: #668, «Decided (product owner)» 2, nennt «the menu». Die Änderung liest das als Hauptnavigation, «Abmelden» im Benutzermenü fragt nicht mehr nach. Das ist vertretbar und war in Runde 1 als Alternative genannt. Der Pull Request muss diese Lesart aber nennen, wie der Aufrufer ankündigt. Den Text des Pull Requests konnte ich nicht prüfen.
- C-6, nur durch Lesen bestätigt: Während `saving` ruft auf der Bearbeitungsseite nur `put` ein `goto` auf (`ContractForm.svelte:228`). Die übrigen `goto` gehen alle nach `/login` (`api.ts:145`, `Header.svelte:46`, `+layout.svelte:42`) und kommen schon durch die Ausnahme für `/login` durch. `dialog-submit.ts` und die Filter- und Suchkomponenten werden auf der Bearbeitungsseite nicht eingebunden. Eine fehlgeschlagene PUT-Anfrage setzt `saving` zurück (`ContractForm.svelte:215`). `apiCall` wirft nie, ein Netzwerkfehler kommt als `NETWORK_ERROR` zurück (`api.ts` `request`, catch-Zweig). Damit bleibt `saving` nicht hängen. Ob der Wächter nach einer fehlgeschlagenen Anfrage wieder fragt, prüft kein DOM-Test. Der Code zeigt es.
- C-5, nur durch Lesen bestätigt: Auf dem alten Stand (`goto(leaving.url)`) hätte das Szenario rot sein müssen. Das zweite «Zurück» führt dort zum Formular, also `/contracts/<id>/edit`, und `pageAddress` entspricht dann nicht `/\/contracts$/`. Ob `page.goBack()` bei einem abgebrochenen `popstate` zuverlässig zurückkehrt, habe ich nicht ausgeführt. Der Aufrufer meldet 3 von 3 grün mit repeat-each.
- Vom Aufrufer gemeldet: DOM-Tests zu C-4 und C-6 erst rot, dann grün; vitest 4222 bestanden; lint und check sauber; fitness, fallow und Prettier sauber; E2E über 7 Features, 241 bestanden; axe 4 bestanden.

Geprüft: Das Szenario hält die Screenplay-Regeln ein. Es nutzt die Tasks `goBackInBrowser` und `discardChanges` wie der Schritt der Hauptnavigation, und die Fragen `pageTitle` und `pageAddress` antworten mit dem Wert. Es ist ohne `@wip`, kein Schritt auf `main` ist gelockert, und es enthält keine UI-Wörter. Der DOM-Test zu C-6 wäre mit dem alten `if (saving) return` rot, der zu C-4 mit der alten Bedingung. «fragt nach dem Speichern nicht» übergibt weiter `type: 'goto'`. Es gibt keine neuen Texte und keinen ungenutzten Code.
