# Code-Review #186 Slice B, Runde 2 (Delta)

Gegenstand: `80c804a..a02b029` (Commits `b586048`, `393d126`, `a02b029`), Worktree `review-186b-code2`. Geprüft: die Korrekturen zu M-1 und M-3, die Ablehnungen von M-4 und M-5, die Korrekturen aus `186-fachreview-2.md` (H-22, H-23, H-25 bis H-28), Dr. Weber P-7 und Marco P-1. Dazu die offene Arbeit (U-31) und die Planzeilen. Alle geänderten Dateien des Deltas habe ich gelesen.

Ergebnis: M-1 ist behoben und mit einem Test belegt. Neu ist ein Major (M-6): Mehrere geänderte Texte, die der Benutzer sieht, haben keinen Test, der vorher rot war. Sonst gibt es nur Minor und Nit.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| M-6 | Major | `messages/fr.json:1102`, `messages/it.json:1102`, `messages/en.json:1119`, `messages/it.json:1119`, `messages/en.json:1364-1365`, `messages/{fr,it,en}.json:775`; `implementation_plan.md:38` | Für H-26 (Hilfetext fr/it), H-28 (Hinweise der KI auf en; Verwaltung en/it) und die fr/it/en-Titel aus H-23 gibt es keinen Test. Laut Plan sind H-26 und H-28 «fixed», aber es ist kein `Test red` notiert. Setzt man diese Texte auf den alten Wortlaut zurück, bleiben alle Tests grün. |
| M-7 | Minor | `messages/fr.json:776`; `implementation_plan.md:38` | Der erste Punkt von H-28 ist nicht umgesetzt: Die fr-Zitierweise lautet weiter «(art. 256 al. 1, 256b et 257a CO)», vorgeschlagen war «(art. 256, al. 1, 256b et 257a CO)». Der Plan führt H-28 trotzdem als behoben. |
| M-8 | Nit | `tests/e2e/fixtures/backend.ts:271`, `:300`; `implementation_plan.md:38` | M-3 ist nur teilweise behoben. `invoiceOn` und `supplierInvoice` wiederholen weiterhin genau die Suche, die `predefinedCategory` (`:29-31`) jetzt kapselt. Es reicht, sie anzuschliessen (je eine Zeile) oder im Plan «teilweise, übriger Code unberührt» zu notieren. |
| M-9 | Nit | `messages/fr.json:1365` | Marco P-1 gilt auch auf Französisch: «L’IA n’est pas sûre.» liest sich auch als «nicht ungefährlich». Analog zu it wäre «L’IA n’en est pas certaine.» eindeutig. |
| M-10 | Nit | `README.md:292`, `:297-298` | H-22 ist nur in Z. 297 umgesetzt. Z. 292 sagt weiter «names the provider and its country», Z. 297 dagegen «`LLM_PROVIDER_COUNTRY` names that country» (Ort der Bearbeitung). Den Fall mehrerer Staaten aus dem Vorschlag erwähnt der Text nicht. Ausserdem steht in Z. 297 «data centres», in Z. 298 «data centers». |

## M-6 (Major): Geänderte Texte ohne roten Test

- **Was fehlt:** CLAUDE.md, Workflow Schritt 6, verlangt für eine Korrektur, die das Verhalten ändert («a changed help or error text the user sees included»), zuerst einen roten Test. Der Plan (`implementation_plan.md:38`) nennt solche Tests für H-23 (nur de), H-25, H-27 und Weber P-7 (de und fr Verwaltung). H-26 und H-28 führt er ohne Test als «fixed». Ohne Test bleiben diese geänderten Texte:
  - `categories_allocable_help` fr/it: «l’assurance bâtiment» / «assicurazione edificio» (H-26);
  - `backend_ki_proposal_unavailable`/`_unsure` en: «Decide yourself» (H-28);
  - `categories_reason_administration` en und it: neue Satzstellung mit «(Art. 257a para. 2 CO)» / «(art. 257a cpv. 2 CO)» (H-28, P-7). Getestet sind nur de und fr;
  - `invoices_legal_title` fr/it/en (H-23). Getestet ist nur de.
- **So zeigt man es:** `grep -rn "seuls l’exploitation\|assicurazione edificio e imposte\|Decide yourself\|se il contratto di locazione le indica\|names it (Art. 257a" src/__tests__ tests` findet nichts. Die einzigen Treffer für «assurance bâtiment» / «assicurazione edificio» (`invoice-pages.dom.test.ts:204-205`) prüfen den Rechnungshinweis, nicht den Hilfetext. Setzt man z. B. `fr.json:1102` auf «l’assurance du bâtiment» zurück, bleiben `categories-page.dom.test.ts` und `categories.test.ts` grün. Der Fehler, den der Fach-Review behoben hat, könnte also unbemerkt zurückkommen.
- **Warum Major:** Der Auftrag dieser Runde verlangt ausdrücklich einen zuvor roten Test für jeden geänderten Text, den der Benutzer sieht, und Schritt 6 schreibt das vor. Die Planzeile behauptet für H-26 und H-28 eine Korrektur, ohne sie zu belegen.
- **Mögliche Korrektur (klein):** Die Tabelle von `it.each` in `categories-page.dom.test.ts:484-489` um je eine Zeile für `it`/`en` Administration ergänzen. Ein Test für den Hilfetext auf fr/it, nach dem Muster von `invoice-pages.dom.test.ts:203-215`. In `categories.test.ts` den Test zu Marco P-1 um en ergänzen («The AI is not sure. Decide yourself …»). Für die fr/it/en-Titel reicht eine Zeile mit `it.each`. Danach jeweils das Rot gegen den alten Text zeigen und im Plan notieren.

