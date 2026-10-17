# Abschluss-Review: Hilfetext der Wohnungssuche (Helga P-1) – a59f10a..3fc40c6

Worktree: `review-search-cr2` (detached 3fc40c6). Alle 9 geänderten Dateien gelesen, dazu `ApartmentFilters.svelte:45-46`, `tests/e2e/steps/apartment-list.steps.ts:83-84`, `tests/e2e/questions/apartments.ts:8`, `tests/e2e/targets/apartments.ts:6`, `docs/design/i18n-begriffe.md`, Skills `slice-review`, `pull-request`, `ponytail-review`, Issue #373 (Text, Kommentare, Timeline per `gh api`) und #376.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | messages/de.json:472 (Issue #373, «Decided (product owner)», Zeile 13) | Der entschiedene Hilfetext wurde geändert und die Änderung in den Abschnitt «Decided (product owner)» geschrieben, ohne dass im Issue eine Zustimmung des Produktverantwortlichen sichtbar ist (0 Kommentare). Die Ausnahme in CLAUDE.md, «Coding guidelines», deckt das nicht ab. Ist die Zustimmung belegt, wird der Befund mit Verweis geschlossen. |
| C-2 | Minor | implementation_plan.md:13 | Der abgehakte Punkt verweist auf `docs/design/personas/helga-search-160.md`. Diese Datei fehlt im Commit, sie liegt nur ungetrackt im Arbeitsbaum des Aufrufers. Der Fix stützt sich auf ihren Befund P-1, deshalb gehört der Bericht in denselben Commit oder den nächsten (skill `slice-review`, Triage 1). |
| C-3 | Nit | Issue #373, Zeile 13 | Die Klammer «personas Helga and Marco on this issue» verweist auf Berichte, die im Issue nicht stehen (keine Kommentare). Besser auf `docs/design/personas/*-search-160.md` verweisen. |

Keine Blocker. ponytail-review: keine Befunde. Der Diff ändert nur den Text, einen Test und eine Szenariozeile.

### C-1 (Major): entschiedener Text ohne sichtbare Entscheidung geändert

CLAUDE.md, «Coding guidelines», erlaubt bei einem vorgeschriebenen Text nur eine Abweichung ohne Rückfrage: einen Text, der den Verwalter an einen Ort schickt, den die App nicht hat, gekürzt nur um diesen Ort. Für jede andere Änderung gilt: «any other change to a decided text or value is mine». «When to ask» nennt ausdrücklich: «a change to a text or value an issue decided, beyond what "Coding guidelines" allows».

Der neue Text ist inhaltlich gut, und der Befund P-1 trägt ihn (Marco P-1 schlägt genau diese Formulierung vor). Trotzdem wurde ein Beispiel durch ein Muster ersetzt, also keine Kürzung um einen Ort. Dazu steht die Änderung in «Decided (product owner)», was eine Entscheidung vorgibt, die nicht belegt ist.

So zeigt es sich:
- `gh api repos/rudini/Dwello/issues/373/comments` liefert `0`.
- Die Timeline zeigt nur `labeled` und `cross-referenced`, das Issue wurde um 02:22 bearbeitet.
- Kein Kommentar oder Vermerk nennt eine Zustimmung.

Die Bearbeitungshistorie liess sich nicht lesen (GraphQL in dieser Sitzung gesperrt).

Wie weiter: Die Zustimmung des Produktverantwortlichen einholen und im Issue vermerken, oder den Punkt unter «Blocked on me» führen. Liegt die Zustimmung schon vor (etwa im Chat), genügt ein Vermerk im Issue. Dann ist C-1 erledigt.

## Geprüft und bestätigt

- **Text de/fr/it/en** (`messages/*.json:472`): Das Beispiel «Seepark 3.02» ist in allen vier Sprachen durch das Muster ersetzt. Die Begriffe folgen `i18n-begriffe.md`: «nom de l’immeuble / numéro d’appartement», «nome dell’immobile / numero dell’appartamento», «building name / apartment number», jeweils gleich wie im ersten Satz. Ohne Anführungszeichen ist auch die Regel zu den Guillemets gegenstandslos. Der deutsche Text stimmt Wort für Wort mit dem heutigen Text von #373 überein. In `messages`, `src` und `tests` steht «Seepark 3.02» nirgends mehr.
- **DOM-Test** (`apartments-pages.dom.test.ts:155-158`): Er prüft jetzt den ganzen Text mit `toBe` statt nur des ersten Satzes mit `toContain`. Mit dem alten Text ist er rot (nach Lesen beurteilt: der alte Text endet auf «zum Beispiel «Seepark 3.02».»). Ich habe ihn neu ausgeführt: 21/21 grün.
- **Szenario** (`apartments.feature:63`): ohne `@wip`. Der Step ruft nur die Question `apartmentSearchHelp` auf (`Text.of`, also den Text selbst) mit `toContain` des ganzen Satzes. Mit dem alten Text ist es rot. Die Formulierung beschreibt das Was.
- **Kein neuer Bildschirm und kein neuer Zustand**: `screens.json` und die a11y- und Sprach-Features brauchen nichts Neues. Kein Token- oder Komponenten-Code geändert.
- **Fremde Änderungen**: keine. `docs/reviews/search-review-1.md` ist die vorgeschriebene Kopie des Berichts aus Runde 1. `marco-search-160.md` ist ein Persona-Bericht. Der Plan ist eine Session-Notiz, und #376 (Entscheid zu «Appartement/Appartamento/Apartment», offen, `entscheiden`) übernimmt C-1 aus Runde 1. `git diff --check` meldet nichts.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bunx vitest run` (2820), Backend-Type-Check, Backend-Tests (833, Coverage), E2E apartments und buildings (chromium und api, 20 passed), axe- und Sprachzeilen (12 passed), der Merge 12f4381 von origin/main. Selbst ausgeführt habe ich nur `bunx vitest run src/__tests__/apartments-pages.dom.test.ts` (grün).
- Ob der Produktverantwortliche dem neuen Text ausserhalb des Issues zugestimmt hat: nicht feststellbar, siehe C-1.
- Ob der DOM-Test vor der Textänderung tatsächlich rot gesehen wurde: nur durch Lesen beurteilt.
- Helgas Bericht P-1 selbst: im Worktree nicht vorhanden (C-2). Inhalt nur über Marco P-1 und die Anforderung des Aufrufers.
- Wie der längere Hilfetext in fr/it auf 390 px umbricht: nicht im Browser angesehen. Die Helga-Runde 2 steht laut Plan noch aus.
