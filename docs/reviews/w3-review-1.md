# Slice-Review 1: #250, #254 (Leistungszeitraum über mehrere Jahre)

Gegenstand: Worktree `review-w3-code`, `git diff 87dda97 d51f85e` (Commits b9509aa, 47babc0, d51f85e). Alle 18 geänderten Dateien gelesen, dazu `src/lib/ui/DateInput.svelte`, `src/routes/invoices/UploadRowFields.svelte` (Import), `src/__tests__/help-page.dom.test.ts`, die Grundlage von `statement-generate.feature`, die bestehenden Steps (`statement-detail.steps.ts:58`, `statement-generate.steps.ts:136`), `tests/e2e/CLAUDE.md` (@api), `docs/design/i18n-begriffe.md`, Issues #250 und #254 mit Kommentar.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major (Produktentscheid) | `messages/de.json:722` (und fr/it/en:722), `src/routes/invoices/InvoiceDataFields.svelte:85`, `src/routes/help/+page.svelte:33` | Das Beispiel nutzt `{year}`/`{end}` statt des in #254 entschiedenen «exactly this example» 01.04.2026 – 31.03.2031. Ab 2027 zeigt die App andere Jahre. Nach `CLAUDE.md` gehört eine Änderung an einem entschiedenen Text dem Product Owner. Fachlich ist die Wahl richtig (siehe unten). |
| C-2 | Minor | `src/routes/help/+page.svelte:33-34`, `src/__tests__/help-page.dom.test.ts` | Auf der Hilfeseite prüft kein Test das Beispiel (Jahr, `{end}`) und den Boiler-Absatz. `help.feature` prüft nur den ersten Satz, und der enthält kein Jahr. Entfernt man `{ year, end: year + 5 }` oder `m.invoices_service_period_boiler()`, bleibt alles grün. Ein DOM-Test mit `setSystemTime` wie in `invoice-pages.dom.test.ts:494` würde das abdecken. |
| C-3 | Nit | `src/routes/invoices/InvoiceDataFields.svelte:45-47` | Die neue Konstante `year` steht zwischen dem bestehenden Kommentar «ISO dates compare as text; …» und dem Code, den dieser beschreibt (`byServicePeriod`, `outside`). `year` samt Kommentar gehört vor diesen Kommentar. |
| C-4 | Nit | `messages/fr.json:722`, `messages/it.json:722` | «toutes les quelques années» und «ogni qualche anno» klingen holprig. Üblich sind z. B. «tous les deux ou trois ans / périodiquement» und «ogni tot anni / a intervalli di alcuni anni». Die Persona- oder Sprachprüfung sollte das bestätigen. |
| C-5 | Nit | `implementation_plan.md:7-13` | Nach Schritt 8 hakt man jeden Punkt ab, sobald er erledigt ist. Erledigt, aber nicht abgehakt sind #250, die drei Punkte zu #254 und der fach-reviewer-Punkt. Hinter «Files:» steht nichts. |

ponytail-review: Lean already. Ship. (`new Date().getFullYear()` steht nun dreimal im Code: `DateInput.svelte:35`, `InvoiceDataFields.svelte:47`, `help/+page.svelte:8`. Ein gemeinsamer Helfer wäre für eine Zeile nicht kürzer.)

## Blocker/Major

### C-1 (Major, Produktentscheid): Jahr des Beispiels weicht vom Entscheid in #254 ab

- Warum: In #254, «Decided (product owner)», steht: «Help text … with exactly this example» (01.04.2026 – 31.03.2031). Der Diff rendert `01.04.{year} bis 31.03.{end}` mit `year = new Date().getFullYear()`. `CLAUDE.md` («Coding guidelines») erlaubt eine Abweichung von einem entschiedenen Text nur für einen Ort, den die App nicht hat. «Any other change to a decided text or value is mine.» #250 und #254 widersprechen sich hier. Mit festem 2026 würde der Block ab 2027 zwei Jahre nennen (#250 verletzt), mit `{year}` weicht der Text vom Wortlaut in #254 ab. Das ist ein Fall von «two instructions that disagree» und muss nach «When to ask» genannt und entschieden werden.
- Beleg, dass es abweicht: Der neue Test selbst, `src/__tests__/invoice-pages.dom.test.ts:507` mit Systemzeit 2027-03-01, erwartet «Geben Sie dann 01.04.2027 bis 31.03.2032 ein.» und nicht den Wortlaut aus #254.
- Fachlich bestätigt: `docs/reviews/w3-fachreview-1.md`, V-6 empfiehlt `{year}`. Mit dem Ende am 31.03. ist das Datum immer gültig, und «etwa CHF 100 pro Jahr» bleibt auch bei 1'827 Tagen wahr. Heute (2026) stimmt der Text wörtlich mit #254 überein.
- Vorgehen: kein Code-Fehler. Gehört unter «Blocked on me», bis der Product Owner `{year}` bestätigt (oder in den Pull Request als Abweichung mit Begründung, wenn er es so entscheidet). Erst dann mergen.

## Bestätigt

