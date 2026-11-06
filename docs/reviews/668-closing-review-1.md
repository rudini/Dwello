# Code-Review 668-closing, Runde 1

Worktree `review-668-closing` bei 614a590, Diff `cd4a0d8..614a590` ohne `docs/reviews`, `docs/design/personas`, `docs/archive` und `implementation_plan.md` (geändert: `LeaveConfirm.svelte`, `ContractForm.svelte`, `contract-edit.dom.test.ts`).

Geschlossen: C-1, C-2 (aus 668-n3-review-1). C-3 ist im Code umgesetzt, beim Abmelden schützt die Rückfrage aber nichts, siehe C-4.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-4 | Major | src/routes/contracts/LeaveConfirm.svelte:22, src/lib/ui/Header.svelte:38-46 | Beim Abmelden kommt die Rückfrage erst, wenn die Sitzung schon beendet ist (`POST /auth/logout`, dann `goto('/login')`). Wer «Weiter bearbeiten» wählt und dann speichert, erhält 401 und landet ohne Rückfrage auf der Anmeldung, die Änderungen sind weg. Der Dialog verspricht damit etwas, das er nicht halten kann. |
| C-5 | Major | tests/e2e/features/contract-edit.feature:325-372 | Die sichtbaren Korrekturen dieser Runde haben kein Szenario. Das gilt für C-1 («Zurück», «verwerfen», dann nochmals «Zurück» öffnet das Formular nicht wieder) und für C-3 (Abmelden fragt nach). Beides lässt sich mit E2E zeigen (`page.goBack()`, Benutzermenü). Der Commit nennt kein `No scenario: <reason>`. |
| C-6 | Minor | src/routes/contracts/ContractForm.svelte:209 | `saving` ist schon während der laufenden PUT-Anfrage `true`. Darum lässt der Wächter in dieser Zeit jede Navigation ohne Rückfrage durch (Link, «Zurück», Menü). Vor der Änderung hat er dabei gefragt. Scheitert die Anfrage danach, ist der Verwalter schon auf einer anderen Seite: Er sieht den Fehler nicht, und die Änderungen sind verloren. Das Zeitfenster ist kurz, ein Test dazu fehlt. |

## C-4: Rückfrage nach dem Abmelden ohne Wirkung

`Header.svelte` `logout()` löscht zuerst die Entwürfe, sendet dann `POST /auth/logout` und ruft erst danach `await goto('/login')` auf. Erst dieser Aufruf löst `beforeNavigate` aus. Seit 30ee569 bricht `LeaveConfirm` ihn ab und zeigt «Änderungen verwerfen?», die Sitzung ist zu diesem Zeitpunkt aber schon beendet. «Weiter bearbeiten» lässt den Verwalter in einem Formular ohne Sitzung zurück. Speichert er, antwortet der Server mit 401, `api.ts:145` ruft `goto('/login')` auf, und das geht wegen `saving === true` ohne Rückfrage durch. Damit gehen die Änderungen trotz Rückfrage verloren. Der Text des Dialogs («Ihre Änderungen sind noch nicht gespeichert und gehen verloren») und «Weiter bearbeiten» versprechen, dass Weiterarbeiten möglich ist. Vor der Änderung verlor der Verwalter die Eingaben ohne Frage, jetzt verliert er sie nach einer Frage, die ihn in die Irre führt.

So lässt es sich zeigen: Bearbeitungsseite öffnen, Nettomiete ändern, im Benutzermenü «Abmelden» wählen, im Dialog «Weiter bearbeiten», dann «Speichern». Dwello zeigt die Anmeldung, und der Mietvertrag hat die alte Nettomiete. Die Rückfrage gehört vor `POST /auth/logout`. Alternativ fragt der Weg zur Anmeldung nicht, so wie vor C-3, dann muss aber der Kommentar das sagen.

## C-5: Kein Szenario für die Korrekturen C-1 und C-3

Die Regel in CLAUDE.md, Workflow 1, verlangt: Eine Korrektur, die der Benutzer sieht, bekommt ein Szenario ohne `@wip`. Die drei neuen DOM-Tests rufen den `beforeNavigate`-Callback direkt mit `type: 'popstate'`/`'goto'` auf. Was SvelteKit tatsächlich übergibt (das Vorzeichen von `delta`, die Wiederherstellung mit `history.go(-delta)` bei `cancel()`, ob `goto` aus dem Header den Callback der Seite erreicht), zeigen sie nicht. Sie zeigen auch nicht, ob der Verlauf nach dem Verwerfen stimmt. Die Szenarien in `contract-edit.feature` (325-372) decken Abbrechen, den Link zum Mietvertrag, die Hauptnavigation, den Breadcrumb und das Ziel nach dem Verwerfen ab. Den Browser-Verlauf und das Abmelden decken sie nicht ab. Ein Szenario «Nach dem Verwerfen mit Zurück öffnet ein weiteres Zurück das Formular nicht wieder» würde zeigen, ob C-1 im Browser wirkt.

## Nicht bestätigt

- Vorzeichen von `delta`: Nur durch Lesen bestätigt. In SvelteKit ist `delta` bei «Zurück» -1, und `cancel()` stellt mit `history.go(-delta)` wieder her. `history.go(delta)` führt also zum Ziel, das der Verwalter gewählt hat, auch bei «Vorwärts» (+1). Den Quelltext von SvelteKit konnte ich ohne `node_modules` nicht nachlesen. Kein E2E-Test prüft es (C-5).
- Fehlgeschlagenes Speichern: `saving = false` steht nur im Fehlerzweig (`ContractForm.svelte:215`). Indirekt prüft das «Entwurf löschen und speichern» nach einer 409 (`contract-edit.dom.test.ts:225-247`): Der Knopf hat `busy={saving}` und liesse sich sonst nicht drücken. Dass der Wächter danach wieder fragt, prüft kein Test. Wirft `apiCall` bei einem Netzwerkfehler, bleibt `saving` dauerhaft `true`, und der Wächter ist aus. Den Pfad `api.ts:185` habe ich nur überflogen. Das galt für den Knopf schon vorher.
- Speichern mit Weiterleitung: `fragt nach dem Speichern nicht` schlägt fehl, wenn `saving` wieder `false` wird. `deleteDraftAndSave` läuft ebenfalls über `put` und ist damit abgedeckt.
- Andere `goto` in der Bearbeitungsseite: Ausser in `put` (Speichern) und in `discard` gibt es keine (`ContractForm.svelte`, `[id]/edit/+page.svelte`). `api.ts:145` (401) fragt jetzt, wenn er ausserhalb des Speicherns ausgelöst wird, z. B. durch `loadContracts` nach einer Änderung. Wer dann «Weiter bearbeiten» wählt, endet wie in C-4.
- Vom Aufrufer gemeldet: 3 neue DOM-Tests rot, dann grün; vitest 4220 bestanden; lint, check, Backend-type-check sauber; fitness `--base origin/main`, fallow, Prettier sauber; E2E 6 Features 220 bestanden, kein Szenario bleibt am Dialog hängen; axe 76 bestanden.

Geprüft: Die neuen DOM-Tests schlagen ohne die Änderung fehl: C-1 erwartet `go(-1)` statt `goto`, C-2 die Reihenfolge und das leere `from`, C-3 den Abbruch bei `goto`. `contractBody` gibt die Nebenkostenarten in der angezeigten Reihenfolge aus (`ticked`) und lässt ein leeres «Gültig ab» weg. Keine neuen Texte, kein ungenutzter Code, kein kopierter Helfer.
