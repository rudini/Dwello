# Code-Review Runde 1: W5b (#166, #219), `git diff 76424e0 2cc0749`

Worktree: `review-w5b-code` (detached auf 2cc0749). Gelesen: alle 26 geänderten Dateien, dazu `backend/src/routes/categories.ts`, `backend/src/routes/delete-response.ts`, `backend/src/db/schema.ts` (Default von `type`), `src/routes/privacy/+page.server.ts`, `src/lib/ui/{Alert,Badge,Button}.svelte`, `tests/a11y/screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`, `UBIQUITOUS_LANGUAGE.md`, `docs/design/i18n-begriffe.md`, die Issues #166 und #219 und `.claude/skills/ponytail-review/SKILL.md`.

Ich habe keinen Blocker und keinen Major gefunden.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | `src/routes/config/categories/CategoryRow.svelte:55-56`, `+page.svelte:70` | «Sagt warum» steht nur als `aria-describedby` an einem deaktivierten Knopf, den die Tastatur nicht erreicht, und im allgemeinen Hinweis über der Liste. Wer mit Tab durch die Liste geht, hört den Grund am Knopf nie. Bei rund 30 Zeilen auf 390 px steht der sichtbare Grund weit weg vom Knopf. Das ist zulässig, die Fachreview hat es aber offen gelassen («Nicht bestätigt») und ein Persona-Lauf sollte es prüfen. |
| C-2 | Minor | `src/lib/server/category.ts:33-38` | Der Rückfall «unbekannt gilt als eingeschaltet» (`.catch(() => true)`, `enabled !== false`) hat keinen Test. `categories.test.ts` prüft nur die Antworten `true` und `false`. |
| C-3 | Nit | `src/lib/server/category.ts:35` | reuse: Die Seite wiederholt `process.env.BACKEND_URL \|\| 'http://localhost:3001'`, obwohl `API` in derselben Datei schon darauf aufbaut. Eine Konstante `BACKEND` für beide reicht. |
| C-4 | Nit | `backend/src/services/category.service.ts:177-178` | shrink: Die Destrukturierung mit `_key` läuft auch für eigene Kategorien. Kürzer: `const data = stored?.type === 'predefined' ? { ...changes, name: undefined } : changes;` (Drizzle übergeht `undefined` in `set`). |
| C-5 | Nit | `src/routes/config/categories/+page.svelte:69-70` | V-6 ist nur halb umgesetzt: Die zwei Sätze zum Löschen stehen jetzt im selben Absatz, sagen aber weiterhin zweimal hintereinander «lassen sich nicht löschen». |
| C-6 | Nit | `docs/design/i18n-begriffe.md` | Das Begriffspaar «Von Dwello» / «Eigene» (fr «De Dwello» / «Personnalisée», it «Da Dwello» / «Personalizzata», en «From Dwello» / «Custom») fehlt in der Begriffstabelle. Der Glossarbegriff kommt neu in die Oberfläche. |
| C-7 | Nit | `CategoryRow.svelte:37-40` | Die Badges «Eigene» und «Nicht umlagefähig» haben beide den Ton `neutral` mit demselben Symbol. Sie stehen direkt nebeneinander und unterscheiden sich nur durch das Wort. |

Ponytail-Review: C-3 und C-4 sparen zusammen etwa 2 Zeilen, sonst ist der Diff schlank. `net: -2 lines possible.`

## Bestätigt (Anforderung → Code → Test)