## Status der Befunde aus Runde 1

| ID | Status | Beleg |
|----|--------|-------|
| M-1 (Major) | behoben | `CategoryForm.svelte:46` `chosen = category && { ...category, isAllowedUtilityCost: values.allowed === 'true' }`, übergeben in `:122`. Auf der Seite «Neue Kategorie» ist `category` undefiniert, also gibt es keinen Grund. Beim Bearbeiten ist `values.allowed` immer gesetzt (`:40`). Nach dem Zurückschalten erscheint der Grund wieder. Test `categories-page.dom.test.ts:474` «nennt keinen festen Grund, sobald im Formular die andere Umlagefähigkeit gewählt ist». Vor der Korrektur wäre er rot gewesen: Mit `fireExtinguisher` (false) und der Wahl `true` blieb der Satz stehen. Weber P-5 und Marco P-4 sind damit ebenfalls geschlossen. |
| M-2 (Nit) | offene Arbeit | `docs/design/offene-punkte.md` U-31 nennt `aria-describedby` und die fehlende Überschrift (Helga P-5, Marco P-7). |
| M-3 (Nit) | teilweise | siehe M-8 |
| M-4 (Nit) | Ablehnung hält | `screens.ts:90`: eine Abfrage pro Zeile, neben den vielen anderen in `seedFor`. |
| M-5 (Nit) | Ablehnung hält | `backend/src/__tests__/allocable-categories.pg.test.ts:4,27,98` legt die Seed-Werte gegen eine ausgeschriebene Liste fest. Zusammen mit den Szenarien fällt eine geänderte Migration auf. |

## Bestätigt durch Code und Test

- **H-23 de:** `de.json:775` «Nicht in der Nebenkostenabrechnung». Test `invoice-pages.dom.test.ts:220-222` prüft den Titel und schliesst «Schweizer Mietrecht» aus. Die Teilprüfung ist eindeutig, weil der Fliesstext «nicht in die Nebenkostenabrechnung» enthält, nicht «Nicht in der». fr/it/en haben die Titel aus dem Vorschlag von H-23 (Begriffe laut i18n-Liste), aber ohne Test (M-6).
- **H-25, H-27, Weber P-7 (de, fr):** `categories-page.dom.test.ts:484-501`. Die Locale wird im `finally` zurückgesetzt.
- **Marco P-1:** `it.json:1365` «L’IA non ne è certa.», Test `categories.test.ts:188-195`, Locale im `finally` zurückgesetzt.
- **H-22:** `README.md:297` nach Vorschlag (Rest siehe M-10). `LLM_PROVIDER_COUNTRY` gibt es (`.env.example:60-64`, `backend/src/config/llm.ts`).
- **Offene Arbeit:** U-31 in `offene-punkte.md` deckt Helga P-2, P-4, P-5, P-6, Marco P-2, P-6, P-7, Weber P-6, Code-Review M-2 und die Beobachtungen ab. Die Zuordnung der übrigen Punkte zu #219, #220, #221 und #75 steht im Plan (GitHub nicht geprüft, siehe unten).
- **Keine neuen Bildschirme oder Zustände.** Der Zustand «Grund ausgeblendet nach Umschalten» entspricht dem bestehenden Zustand ohne Grund. Keine neuen Klassen oder Bedienelemente. Kein Code ausserhalb des Auftrags. Die Formatierung beschränkt sich auf die geänderten Zeilen.

## Nicht bestätigt

- Von mir erneut ausgeführt und grün: `bunx vitest run src/__tests__/categories-page.dom.test.ts src/__tests__/categories.test.ts src/__tests__/invoice-pages.dom.test.ts src/__tests__/no-german-in-code.test.ts` (459 Tests).
- «Vom Aufrufer gemeldet», nicht erneut ausgeführt: `bun run lint`, `bun run check`, `fallow audit`, `deepcheck:audit`, das Rot der neuen Tests vor der Änderung, die Gesamtläufe `test:coverage` (2446) und Backend (619) auf `80c804a`. E2E für das Delta ist nicht gemeldet. Die Änderung an `backend.ts` betrifft nur die Hilfsfunktion der Fixtures; ob die Szenarien zu Kategorien damit grün sind, habe ich nicht geprüft.
- Issues #219, #220, #221 und der Kommentar auf #75 (GitHub): nicht gelesen. Ich stütze mich nur auf die Planzeile und auf `186-fachreview-2.md` (der Bericht bestätigt #219 und #75).
- Die fachliche Richtigkeit der neuen it-Formulierung «piccoli lavori di conservazione» (H-27 schlug andere Wortlaute vor) und der fr/it/en-Fassungen bei der Verwaltung gehört in eine weitere Runde des `fach-reviewer`.
