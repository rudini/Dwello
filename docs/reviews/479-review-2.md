# Code-Review #479, Runde 2 (Abschlussrunde): 26c7f2ce..6ecb2d75 und Merge da26db65

Worktree: `review-gwr-code2` (da26db65). Gelesen habe ich alle geänderten Dateien von `git diff 26c7f2ce 6ecb2d75` (ohne `docs/reviews`, Plan und Archiv). Die Persona-Berichte `docs/design/personas/*-479.md` habe ich nur als Herkunft der Befunde gelesen. Dazu `git show --remerge-diff da26db65`, `src/routes/buildings/new/+page.server.ts`, `src/lib/backend-error.ts`, die Umgebung von `BuildingForm.svelte` (Submit, `handleAddressSelect`), `drift()` in `api-contracts.pg.test.ts`, die Verwendungen von `building-register-notice` in `tests/e2e`, `tests/e2e/CLAUDE.md` (Zeile zu Features) und in `@sveltejs/kit` 2.70.3 `client.js` die Funktionen `_apply_action` und `reset_focus`.

## Befunde

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-6 | Minor | `src/__tests__/building-actions.test.ts:102-114` | Der Test «nennt die Wohnungsnummer, die zweimal vorkommt, in der Sprache der Oberfläche» kann nicht rot werden. `backend_apartment_number_taken` in `de.json` ist wortgleich mit dem `error` des Vertrags («Die Wohnungsnummer 101 existiert bereits in diesem Gebäude.»). Würde das BFF den Rohtext des Backends zeigen (`error.error`, auch der Rückfall von `backendMessage`), bliebe der Test grün. Er zeigt also nicht, was sein Name behauptet. Abhilfe: in einer anderen Sprache prüfen, oder dem Vertragsbody für diesen Test einen anderen `error`-Text geben. |
| C-7 | Minor | `backend/src/__tests__/api-contracts.pg.test.ts:357-358` | Der neue Vertragstest steht zwischen dem Kommentar `// the 2024 statement bills its rent days: confirmed or not, it stays (#116)` und dem Test `DELETE /contracts/:id`, zu dem dieser Kommentar gehört. Jetzt erklärt der Kommentar den Gebäudetest, und das stimmt nicht. |
| C-8 | Minor | `src/routes/buildings/BuildingForm.svelte:144-147` | Rest von C-3: Scheitert beim Wechsel auf eine zweite Adresse das Lesen ihres Gebäudes (`!register.data`), endet die Funktion vor `propose`. Gebäudetyp und Baujahr der ersten Adresse bleiben dann neben der Adresse des zweiten Gebäudes stehen. `proposed` bleibt ebenfalls auf dem alten Stand. Zu sehen ist nur der Hinweis «nicht erreichbar». Dafür gibt es keinen Test (siehe C-4). |
| C-9 | Minor | `src/__tests__/building-form.dom.test.ts` («behält, was der Liegenschaftsverwalter selbst eingetragen hat») | Der Test ist auf 26c7f2ce schon grün: `if (!name)` behält «Lindenhof», und der Gebäudetyp wird gesetzt. Laut Workflow 2 muss die Commit-Nachricht einen solchen Test als Test für beibehaltenes Verhalten nennen. 0ecf03c1 tut das nur für den BFF-Test zu C-1. |

Keine Blocker und keine Majors.

## Status der offenen IDs aus Runde 1

- **C-1 (Major): behoben.** Vorhanden sind `tests/contracts/building-apartment-number-taken.json`, die README-Zeile und der Fall in `api-contracts.pg.test.ts` (409 und `drift`). Neu ist ausserdem ein BFF-Fall in `building-actions.test.ts`, der aus dem Vertrag antwortet. Dieser BFF-Test kann aber nicht scheitern (C-6, Minor). Laut Commit-Nachricht 0ecf03c1 pinnt er beibehaltenes Verhalten. Das stimmt: Die Basis ruft `backendMessage` schon auf, und es ist kein Bugfix.
- **C-2 (Minor): behoben.** `parseRegisterApartments` lässt Komma oder Punkt zu und prüft die Grenzen der Spalten (`decimal(8,2)`, `decimal(3,1)` in halben Zimmern, > 0). Die beiden neuen Texte stehen in allen vier Sprachen. Tests: Komma wird angenommen, sechs Ablehnungen. Ohne die Änderung wären sie rot.
- **C-3 (Minor): behoben** für einen Wechsel mit lesbarem Register. Die DOM-Tests «ersetzt beim Wechsel der Adresse …» (auf der Basis rot) und «behält, was … eingetragen hat» decken das ab. Offen bleibt der Rest im Fall «nicht erreichbar» (C-8).
- **C-4 (Minor): offen.** Für das gescheiterte Lesen von `/api/addresses/<egid>` gibt es weiterhin keinen Test. Der neue `fakeBff` in `building-form.dom.test.ts` könnte diesen Fall jetzt einfach zeigen.
- **C-5 (Minor): behoben.** `latitude` und `longitude` sind aus `AddressHit`, dem Test und `api-specification.md` entfernt. Der Stand-in `gwr-stub.ts` liefert `lat` und `lon` weiter, so wie die echte API.

