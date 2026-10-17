# Code-Review #292, Runde 2 (Abschluss, b317fa77..b1ef918f)

Worktree: `/tmp/claude-0/-home-user-Dwello/885a1125-b6db-5975-8e5c-ec01f947f577/scratchpad/review-292-close`. Alle 16 geänderten Dateien gelesen. Dazu gelesen: `tests/e2e/fixtures/backend.ts` (`supplierInvoice`), `tests/e2e/steps/invoices.steps.ts`, `.claude/skills/slice-review/SKILL.md` (Triage), `docs/reviews/292-review-1.md` und die Persona-Berichte `docs/design/personas/{helga,weber}-292.md`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | tests/e2e/features/invoice-detail.feature:22-27; src/routes/invoices/[id]/CategorizationPanel.svelte:26, 47-58 | Was der Liegenschaftsverwalter sieht, ändert sich: Bei einer nicht umlagefähigen Rechnung ohne Verteilschlüssel fehlt die Zeile «Verteilschlüssel». Dafür gibt es kein Szenario, nur einen DOM-Test |
| C-2 | Minor | src/routes/invoices/[id]/CategorizationPanel.svelte:26 | `showsKey` blendet die Zeile nur aus, wenn kein Verteilschlüssel gesetzt ist. Eine ausgeschlossene Rechnung mit Schlüssel (Szenario «Ausgeschlossene Rechnung …», Hauswart mit «Pro Fläche (m²)») zeigt weiter «Verteilschlüssel: Pro Fläche (m²)» neben «Nicht umlagefähig». Beide Personas schlagen vor, die Zeile bei *nicht umlagefähigen* Rechnungen wegzulassen (helga-292.md:65, weber-292.md:67). Das ist weniger widersprüchlich als «Keiner – … pro Wohnung verteilt», aber ein Schlüssel wirkt so, als würde die Rechnung verteilt. Als bewusste Grenze im Kommentar festhalten oder `showsKey = invoice.isValidUtilityCost` prüfen |
| C-3 | Nit | src/routes/invoices/[id]/CategorizationPanel.svelte:25 | Der Kommentar sagt «next to the reason». Die Bedingung gilt aber auch ohne Grund (eigene Kategorie, ausgeschlossene Rechnung, nicht kategorisiert). «Not distributed at all» reicht |
| C-4 | Nit | implementation_plan.md:19 | In der Liste «Files» fehlt `src/__tests__/help-page.dom.test.ts`. Neu ist auch `tests/e2e/features/help.feature`, das über `tests/e2e/{features,…}` schon abgedeckt ist |

Ponytail-review: keine weiteren Befunde. Das `$derived` begründet der Aufrufer mit fallow und ist eine Zeile. Das `!!` in `!!invoice.distributionKey` braucht es im `{#if}` nicht, für den Typ `boolean` des `$derived` ist es aber sauber. net: 0 lines.

### C-1 (Major): Sichtbare Verhaltensänderung ohne Szenario

- **Warum falsch:** `CLAUDE.md`, Workflow Schritt 1, und die Pflichtprüfung dieses Reviews verlangen für jede Verhaltensänderung, die der Benutzer sieht, ein Szenario in `tests/e2e/features` ohne `@wip`. Der Fix für Helga P-1 / Weber P-5 entfernt sichtbaren Inhalt von der Rechnungsdetailseite. Gesichert ist das nur durch `src/__tests__/invoice-pages.dom.test.ts:278-284`. `.claude/skills/slice-review/SKILL.md:38` lässt für einen behobenen Persona-Befund «scenario or lower layer» zu. Die beiden Regeln widersprechen sich hier. Ich melde den Befund nach der strengeren Regel aus `CLAUDE.md`. Die Triage entscheidet, ob die Ausnahme des Skills greift.
- **Wie zeigen:** Das Szenario «Nicht umlagefähige Rechnung nennt den Grund ihrer Kategorie» (invoice-detail.feature:22-27) erzeugt genau diesen Zustand. `seed.supplierInvoice` setzt keinen Schlüssel (backend.ts:456-467), die Kategorie «Reparaturen» bringt keinen mit, und die Persona sah dort «Keiner». Trotzdem bleibt das Szenario grün, wenn man `{#if showsKey}` wieder entfernt, denn kein Schritt prüft den Verteilschlüssel. Der Fix ist billig: ein Schritt wie «Und nennt die Rechnung keinen Verteilschlüssel» mit einer Question, die den angezeigten Schlüssel liefert. Der Schritt braucht einen positiven Anker, der steht schon davor («ist die Rechnung nicht umlagefähig»).

