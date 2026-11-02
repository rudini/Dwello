# Code-Review 1047, Runde 1 (9ea54f24c)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | src/lib/ui/dialog-submit.ts:20-25 | Ersetzt den Verlaufseintrag bei jeder Weiterleitung, auch bei `?/endDeletingDraft` und `?/continueDeletingDraft` des Vertrags. Diese Aktionen löschen nicht die angezeigte Seite, sie führen von der Vertragsseite, die es weiterhin gibt, in den Abrechnungsassistenten. Der Kommentar «a delete» und die Commit-Nachricht («every such action is a delete») stimmen nicht. |
| C-2 | Major | tests/e2e/features/statements.feature:98 | Das neue Szenario bleibt `@wip`. Damit läuft es nicht in CI, und «Done means» (Szenario ohne `@wip`) ist nicht erfüllt. |

## C-1 (Major): Ersetzen auch bei Weiterleitungen ohne Löschen der angezeigten Seite

Die Annahme des Aufrufers stimmt nicht: Nicht jede Aktion, die über `dialogSubmit` weiterleitet, ist ein Löschen der angezeigten Seite.
- `src/routes/contracts/[id]/+page.svelte:207-214`: Das Formular `?/endDeletingDraft` nutzt `dialogSubmit`. In `src/routes/contracts/[id]/+page.server.ts:288-297` endet die Aktion mit `throw toWizard(draft)`, also mit einem 303 auf `wizardLink(...)` (Zeile 265-273).
- `src/routes/contracts/[id]/FixedTermCheck.svelte:75-79`: Das Formular `?/continueDeletingDraft` nutzt `submit(...)` und damit `dialogSubmit`. In `+page.server.ts:303-310` endet es ebenfalls mit `throw toWizard(draft)`.

Gelöscht wird dabei ein Entwurf, die Seite `/contracts/<id>` bleibt bestehen und wurde gerade geändert (Vertragsende gesetzt bzw. Vertrag läuft unbefristet weiter). Vor der Änderung führte «Zurück» aus dem Assistenten auf die Vertragsseite. Jetzt ersetzt der Assistent diese Seite im Verlauf. «Zurück» überspringt sie und führt auf die Seite davor, zum Beispiel die Vertragsliste oder das Dashboard. Für den Liegenschaftsverwalter, der den Assistenten abbrechen will, ist das eine sichtbare Verschlechterung. Weder #1047 noch der Commit begründen sie.

So zeigt sich der Fehler: Auf der Vertragsseite das Vertragsende eintragen, das wegen eines Entwurfs abgelehnt wird. Dann «Entwurf löschen» (`delete-draft-and-continue` oder die Aktion `endDeletingDraft`) wählen; der Assistent öffnet sich. Ein `page.goBack()` landet danach nicht auf `/contracts/<id>`. Auf DOM-Ebene genügt `contract-detail-page.dom.test.ts:198` bzw. `:1114` mit der Prüfung, dass `goto` ohne `replaceState: true` aufgerufen wird; heute ist diese Prüfung rot.

Abhilfe: Ersetzen nur dort, wo die Aktion den Datensatz der Seite löscht, etwa über einen Parameter von `dialogSubmit`, den nur FormDialog (Abrechnung löschen) und die ActionDialogs für Mieter und Vertrag löschen setzen. Danach Kommentar und Commit-Text richtigstellen.

## C-2 (Major): Szenario noch `@wip`

`statements.feature:97` setzt `@wip` vor «Nach dem Löschen eines Entwurfs führt Zurück im Browser nicht auf den Entwurf». Das Verhalten ist umgesetzt und das Szenario soll laut Aufrufer grün sein. Ohne das Entfernen von `@wip` läuft es in CI nicht, und die Anforderung «A scenario shows it» ist auf `main` nicht abgesichert. So zeigt sich der Fehler: `bun run test:e2e` schliesst das Szenario aus. Abhilfe: Tag entfernen. Das ist für ein neues Szenario frei.

## Nicht bestätigt

- vom Aufrufer gemeldet: `bunx vitest run --changed origin/main` (435 passed), `bun run lint`, `bun run check`, E2E chromium statements/statement-detail/tenants/contract-detail (214 passed), Rotlauf des Szenarios auf der Basis («Received "/statements/<id>"») und des neuen DOM-Tests.
- Gleichwertigkeit von `goto(location, { invalidateAll: true })` mit dem bisherigen `update()` → `applyAction` bei einem Redirect: Ich habe sie aus der Kenntnis von SvelteKit 2 beurteilt (applyAction ruft für `redirect` intern `goto(location, { invalidateAll: true })` auf; Fokus und Formular-Reset betreffen dort nur `success`). Den SvelteKit-Quelltext habe ich nicht gelesen, weil der Worktree keine `node_modules` hat. Externe Redirect-Ziele würfen bei `goto`; alle Ziele der betroffenen Aktionen sind intern (`grep redirect( src/routes src/lib/server`).
- Ob `hooks.server.ts:59` (Sitzung abgelaufen → 303 auf `/login?redirectTo=…`) bei einer Dialog-Aktion als `redirect`-Ergebnis ankommt und die Detailseite nun im Verlauf durch die Anmeldeseite ersetzt, habe ich nicht verfolgt.

Geprüft: Toast in `redirected` (gleiche Reihenfolge), `busy(false)` nach der Navigation, Rotlauf des DOM-Tests (ohne Änderung wird `update` aufgerufen, `goto` nicht), Schichten des Schritts/Tasks (Schritte rufen nur Task und Frage; `Wait.forUrl` vor `Browser.back` verhindert den Wettlauf; die Frage `pageAddressInApp` gibt den Wert zurück), Mocks der drei DOM-Testdateien.
