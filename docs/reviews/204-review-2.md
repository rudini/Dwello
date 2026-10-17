# Code-Review #204 / #220, Runde 2 (Schlussreview)

Gegenstand: `git diff 7f838ea 5cb6ff5` (686932b, 5cb6ff5) und der Merge-Commit c7e24e9, Worktree `review-204-close`.

Gelesen:
- alle Dateien des Deltas: `migrations.pg.test.ts`, `CategoryForm.svelte`, `category-predefined.dom.test.ts`, `implementation_plan.md`, `docs/reviews/204-review-1.md`, `docs/design/personas/{marco,weber}-204.md`
- dazu `src/lib/ui/Textarea.svelte`, `src/lib/ui/field.ts`, `backend/migrations/0007_category_descriptions.sql`, `backend/src/db/migrate.ts`, `tests/e2e/targets/categories.ts`
- Merge: `git diff 5f7e47c8 c7e24e9 --stat` (zeigt gegenüber main nur Dateien dieses Zweigs) und die von main eingebrachte Änderung an `schema.ts`

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-5 | Major | src/routes/config/categories/CategoryForm.svelte:105-108 | `rows={3}` behebt P-1 bei 390 px nicht. Bei Heizung und Gartenpflege steht der «ohne …»-Teil ab Zeile 4. Das Feld wächst nicht mit dem Inhalt. Details unten. |
| C-6 | Minor | src/__tests__/category-predefined.dom.test.ts:46 | Der Test greift mit einem CSS-Selektor (`#description`) zu. `CLAUDE.md` («Selectors») verlangt `data-testid`. `Textarea` kann ein `testid` annehmen, z. B. `category-description-input`. |
| C-7 | Nit | backend/src/__tests__/migrations.pg.test.ts:85-97 | Der erste Fall prüft nicht mehr, dass eine nicht betroffene Zeile (vorher Lift) unverändert bleibt. Geringes Risiko, weil jede `WHERE`-Bedingung auch den gelieferten Text verlangt. |

## C-5 (Major): Die Beschreibung ist auf dem Telefon weiter abgeschnitten

**Warum falsch:** Beide Personas melden P-1 als Major. Marco meldet ihn ausdrücklich für Mobile 390 px und die Baumfällung bei Gartenpflege. Nach 5cb6ff5 zeigt die Seite ein `textarea` mit 3 Zeilen und fester Höhe. `Textarea.svelte` setzt nur `rows`, `controlClass` kein `field-sizing`, also kein Mitwachsen.

**Rechnung:** Marco hat gemessen, dass das Feld bei 390 px 354 px breit ist und 189 Zeichen 1566 px brauchen. Das sind rund 8,3 px pro Zeichen, also etwa 42 Zeichen pro Zeile. Umgebrochen nach Wörtern:
- **Gartenpflege:** Zeile 3 endet mit «Laub- und Unkrautentfernung; ohne». «Neubepflanzung, Baumfällung, …» steht erst in den Zeilen 4 und 5, also unsichtbar. Das ist genau der Teil, den Marcos Aufgabe braucht.
- **Heizung:** «ohne Reparatur, Erneuerung, Verzinsung und Abschreibung der Anlage» steht in den Zeilen 4 bis 6, also ganz unsichtbar. Das ist Webers Beispiel aus P-1.

Lesen kann man den Rest nur, wenn man im Feld scrollt. Auf Touch-Geräten ist die Scrollleiste meist ausgeblendet. P-1 bleibt damit für Mobile offen. Der Plan hakt ihn aber als behoben ab (`implementation_plan.md:14`).

**Wie zeigen:**
- Persona Marco auf «Kategorie bearbeiten › Gartenpflege» erneut laufen lassen (Mobile 390 × 844),
- oder in Playwright bei 390 px am Feld `#description` prüfen, ob `scrollHeight > clientHeight` gilt (erwartet: ja, also abgeschnitten).

