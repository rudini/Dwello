# Code-Review #1029, Runde 1 (2cfd6477f)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/routes/config/categories/CategoryForm.svelte:129-135 | Kein DOM-Test pinnt die neue Beschreibung. Abgedeckt ist sie nur durch das E2E-Szenario. `category-predefined.dom.test.ts` montiert `EditCategoryPage` bereits und hat mit `description()` (Zeile 76-80) schon einen Helfer, der `aria-describedby` auflöst. Dort liessen sich günstig zeigen: (a) die Folge des Umstellens steht nach dem Umstellen in der Beschreibung der Gruppe `category-allowance`; (b) eine eigene Kategorie und die Seite «Neue Kategorie» verweisen auf keine Id `category-consequence`. Fall (b) zeigt heute kein Test. |

Keine Blocker/Major.

Geprüft:
- Die Kopplung über die Id ist in der App schlüssig. `CategoryForm` hat drei Verwender: die Bearbeitungsseite, «Neue Kategorie» und DOM-Tests. Nur auf der Bearbeitungsseite gibt es `category.predefined` zusammen mit der Hinweisbox, und dort steht `<p id="category-consequence">` unter derselben Bedingung `data.category.predefined`.
- «Neue Kategorie» (`category` undefined) und eigene Kategorien (`predefined` false) bekommen keinen Verweis.
- Verknüpft ist der richtige Absatz: die Folge des Umstellens (`categories_predefined_allocable`/`_not_allocable`), nicht der allgemeine Hinweis und nicht der KI-Absatz zu Name/Beschreibung.
- `RadioGroup` hängt `describedby` an Fehler- und Hilfe-Id an, die Hilfe bleibt also erhalten.
- Keine neuen Texte, also keine Änderung an `messages/*.json` nötig.
- Kein neuer Bildschirm und kein neuer Zustand.
- Das Szenario «Geänderte vordefinierte Kategorie nennt keinen festen Grund» ist unverändert.
- Das neue Szenario ist fachlich formuliert (keine UI-Wörter).
- Die Steps rufen nur Task und Question. `chooseAllowed` ist ein `Check`, `sees` pollt.
- Rot ohne die Änderung, nach dem Lesen: Die Beschreibung bestand vorher nur aus dem Hilfetext, weil der Grund bei abweichender Wahl entfällt.
- Der erwartete Text steht in `categories_predefined_not_allocable`. «Feuerlöscher-Wartung» ist voreingestellt nicht umlagefähig (Szenario Zeile 60).
- Nichts im Diff ist fremd zur Anforderung.

## Nicht bestätigt
- Vom Aufrufer gemeldet: `bun run lint` und `bun run check` sauber; Prettier ohne Diff; Vitest (categories-page.dom, category-allocability.dom, category-predefined.dom, categories, config-pages) 127 bestanden; E2E Chromium (`categories.feature` sowie die axe- und Sprachzeilen der Bearbeitungsbildschirme von Kategorien) 68 bestanden; das neue Szenario rot gesehen. Nichts davon selbst ausgeführt.
- Den Wortlaut der Entscheidung in Issue #1029 nicht nachgelesen: `gh issue view` lieferte nichts. Geprüft gegen die Anforderung im Auftrag.
