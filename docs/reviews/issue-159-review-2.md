# Code-Review issue-159, Runde 2 (nur Delta)

Geprüft: `git diff 07fd48f 387949f` (Commit `387949f fix(tests): one wording for the apartment search`) im Worktree `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/review-159-code-2`. Alle 9 geänderten Dateien gelesen: `apartments.feature`, `apartment-list.steps.ts`, `offene-punkte.md`, `implementation_plan.md`, die drei Persona-Berichte `docs/design/personas/{helga,marco,sven}-issue-159.md`, `docs/reviews/issue-159-review-1.md`, `docs/reviews/workflow-rules-review-issue-159.md`. Für die Triage zusätzlich gelesen: `src/routes/+layout.svelte` (afterNavigate), `src/lib/list-url.ts` (`isListSearch`), `src/lib/ui/EmptyState.svelte`, `src/routes/apartments/+page.svelte`, `docs/design/tools/persona-kit.mjs` und `git diff 1d871ef 387949f --stat -- src`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-3 | Nit | implementation_plan.md:20 | Der Punkt «code-reviewer round(s)» ist abgehakt, obwohl Runde 2 (diese) noch läuft und ihre Planzeile fehlt. Nach diesem Bericht die Zeile für Runde 2 ergänzen. |

Keine Blocker, keine Major.

## Bestätigt

- C-2 behoben: Das Szenario «Filter nach dem Zurücksetzen leer» nutzt jetzt den bestehenden Schritt «nach Wohnungen mit {string} sucht» (`apartments.feature:45`). Die doppelte `Given`-Definition ist entfernt (`apartment-list.steps.ts`). Laut grep nutzt kein anderes Feature die alte Formulierung mehr, also bleibt kein Schritt ohne Definition zurück. Das Szenario ist ohne `@wip` und genauso streng wie vorher (gleiche Aufgabe `searchApartments`, gleiche Prüfungen). Weil der Schritt nur noch einmal vorkommt, gibt es nichts Unbenutztes.
- C-1 als U-32 erfasst. Das ist nach Workflow 7 zulässig, denn der Punkt bestand schon vorher und ist ein Minor.
- Triage Sven (U-33): Das Verhalten stimmt mit dem Code überein. `afterNavigate` in `src/routes/+layout.svelte:60-63` setzt den Fokus nur, wenn `isListSearch` zutrifft (`src/lib/list-url.ts:18-21`: Navigationstyp `form` oder `goto` mit geänderter Query auf demselben Pfad). Folgende Wege lösen also keinen Fokus aus:
  - der Link «Filter zurücksetzen» der leeren Liste (P-1): `EmptyState` rendert ihn als `Button` mit `href`, also Typ `link`;
  - Zurück und Vorwärts (P-2): Typ `popstate`;
  - «Nächste Seite» (P-3): ein Link.
  `git diff 1d871ef 387949f --stat -- src` zeigt, dass weder `+layout.svelte` noch `list-url.ts` noch `EmptyState.svelte` geändert wurden. Der Link der leeren Wohnungsliste bestand schon. Die Änderung gibt ihm nur die `actionTestid` `apartments-show-all`. P-4 (die leere Rechnungsliste hat keinen Link zum Zurücksetzen) betrifft Markup, das die Änderung nicht berührt. Die Einordnung «bestand schon vorher» hält.
- Triage Helga P-1 und Marco P-1 (U-32): In beiden Fällen lädt der Browser das ganze Dokument neu. Helga ruft eine Adresse über die Adresszeile auf und kehrt zurück. Marco öffnet die Liste über die Adresszeile und geht zurück zum Dashboard und wieder vor. Das ist keine Navigation innerhalb der Liste, wie «Done means» sie beschreibt. Die Ursache ist, dass der Browser Formulare wiederherstellt (oder der bfcache), nicht der SvelteKit-Router. Dass beide Fälle mit C-1 in einer Zeile stehen, ist vertretbar, weil sie dieselbe Art Fehler sind: getippter, nicht abgeschickter Text bleibt stehen. Alle drei Personas bestätigen den Kern der Anforderung: Nach Suche, Zurücksetzen, Zurück und Vorwärts, Seitenwechsel und Neuladen passen die Felder in allen drei Listen zur Liste.
- U-34 fasst die Beobachtungen der drei Personas in einer Zeile zusammen, wie Workflow 5 es für Beobachtungen aus der Zeit vor der Änderung verlangt. Jede Beobachtung betrifft Markup oder Verhalten, das die Änderung nicht berührt: zwei Bedienelemente zum Zurücksetzen, Landmarks, Überschriftenebenen, Platzhalter, `page=1`, «(optional)». Marcos Beobachtung zu «Reserviert» ergibt sich aus seiner Aufgabe, nicht aus der App. Sie fehlt zu Recht in U-34.
- Planzeilen: Es gibt je eine Zeile pro Reviewer und Runde, mit Bericht und Status jedes Befunds. Die Schweregrade stimmen mit den Persona-Berichten überein (alle Minor).
- Workflow-Review: Die Datei hat den richtigen Namen (`workflow-rules-review-issue-159.md`). Die Belege stimmen, zum Beispiel ruft `persona-kit.mjs:7` wirklich `createRequire('/home/user/Dwello/package.json')` auf. Sie ändert keine Regel und öffnet keinen Eintrag in den offenen Punkten.
- Das Delta enthält nichts ohne Bezug zur Aufgabe: keine Texte, keine Bildschirme, keine API und kein Produktionscode.

## Nicht bestätigt

- Vom Aufrufer gemeldet: E2E chromium `apartments.feature` auf 387949f, 8 bestanden. Ebenfalls vom Aufrufer gemeldet, auf 07fd48f: volle Suite, lint, check, coverage, deepcheck (wie in Runde 1). Nichts davon habe ich selbst erneut ausgeführt. Das Delta berührt keinen Code, den Vitest prüft.
- Dass Helga P-1 und Marco P-1 auch auf dem Basis-Commit 1d871ef auftreten, habe ich nicht im Browser nachgestellt, weil kein E2E- oder Persona-Lauf erlaubt war. Die Einordnung stützt sich auf den Code: Vor der Änderung kopierten die Formulare die URL einmal beim Aufbau in `$state`. Eine Wiederherstellung durch den Browser hätte dort dieselbe Wirkung. Ob die Änderung den Fall sichtbarer macht, ist nicht belegt. Helga sieht ihn bei den Rechnungen nicht, Marco schon.
- Svens Zurück und Vorwärts liefen über `page.goBack()` statt Alt+Pfeil (laut seinem Bericht). Was ein echter Screenreader vorliest, ist nicht geprüft.