## Bestätigt (Anforderung → Code und Test)

- **C-1 aus Runde 1:** `glossary_allocable_text` sagt jetzt in de/fr/it/en «jede dieser Kostenarten einzeln nennt», gleich wie `categories_contract_note` (de.json:106, fr/it/en:106 gegen `categories_contract_note`). Gepinnt in help-page.dom.test.ts:91-92 und help.feature:41. Beide schlagen mit dem alten Text fehl. Andere Tests pinnen den alten Wortlaut nicht mehr (grep nach «als Nebenkosten nennt» findet nur `invoices_service_period_boiler`, einen anderen Text).
- **C-4:** Das Szenario erwartet den ganzen Schlusssatz «Die Hauswartung ist also umlagefähig.» (invoice-detail.feature:20). Das stimmt mit `categories_reason_caretaker` überein (de.json:1392).
- **C-5:** Die Assertion ist kürzer (categories-page.dom.test.ts:544). Der Grund steht als Meldung im Test und prüft dasselbe.
- **C-6:** Der Kommentar mit den Markern #397 und #398 steht jetzt über `REASONS` (CategoryReason.svelte:5-8). Der freistehende Block ist weg.
- **C-7:** Begründet abgelehnt, das nehme ich an.
- **C-8:** Die doppelte Leerzeile in implementation_plan.md gibt es nach dem Merge nicht mehr.
- **Helga P-1 / Weber P-5:** `showsKey` (CategorizationPanel.svelte:26) blendet die Zeile aus, wenn die Rechnung weder einen Schlüssel hat noch umlagefähig ist. Der neue DOM-Test (invoice-pages.dom.test.ts:278-284) schlägt ohne `{#if showsKey}` fehl, weil dann `invoices_no_key` und `glossary_key_term` sichtbar sind. Eine umlagefähige Rechnung ohne Schlüssel zeigt weiter «Keiner – …», das sichert invoice-pages.dom.test.ts:414-419. Das Raster `sm:grid-cols-2` funktioniert auch mit zwei Einträgen. Keine neuen Texte, keine neuen Klassen, nur Tokens.
- **U-39 in offene-punkte.md:** Die Zeile hat das Spaltenformat der Tabelle und nennt beide Persona-Berichte.
- **Kein neuer Bildschirm und kein neuer Zustand mit eigenem Inhalt:** Die Änderung nimmt nur eine Zeile weg. `tests/a11y/screens.json` braucht keinen Eintrag.
- **Plan:** Die Punkte sind abgehakt, die abschliessende Review-Runde ist als offener Punkt eingetragen.

## Nicht bestätigt

- Selbst ausgeführt: `bunx vitest run src/__tests__/invoice-pages.dom.test.ts src/__tests__/help-page.dom.test.ts`, 89 bestanden.
- Vom Aufrufer gemeldet, nicht wiederholt: `bun run lint`, `bun run check`, `bunx vitest run` für `categories-page.dom`, `open-work` und `i18n`, `bunx fallow audit`, E2E chromium für invoice-detail, categories und help mit axe- und Sprachzeilen (65 bestanden).
- Ob «Reparaturen» im E2E-Stack wirklich ohne Verteilschlüssel angelegt wird: geschlossen aus der Fixture (`backend.ts:456-467` setzt keinen Schlüssel) und aus dem Persona-Bericht (helga-292.md:47). Den Backend-Standard je Kategorie habe ich nicht gelesen.
- Die fachliche Richtigkeit der fr/it/en-Wortlaute von `glossary_allocable_text` habe ich nur daran geprüft, dass sie mit dem fach-geprüften `categories_contract_note` übereinstimmen (`docs/reviews/292-fachreview-1.md`). Ein eigenes Fachreview für den Hilfetext gibt es nicht.
- Die Persona-Berichte `docs/design/personas/{helga,weber}-292.md` habe ich nur für P-1, P-5 und U-39 gelesen. Ob die übrigen Beobachtungen auf dem Basis-Commit bestehen, habe ich nicht geprüft.
