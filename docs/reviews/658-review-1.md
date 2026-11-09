# Code-Review 658, Runde 1 (e6453741..01db8a3d)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Blocker | src/__tests__/invoice-pages.dom.test.ts:211 | Der DOM-Test «hält „Bearbeiten“ innerhalb der Zeile …» prüft weiter `xl:shrink-0`; InvoiceRow.svelte:65 hat jetzt `@4xl:shrink-0`, der Test ist rot. |
| C-2 | Major | src/routes/statements/[id]/CostTable.svelte:62-64, 101-102, 111-115 | Prettier hat unberührte Zeilen umgebrochen (`statements_offset_with`, `periodDays`, `timeShare`). Das hat mit #658 nichts zu tun. |
| C-3 | Major | tests/a11y/screens.json (statement-detail) | Die Tabellenvariante der Kostenaufstellung (eigenes Bedienelement: fokussierbare Scroll-Region von `Table`) kommt in keiner a11y-Ansicht mehr vor; Desktop 1440 zeigt jetzt die Karten. |
| C-4 | Minor | src/__tests__/statement-pages.dom.test.ts:2927-2928; src/routes/statements/[id]/CostTable.svelte:11-18 | Die #691-Prüfungen `not.toContain('md:hidden')` / `not.toContain('md:block')` sind jetzt leer, sie gelten auch ohne `stacked`. Die Bearbeitungsseite ist `max-w-3xl` (48rem) und erreicht `@5xl` (64rem) nie; `stacked` bewirkt dort also nichts mehr. Entweder `stacked` löschen oder den Test auf `@5xl:` umstellen. |
| C-5 | Minor | tests/e2e/screenplay/questions.ts:450-464 | `ThePage.cutChoices` kopiert die Messung von `CutInChoice.of` (questions.ts:282-296, #1089): Schrift aus Einzelteilen, Platz, `measureText`. Das gehört in einen gemeinsamen Helfer. |
| C-6 | Minor | tests/e2e/features/statement-detail.feature:1641 | Kein Szenario prüft eine Breite, bei der die Tabelle erscheint (Bereich ≥ 64rem, ab ca. 1476 px Fensterbreite). Ob die Tabelle dort ganz ist (≈1010 px Bedarf in 1024 px), sichert kein Test; «Nichts ist abgeschnitten bei jeder Breite» ist nur für die Kartenseite belegt. |

## C-1

`/(^| )xl:shrink-0( |$)/.test("relative @4xl:shrink-0")` ergibt `false` (mit node geprüft). Vor `xl:` steht `4`, kein Leerzeichen und kein Anfang. `bunx vitest run src/__tests__/invoice-pages.dom.test.ts` ist auf 01db8a3d rot, CI damit auch. Laut Aufrufer wurden zwei DOM-Tests umbenannt; der dritte Test, der eine geänderte Klasse festhält, fehlt. Lösung: den Test auf `@4xl:shrink-0` umstellen, wie statement-pages.dom.test.ts:675.

## C-2

`CLAUDE.md`, Gotchas «Formatting»: in einer geänderten Datei nur die eigenen Zeilen formatieren. Drei Blöcke ausserhalb der Änderung sind umgebrochen; die Umrückung des Kartenblocks durch den neuen `@container`-Wrapper ist dagegen nötig. Zeigen: `git diff e6453741 01db8a3d -- 'src/routes/statements/[id]/CostTable.svelte'`. Die Hunks @@ -58 @@, @@ -95 @@ und @@ -104 @@ berühren keine Klasse und keine Struktur.

## C-3

`CLAUDE.md`, Design-Regeln «Screens/Process»: eine Änderung, die einen bestehenden Zustand eine andere Variante zeigen lässt, behält eine Zeile für jede Variante. Vorher prüfte axe bei Desktop 1440 die Tabelle samt `role="region"` mit `tabindex="0"`. Jetzt ist der Bereich bei 1440 nur 988 px breit (Begründung des Aufrufers), der Zustand `default` zeigt in allen drei Ansichten (1440/820/390) die Karten. Die Tabelle erscheint erst ab einem Bereich von 64rem, und keine Zeile in `screens.json` erreicht das. Nötig ist entweder eine Zeile oder Ansicht, in der der Bereich ≥ 64rem ist, oder eine Begründung im Pull Request, warum keine nötig ist.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bun run fitness`, vitest (statement-pages.dom, form-selects.dom, tokens, design-guard, open-work, feature-wording, no-german-in-code, e2e-screenplay-lint, `--changed`), E2E chromium contracts/invoices/statements/statement-detail/statement-edit, api statement-detail, accessibility- und sprachen-bildschirme-Zeilen, die Breiten-Durchsicht 360–1920 in de/fr/it/en. Die Meldung «`--changed` grün» widerspricht C-1.
- Rotlauf der neuen Szenarien (contracts 853/1024, statements 853, statement-detail 1440): nur gelesen. Plausibel, weil `HiddenSideways` die Scroll-Region der Tabelle misst und versteckte Karten bzw. Tabelle 0 liefern. Invoice-Grundriss und die übrigen Beispiele sind laut Commit-Nachricht festgehaltenes Verhalten.
- Die Positions-Targets in tests/e2e/targets/statement-detail.ts:7-33 lesen bei 1280 px (Standardansicht) jetzt die Karte statt der Tabellenzeile. Die Werte sind gleich (`dd`-Reihenfolge = `td`-Reihenfolge, gleiche Formatierung), betroffen sind aber Prüfungen von Szenarien ohne `@wip` auf `main`. #658 entscheidet den Wechsel zu den Karten; der Pull-Request-Text braucht dafür `Spec change approved: #658`. Der Pull Request existiert noch nicht.
- `@container` (inline-size) auf der Seitenwurzel mit dem `fixed`-Dialog darin (Rechnungs-Upload): nach der aktuellen Spezifikation gibt es keine Layout-Containment, der Dialog bleibt also am Fenster. Im Browser nicht geprüft; laut Aufrufer liefen die Rechnungs-E2E grün.
- Ob die Tabelle bei 64rem in fr/it/en ganz passt: nur die Durchsicht des Aufrufers (siehe C-6).

Geprüft: Umfang wie in #658 «Where» (Listen Rechnungen/Abrechnungen/Mietverträge, Abrechnungsdetail); keine neuen Texte; Kommentare zu 56rem/64rem stimmen; Wortlaut der Features; Screenplay-Schichten; die Kartenvariante der Targets für die Rechnungen einer Position.