Ein DOM-Test in jsdom kann das nicht zeigen, weil jsdom kein Layout hat. Der neue Test prüft nur den Elementtyp.

**Abhilfe, die kürzeste:** Das Feld mit dem Inhalt wachsen lassen (`field-sizing: content`, wenn Tailwind und die Design-Guard-Regeln die Klasse erlauben) oder `rows` so hoch setzen, dass der längste gelieferte Text (204 Zeichen, 6 Zeilen bei 390 px) ganz sichtbar ist. Wie in `CLAUDE.md`, Workflow 6, verlangt: vorher ein Test, der fehlschlägt.

## Bestätigt

**686932b (Antwort auf C-1):**
- Der neue Fall «lässt eine Beschreibung, die der Vermieter geändert hat, wie sie ist» ändert vorher alle sechs Zeilen. Fehlt in `0007` bei einer Zeile `AND description = …`, bekommt diese Zeile den neuen Text: Der Filter ist dann nicht leer, der Test wird rot.
- `toHaveLength(6)` schliesst aus, dass der Test leer durchläuft.
- Der erste Fall ist ohne `0007` rot, weil die alten Texte bleiben.
- Der Helfer `withoutDescriptions` wird zweimal gebraucht, ist also gerechtfertigt.
- C-1 ist damit erledigt. C-3 ist im Plan behoben.
- Die Ablehnung von C-4 ist nachvollziehbar.

**5cb6ff5:**
- `Textarea` kommt aus `src/lib/ui`, mit Label, Hilfe und `optional` wie vorher. Höhe mindestens 48 px (`min-h-12`), nur Token-Klassen.
- Keine neuen Texte, also nichts für `messages/*.json`.
- Kein neuer Bildschirm und kein neuer Zustand, also nichts für `screens.json`.
- Kein E2E-Target liest das Feld (`tests/e2e/targets/categories.ts` liest nur die Beschreibung in der Liste).
- Der DOM-Test ist ohne die Änderung rot (`INPUT` statt `TEXTAREA`).
- «No scenario» ist für einen reinen Wechsel des Feldtyps vertretbar.

**Merge c7e24e9:**
- Gegenüber `origin/main` (5f7e47c8) ändert der Merge nur die Dateien dieses Zweigs.
- `implementation_plan.md` enthält genau unsere Session. Die Session von main war schon archiviert.
- Main bringt keine Migration mit. `0007_category_descriptions.sql` bleibt die höchste Nummer; ein Konflikt in der Reihenfolge ist ausgeschlossen.
- Die Änderung an `schema.ts` betrifft nur einen JSON-Typ (`HeatingShare`) und berührt Kategorien nicht.

**Ponytail-Review:** Das Delta ist schlank (eine Zeile Komponente, ein Prop, ein Test, ein Helfer für zwei Aufrufe). Nichts ist ungenutzt.

**Unbeteiligte Änderungen:** keine.

## Nicht bestätigt

Vom Aufrufer gemeldet, nicht wiederholt:
- `bun run lint`
- `bun run check`
- `cd backend && bun run type-check`
- volle Backend-Suite (685 pass, vor dem Merge)
- die drei pg-Dateien nach dem Merge (26 pass)
- `bunx vitest run` für category-predefined, categories-page und categories (79 pass)
- Playwright chromium `-g 'ategor'` (53 pass)

Die pg-Tests habe ich nicht erneut laufen lassen, weil sie `dwello_test` neu aufsetzen.

Nicht im Browser angesehen:
- **C-5:** Die Zeilenzahl ist aus Marcos Messung (354 px Feldbreite, 1566 px für 189 Zeichen) und einem Umbruch bei 42 Zeichen geschätzt, nicht gemessen. E2E und Persona darf ich nicht starten.
- **Kehricht-Widerspruch (Weber P-2 = fach M-1):** laut Aufrufer unter «Blocked on me». Nicht geprüft.
