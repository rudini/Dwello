# Code-Review issue-122, Runde 1

Geprüft: Commit c75c9ff (`git show c75c9ff`) und Merge a0edf44 (Konfliktauflösung in `tests/e2e/steps/app-frame.steps.ts` und `tests/e2e/questions/app-frame.ts`), Worktree `review-122-code`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | tests/e2e/screenplay/questions.ts:131-136, tests/e2e/steps/app-frame.steps.ts:130 | Laut Szenario zeigt das Tab «das Dwello-Symbol», geprüft wird aber nur, dass das verlinkte Symbol mit `image/svg+xml` ausgeliefert wird. Jedes andere SVG würde den Test auch bestehen. Ob es das Haus-Symbol ist, prüft kein Test (auch nicht der Unit-Test). Für einen Bug «Datei fehlt» ist das vertretbar. Der Schritttext verspricht aber mehr, als der Test zeigt: Entweder den Schritt neutraler formulieren («zeigt das Browser-Tab ein Symbol») oder in Kauf nehmen. |
| C-2 | Minor | implementation_plan.md:16 | `- [ ] Skills: tdd, ponytail, ponytail-review` ist zwar als Punkt vorhanden, aber nicht abgehakt. Damit ist nicht festgehalten, dass `ponytail-review` vor diesem Review gelaufen ist (Workflow 3). Den Punkt abhaken, sobald die Skills gelaufen sind. |
| C-3 | Nit | tests/e2e/screenplay/questions.ts:133-134 | `href!`: Fehlt das `href`-Attribut, bricht die Frage mit einem `TypeError` ab (`new URL(null)` → «Invalid URL»), statt einen Wert zu liefern. Fehlt das ganze `<link rel="icon">`, wirft schon `getAttribute` nach 1 s einen Timeout. In beiden Fällen sieht man im Fehlerbild nicht, was die Seite tatsächlich zeigt. Vorschlag: bei `null` den Wert `'kein Symbol'` zurückgeben. |
| C-4 | Nit | src/__tests__/app-html.test.ts:13 | Der Test vergleicht exakt den String des ganzen `<link>`-Tags. Schon eine andere Attributreihenfolge oder ein fehlendes ` />` macht ihn rot, obwohl sich am Verhalten nichts ändert. Ein Regex auf `type="image/svg+xml"` mit `favicon.svg` wäre robuster. |

Kein Blocker, kein Major.

## Bestätigt

- **Icon:** `static/favicon.svg` verwendet stroke 1.75, round caps und joins und `fill="none"`. Die Farbe ist `#1B5873`, unter `@media (prefers-color-scheme: dark)` `#86BFDA` (die CSS-Regel schlägt das Präsentationsattribut). Die Werte stimmen mit `src/styles/tokens.css:13/54` und `docs/design/token-referenz.md:16` überein. Kein Verlauf, kein Schatten, kein Text.
- **Header:** Er zeigt `Icon name="home"` (`src/lib/ui/Header.svelte:58`), und `home` ist `House` (`src/lib/ui/icons.ts:88`).
- **app.html:** `src/app.html:5` verlinkt das Symbol mit `type="image/svg+xml"`. Ein `favicon.png`-Verweis ist nirgends mehr vorhanden (grep über src, tests, Konfiguration).
- **Unit-Test:** Er liest `src/app.html` und meldet jede `%sveltekit.assets%/`-Datei, die unter `static/` fehlt. Die Logik findet `favicon.png` auf dem alten Stand. Der Rot-Nachweis steht im Plan (`implementation_plan.md:14`). Ich habe den Test neu ausgeführt: 2 bestanden.
- **Docker:** `.dockerignore` schliesst `static/` nicht aus. `COPY . .` und `bun run build` übernehmen die Datei nach `build/`, und der Runner kopiert `build/`.
- **design-decisions.md:** Die Zeile D7a ist vorhanden.
- **Szenario:** Es steht ohne `@wip` in `navigation.feature:35-36`, «Scenario red» ist im Plan notiert. Die Schichten sind eingehalten: Der Schritt ruft nur eine Frage auf, `questions/app-frame.ts` reicht nur die Web-Frage aus `screenplay/` weiter, und Playwright wird nur in `screenplay/` aufgerufen. Die Frage liefert einen Wert (Content-Type oder `HTTP <status>`), sodass ein Fehlschlag zeigt, was der Server antwortet. Das Feature enthält keine UI-Wörter.
- **Merge a0edf44:** Beide Seiten sind erhalten (Import `footerVersionText` und `tabIcon`, beide Exporte, beide Then-Schritte), es gibt keine Duplikate und keine Konfliktmarker.
- **Texte, a11y, Verträge:** Es gibt keine neuen UI-Texte (`messages/*.json` sind nicht betroffen), keinen neuen Bildschirm und keinen neuen UI-Zustand (a11y-Dateien sind nicht nötig) und keine API-Änderung (keine Verträge nötig).
- **Umfang:** Der Diff enthält nichts, was nicht zur Anforderung gehört.

## Nicht bestätigt

- **Lucide-Pfad:** Dass die Pfade in `favicon.svg` genau Lucides `House` in der installierten Version (`lucide ^1.54.0`) entsprechen, konnte ich nicht nachprüfen. Lesen von `node_modules/lucide/dist` war durch eine Deny-Regel gesperrt, weil der Symlink in den Arbeitsbaum des Aufrufers zeigt. Aus dem Gedächtnis stimmen beide Pfade mit Lucides `house` überein.
- **Docker-Image:** Dass es `/favicon.svg` wirklich ausliefert, habe ich nicht gebaut (Build ist untersagt). Bestätigt ist nur das Dockerfile und `.dockerignore`, siehe oben.
- **Vom Aufrufer gemeldet:** `bun run test:coverage` (2326 Tests bestanden), `bun run lint` (auch nach dem Merge), `bun run check`, Backend `bun run test` und `bun run type-check`, `bun run deepcheck:audit`, E2E chromium «Browser-Tab|Logo» (2 bestanden, vorher rot mit «HTTP 404»).
- **Selbst ausgeführt:** nur `bunx vitest run src/__tests__/app-html.test.ts` (2 bestanden).