- **#166, Kennzeichnung in der Liste:** Badge `category-kind` mit «Von Dwello» / «Eigene» (`CategoryRow.svelte`). Abgedeckt durch den DOM-Test in `category-predefined.dom.test.ts` und das Szenario «Vordefinierte und eigene Kategorien sind gekennzeichnet». Beide schlagen ohne die Änderung fehl, weil es kein `category-kind` gibt.
- **#166, Kennzeichnung im Bearbeitungsformular:** `Alert` mit dem Titel «Kategorie «Von Dwello»» (`[id]/edit/+page.svelte`). Abgedeckt durch einen DOM-Test und das Szenario «Bearbeiten einer vordefinierten Kategorie»; beide schlagen ohne die Änderung fehl.
- **#166, nicht löschbar:** Der Knopf ist deaktiviert (`count > 0 || category.predefined`) und nennt seinen Grund über `aria-describedby`. Abgedeckt durch DOM-Tests, das Szenario (Liegenschaftssteuer hat im E2E-Bestand keine Rechnungen, schlägt also ohne die Änderung fehl) und das Backend: `deleteCategory` antwortet mit `CATEGORY_PREDEFINED` (409). Die Antwort trägt einen Code, `backend_category_predefined` steht in allen vier Sprachen, `docs/api-specification.md` ist ergänzt. `category-predefined.pg.test.ts` schlägt ohne die Änderung fehl (204).
- **#166, Schlüssel bleibt fest:** `updateCategory` lässt `name` bei `type = 'predefined'` weg. Der pg-Test schlägt ohne die Änderung fehl. Das BFF schickte `name` beim Bearbeiten schon vorher nicht mit (`parseCategory`).
- **#166, Hinweistext nach der Fachreview:** V-1 (Folge für schon erfasste Rechnungen, kein Zurückholen), M-1 (Umlagefähigkeit nach Gesetz), V-3 (deutscher Name und Beschreibung, KI-Satz nur bei eingeschalteter KI), V-4 (eigener Löschgrund «weil Dwello sie mitliefert»), V-6 (siehe C-5), V-7 (Schritt «eigene Kategorie»). Die Aussage von V-1 deckt sich mit `category.service.ts`: Nur der Wechsel auf `false` setzt die Rechnungen um, der Wechsel zurück hat kein Gegenstück. V-2 ist an #302 abgegeben.
- **#219:** `new/+page.server.ts` lädt `kiEnabled` aus `GET /api/v1/invoices/llm-recipient` (öffentliche Route, `backend/src/app.ts:69`). Das Formular zeigt «Von der KI prüfen lassen» nur bei `ki`. Abgedeckt durch einen Ladetest (true und false, URL) und einen DOM-Test; beide schlagen ohne die Änderung fehl. Die Begründung für «No scenario» stimmt: `LLM_ENABLED` wird beim Start des Backends gelesen. Die Antwort kommt aus dem Vertrag `tests/contracts/llm-recipient.json`.
- **Texte:** Alle neuen Texte stehen in allen vier `messages/*.json`, in Sie-Form, ohne «ß». Die Begriffe stammen aus `UBIQUITOUS_LANGUAGE.md:84-85`.
- **A11y und Sprachen:** `category-edit-predefined` und `categories` stehen schon in `screens.json`, `accessibility.feature:153` und `sprachen-bildschirme.feature:154`. Der neue Hinweis erscheint in einem Zustand, der schon geprüft wird. Der Zustand «Neue Kategorie bei ausgeschalteter KI» lässt sich im E2E-Stack nicht herstellen (siehe #219).
- **Design:** Es kommen nur `Alert`, `Badge` und `Button` aus `src/lib/ui` dazu, ohne neue Klassen.
- **Screenplay:** Die Schritte rufen nur `verwalter.sees(<Frage>)` auf. Die Fragen liefern Text (Badge, Beschreibung, Hinweis); ja/nein gibt es nur für «löschbar» (`Enabled`). Die Targets liegen in `targets/`. Die eigene Kategorie wird über `names` isoliert, die vordefinierte nur gelesen. Die Features beschreiben fachlich, ohne «klickt» und ohne «Knopf».
- **Nichts Fremdes:** Die angepassten Tests (`categories-page.dom`, `config-pages`, `focus-error.dom`) geben nur das neue `data.kiEnabled` mit. Die Prettier-Ausgabe der neuen Zeilen weicht nicht ab. Die Abweichungen in `categories.test.ts` stammen aus Zeilen, die schon vorher so waren.
- **Default `type = 'predefined'` im Schema:** Ausser `createCategory` (setzt `custom`) schreibt kein Produktionscode in `categories`. Durch den Default wird also keine eigene Kategorie versehentlich unlöschbar.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` (2659), `cd backend && bun run test` (703) und die E2E-Auswahl (52, inkl. axe und Sprachzeilen der Kategorie-Bildschirme): vom Aufrufer gemeldet. Ich wollte `bunx vitest run` für `category-predefined.dom`, `categories` und `categories-page.dom` erneut laufen lassen, eine Deny-Regel hat aber den Zugriff auf `node_modules` blockiert (Symlink nach `/home/user/Dwello`). Dass die Tests ohne die Änderung fehlschlagen, habe ich nur durch Lesen beurteilt.
- Ob ein Screenreader den Grund am deaktivierten Löschknopf ansagt (C-1). Das lässt sich nur im Browser bzw. mit einem Persona-Lauf prüfen.
- Fachliche Richtigkeit des Satzes nach M-1 und des Löschgrunds nach V-4 in der umgesetzten Fassung: Das gehört zum fach-reviewer (der Text wich vom Vorschlag in V-4 ab).