## Bestätigt

- **Fokus nach dem Sprung zum Inhalt:** Die Aktion «Neues Gebäude» antwortet bei Fehlern mit `{ success: false, errors }`, also mit `type: 'success'`. `_apply_action` ruft dann `reset_focus(page.url)` auf. Hat die URL `#main-content`, setzt SvelteKit den Fokus in einem eigenen `setTimeout` dorthin, also nach `tick()`. Das zusätzliche `setTimeout` in `focusFirstError` wird erst nach diesem Timeout eingeplant und läuft danach. Das Szenario fragt den Feldnamen ab (Frage `focusedField`, Wert statt ja/nein). Der Schritt ruft nur eine Task und eine Question auf. `FocusedElement` gehört zur Screenplay-Schicht.
- **Live-Region:** `RegisterNotices` ist immer vorhanden und hat `aria-live="polite"`. Die E2E-Ziele `Wait.until(registerNotice)` greifen weiter, weil die leere Region 0 px hoch und damit nicht sichtbar ist. Die axe-Zeilen meldet der Aufrufer als grün. Beim Leeren der Suche verschwindet der Hinweis (`onfound('hits')`) und der Fokus bleibt im Suchfeld. Der DOM-Test dazu wäre auf der Basis rot.
- **`floorOptions`/`roomOptions`:** Ein gespeicherter Wert ausserhalb der üblichen Auswahl bleibt erhalten (DOM-Test mit 9. OG und 7.5 Zimmern, auf der Basis rot). Der lokale Helfer `floorChoices` in `RegisterApartments` ist durch den gemeinsamen Helfer ersetzt (ponytail: Kopie entfernt). `roomsLabel` ist in `ApartmentForm` nicht mehr importiert. Alle Aufrufer sind angepasst.
- **Einheit m²:** `apartments_area_label` statt `apartments_area`. `apartments_area` wird in `ApartmentFacts.svelte` weiter gebraucht. DOM-Test vorhanden, auf der Basis rot.
- **Reihenfolge der Wohnungen:** nach Stockwerk, dann Nummer (numerisch, `de`), ohne Stockwerk am Ende. Neuer Test, angepasste Erwartungen. Auf der Basis rot.
- **Texte:** Die zwei neuen Schlüssel stehen in allen vier `messages/*.json`. Die en-Korrekturen betreffen Schlüssel, die erst dieser Pull Request einführt. Die Glossarzeilen in `i18n-begriffe.md` passen zu den Texten.
- **Betrieb:** Die O-42-Zeile in `offene-punkte.md`, die Notiz in `tech-stack.md` und `NODE_USE_ENV_PROXY=1` in `persona-stack.sh` stimmen überein.
- **Merge da26db65:** Der Konflikt in `tests/e2e/tasks/accessibility.ts` ist aufgelöst. Die Importe beider Seiten bleiben erhalten (`chooseRegisterAddress`/`registerUnreachable`/`searchRegister` und `registerNotice` aus diesem Branch, `advanceDeleteButton` aus main). Sonst ändert die Auflösung nichts.
- **Unbeteiligte Änderungen:** keine. Die Fokuskorrektur wirkt auf alle Formulare mit `focusFirstError`, stammt aber aus dem Persona-Befund P-2 zu #479 und hat ein Szenario.
- **Erneut ausgeführt:** `bunx vitest run` mit `building-actions.test.ts`, `building-form.dom.test.ts`, `building-register.test.ts` und `apartment-form.dom.test.ts`: 80 von 80 grün.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bunx vitest run` gesamt (3190), `cd backend && bun run test` (994, Abdeckung 93.6 %) und `bun test src/__tests__/api-contracts.pg.test.ts`, die E2E-Läufe (building-new mit dem neuen Szenario, tenant-new, apartment-new, apartment-edit) sowie die axe- und Sprachzeilen von building-new, apartment-edit und apartment-new: vom Aufrufer gemeldet. Den vollen chromium-Lauf von da26db65 meldet der Aufrufer als laufend, das Ergebnis kenne ich nicht.
- Ob das Szenario «Nach dem Sprung zum Inhalt führt eine Fehlermeldung zum Feld» auf 26c7f2ce rot ist: Das Lesen von `reset_focus` macht es wahrscheinlich, weil `location.replace('#main-content')` den Fokus aus dem Feld nimmt. Dass Chromium das bei einem Fragmentwechsel tatsächlich tut, habe ich ohne E2E-Lauf nicht geprüft. Grundlage ist nur die Beobachtung der Persona Sven (P-2).
- Ob die übrigen rund 40 Aufrufer von `focusFirstError` mit dem zusätzlichen Macrotask unverändert funktionieren: nur über den gemeldeten grünen Gesamtlauf von vitest und E2E, nicht einzeln geprüft.
