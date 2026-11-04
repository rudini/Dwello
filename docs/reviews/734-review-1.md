# Code-Review #734, Runde 1 (f3e30b3d1, `git diff origin/main HEAD`)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | src/routes/documents/refused/+page.server.ts:23, +page.svelte:29 | Open Redirect: Die Prüfung `/^\/(?![/\\])/` lässt `back=/%09/evil.example` durch. Der Browser entfernt Tab und Zeilenumbruch aus der URL, also führt «Zurück» nach `//evil.example`. |
| C-2 | Major | tests/a11y/screens.json:831-843, accessibility.feature:249, sprachen-bildschirme.feature:250 | Für die neue Seite gibt es nur Zeilen mit STATEMENT_NOT_FOUND und ohne Herkunft. Die Variante mit zwei Bedienelementen («Zu den Einstellungen» + «Zurück») und den neuen Titel `documents_refused_pdf` prüfen weder axe noch die Sprachprüfung. |
| C-3 | Minor | src/routes/documents/refused/+page.server.ts:17,20; src/lib/server/statement.ts (`if (kind) refused.set(kind, '')`) | Kein Test schlägt fehl, wenn der Titel «PDF nicht verfügbar» oder der Satz für `view` bricht. Der Test `statement-endpoints.test.ts:158` prüft nur mit `toContain('Das PDF konnte nicht erstellt werden')`. Diesen Teil enthalten beide Ersatzsätze. |
| C-4 | Minor | docs/design/design-decisions.md:18 (D7b), docs/design/token-referenz.md:3 | Beide nennen `pdfRefusal` weiterhin als Seite ausserhalb der App mit `CanvasText`-Stil. Das stimmt nicht mehr: #734 ersetzt D7b (die damals «nicht gewählte» App-Hülle). |

## C-1 (Major): Open Redirect über `back`

`/documents/refused` ist eine normale, angemeldete App-Seite und nimmt `back` aus der Adresse. `pdfRefusal` erzeugt `back` zwar nur aus dem eigenen Referer, aber jeder kann einem angemeldeten Verwalter einen Link schicken. Der Link führt auf eine echte Dwello-Seite mit einer echten Dwello-Fehlermeldung.

Zum Zeigen: `/documents/refused?back=%2F%09%2Fevil.example` öffnen. `query.get('back')` liefert `"/\t/evil.example"`. Der Regex sieht als zweites Zeichen einen Tab und lässt die Adresse durch. Svelte schreibt sie unverändert in `href`. Der URL-Parser des Browsers entfernt «ASCII tab or newline» (WHATWG URL). Damit wird daraus `//evil.example`, eine protokollrelative Adresse auf eine fremde Seite. `%0A` und `/%09%5Cevil.example` wirken genauso.

Kein Test deckt die Prüfung von `back` in `load` ab: `pdf-refusal.test.ts` prüft nur `pdfRefusal`.

Fix: In `load` die Adresse auflösen und den Ursprung vergleichen. Beispiel: `const to = new URL(back, url); back = to.origin === url.origin ? to.pathname + to.search : null`. Dazu ein Unit-Test mit `/%09/…`, `//…` und `https://…`. Kürzer ginge es auch ohne Parameter: Der Browser behält den Referer der ursprünglichen Navigation über die 303-Weiterleitung, `load` könnte ihn also selbst lesen.

## C-2 (Major): Variante der Fehlerseite fehlt in den Bildschirm-Zeilen

`CLAUDE.md` («Process») verlangt eine Zeile pro Variante mit eigenen Bedienelementen, auch wenn eine Änderung einen bestehenden Zustand anders zeigt. Die Seite ist jetzt neu gebaut: App-Hülle, `Button`-Komponenten, h1-Titel. Ihre Variante für IBAN- oder Firmenadress-Ablehnungen hat zwei Schaltflächen und den neuen Titel «PDF nicht verfügbar» / «PDF non disponible» / «PDF non disponibile» / «PDF not available».

Keine der drei Zeilen erreicht diese Variante:
- `statement-pdf-refused` und `statement-zip-refused` nutzen eine unbekannte Id, also STATEMENT_NOT_FOUND.
- `contract-consent-letter-refused` zeigt den Brief-Titel.

Damit läuft für die neuen Texte in fr/it/en keine Sprachprüfung und für die Variante kein axe-Lauf.

Zum Zeigen: Kein Pfad in `screens.json` erreicht `code=IBAN_MISSING` oder ein anderes Ziel ausser «Abrechnung nicht gefunden» oder «Brief nicht verfügbar».

Fix: Einen Zustand bzw. Bildschirm ergänzen, etwa mit Pfad `/documents/refused?code=IBAN_MISSING&back=%2Fstatements`. Er braucht eine Bedeutung in `stateMeanings` und je eine Zeile in `accessibility.feature` und `sprachen-bildschirme.feature`.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - `bun run lint`, `bun run check`
  - `bunx vitest run` (205 Dateien, 4060 Tests)
  - E2E chromium von statements, statement-detail, statement-generate und contract-detail (319)
  - die axe- und Sprachzeilen von statement-pdf-refused, statement-zip-refused und contract-consent-letter-refused (6)
  - die Rot-Läufe der 3 neuen Szenarien und der 4 Tests in `pdf-refusal.test.ts`
- Der PR-Text mit `Spec change approved: #734` und `Fixes #734` existiert noch nicht (Plan, offene Punkte). Die Freigabe der geänderten Schritt-Definition und der vier Feature-Zeilen hängt daran.
- Der Wortlaut von Issue #734 wurde nur aus dem Auftrag des Aufrufers übernommen, nicht im Issue selbst gelesen.
- Bei `SendDialog.svelte:133` (`target="_blank"`) setzt `Button` die Angabe `rel="noopener noreferrer"`. «PDF ansehen» aus dem Versanddialog führt deshalb nie zur Herkunft zurück, sondern immer zur Liste. Das passt zum Entscheid («sonst die Liste»), ein Szenario dazu gibt es nicht.

Geprüft:
- Die vier Sätze `backend_statement_not_found` stimmen wörtlich mit dem Entscheid überein (fr mit ’).
- Die neuen Schlüssel stehen in allen vier `messages/*.json`.
- Tab-Titel und Hauptnavigation sind im Szenario (`common.steps.ts:23` prüft den `<title>`).
- Rücksprung zur gefilterten Liste und zum Mietvertrag ist abgedeckt. Die Liste speichert keinen Filter ausserhalb der Adresse, das Szenario wäre also ohne die Änderung rot.
- Die Lesart des Umsetzers zu STATEMENT_NOT_FOUND ist stimmig: `StatementRow`/`PdfAction` kommen nur in Liste und Detailseite vor, die ZIP-Datei nur im Assistenten. Die Lesart hält das Ende der entschiedenen Szenarien statement-detail:555 und statement-generate:609 unverändert.
- Umbenennung des Schritts: Die alte Formulierung wird nirgends mehr genutzt. Die Definition prüft unverändert `pdfRefusalText`.
- Screenplay-Schichten eingehalten.
- Die Seite liegt hinter der Anmeldung (`hooks.server.ts:15`), `/documents/refused` hat Vorrang vor `/documents/[id]`.
- Tokens wie in `+error.svelte`, Komponenten aus `src/lib/ui`.
- Keine fremden Änderungen; ponytail: nichts Ungenutztes und keine kopierte Hilfsfunktion.