- **#250:** In allen vier Sprachen nimmt `invoices_service_period_help` `{year}` an (`messages/*.json:721`). `InvoiceDataFields.svelte:85` gibt das Jahr weiter, das auch `DateInput.svelte:35` nutzt. Der DOM-Test `invoice-pages.dom.test.ts:494-511` legt die Systemzeit auf 2027 und prüft das Feldbeispiel «31.12.2027» sowie alle Jahreszahlen im Hilfeblock (`['2027','2027','2027','2027','2032']`). Auf der Basis wäre er rot (2024 im Text, Schlüssel `_years` fehlt).
- **#254, Formular und Upload-Dialog:** Für beide gilt `InvoiceDataFields.svelte`, das neu, bearbeiten und `UploadRowFields.svelte` einbinden. Abgedeckt durch die DOM-Tests `invoice-pages.dom.test.ts:514` und `invoice-upload-dialog.dom.test.ts:140` sowie das Szenario `invoice-new.feature:40`. Ohne die Änderung schlagen alle drei fehl.
- **#254, Hilfeseite:** Beide Absätze stehen in `help/+page.svelte:33-34`, das Szenario steht in `help.feature:26`. Auf der Basis wäre es rot (zur Abdeckung siehe C-2). Dass die neuen Einträge in der nummerierten Liste keine Schritte sind, folgt dem Vorbild von `help_invoices_4`.
- **Boiler-Text:** In allen vier Sprachen wörtlich wie der korrigierte Text im Fach-Review (M-1, M-2, M-3). Zitierweise wie im Bestand: de «Absatz 2 Bst.», fr «al. 2, let. e, OBLF», it «cpv. 2 lett. e OLAL». Begriffe nach `i18n-begriffe.md`: imputable/addebitabile/allocable, contrat de bail, frais accessoires, période de prestation.
- **Szenario `statement-generate.feature:77-88`:** Es nutzt nur bestehende Steps, `@api` passt (Berechnung). In der Grundlage hat «Lindenhof» eine Wohnung, Marc Huber mietet seit 2024-05-01, die Pauschale ist 0 %. 500 × 275/1'826 = 75.30 und 500 × 365/1'826 = 99.95 (nachgerechnet). Das stimmt mit dem Korrekturkommentar zu #254 überein. Feature ohne `@wip`. Das Szenario hält bestehendes Verhalten fest und ist deshalb schon auf der Basis grün. Das verlangt #254 so.
- **Backend-Test `service-period.pg.test.ts:79-93`:** Nachgerechnet sind 275, 365, 366 und 90 Tage von 1'826, das ergibt 75.30, 99.95, 100.22 und 24.64. Die übrigen Tests der Datei nutzen andere Perioden (2024/2025), es gibt also keine Überschneidung. Laut Aufrufer wurde er durch Entfernen der Anteilsrechnung rot gesehen.
- **E2E-Schichten:** Neues Target `servicePeriodHelp` (`targets/invoice-form.ts:19`), Question `Text.of` (`questions/invoice-form.ts:23`), Step nur über `verwalter.sees(...)` (`steps/invoice-form.steps.ts:158`). Die Question gibt den Text zurück, kein Ja/Nein. Kein Konflikt mit dem Step `erklärt das Formular {string}`.
- **`data-testid` `invoice-service-period-help`:** in kebab-case mit Komponentenkontext. Im Upload-Dialog kommt die Test-ID wie die bestehenden Feld-IDs (`invoice-service-start-input`) pro Zeile vor, wie im Bestand.
- **Design:** nur Token-Klassen (`text-ink-muted`, `gap-2`), keine neuen Bedienelemente. Kein neuer Bildschirm und kein neuer Zustand, also nichts für `screens.json`, `accessibility.feature` oder `sprachen-bildschirme.feature`.
- **Doku:** `docs/nebenkostenabrechnung-anforderungen.md`, Regel 1, steht unter «Where» von #254. Der Diff enthält nichts, was nicht zur Anforderung gehört.
- **Sicherheit/API:** Keine Änderung an BFF, Auth oder API-Antworten, keine Verträge betroffen.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` (2622), `cd backend && bun test src/__tests__/service-period.pg.test.ts`, E2E chromium+api (help, invoice-new, invoice-edit, statement-generate, sprachen-bildschirme, accessibility; 372 passed): vom Aufrufer gemeldet. Mein Versuch, die drei DOM-Dateien neu auszuführen, scheiterte, weil der Worktree `node_modules` aus `/home/user/Dwello` nutzt und eine Deny-Regel diesen Pfad sperrt.
- Den Rot-Nachweis des Backend-Tests (Anteilsrechnung entfernt) und den Rot-Lauf der DOM-Tests vor der Komponentenänderung habe ich nur gelesen. Durch Lesen bestätigt: Die DOM-Tests und die Szenarien in `help.feature`/`invoice-new.feature` schlagen auf der Basis fehl.
- Ob `sprachen-bildschirme` «Boiler» in fr/it als deutsches Wort einstuft: Laut Aufrufer ist der Lauf grün. Selbst nicht ausgeführt.
- Dass eine Vorschau der künftigen Periode 2027 im E2E-Stack erlaubt ist: im Code nicht nachgeprüft, laut Aufrufer läuft das Szenario grün.
