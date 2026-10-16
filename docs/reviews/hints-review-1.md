# Code-Review 1: Hinweise der Rechnungsprüfung (#130 Leistungszeitraum, #131, #134)

Gegenstand: `git diff 87dda97 b638272` im Worktree `review-hints-code` (b638272). Alle 27 geänderten Dateien gelesen, dazu `invoice.service.ts` (`inPeriod`, `getInvoicesForStatement`), `statement-generation.ts` (BFF-Laden der Prüfung), `CategoryCheck.svelte`, `TankQuestion.svelte`, `CategoryFindingItem.svelte`, `tests/e2e/fixtures/screens.ts`, `tests/e2e/CLAUDE.md`, Issues #130, #131, #134 (per `gh api`), `docs/reviews/hints-fachreview-1.md`.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | `implementation_plan.md:9`, `tests/e2e/features/statement-generate.feature` | #130 (Teil Leistungszeitraum) ändert einen sichtbaren Text der Vorschau, hat aber kein Szenario; «No scenario … as the issue asks» ist kein Grund aus `tests/e2e/CLAUDE.md`, «No scenario» |
| C-2 | Major | `backend/src/services/invoice-completeness.service.ts:186` | Die Quelle der Zahl (`partial: 'whole' in invoice.inPeriod`) deckt kein Test ab: der Unit-Test setzt `partial: true` von Hand, kein pg-Test und kein Contract hat eine Rechnung, deren Leistungszeitraum über die Periode reicht |
| C-3 | Minor | `src/lib/statement-wizard.ts:149-156` | Pluraltext `statements_finding_partial_many` und die Beschränkung auf `gap`/`deviation` ohne Test (nur Einzahl bei `deviation` im DOM-Test); ein falscher `{count}` oder der Satz bei `new` bliebe grün |
| C-4 | Minor | `docs/api-specification.md:122` | Antwort von `/completeness/:buildingId` dort nicht nachgeführt (`partialCount`, `lateInvoices`, `invoicesWithoutServicePeriod`) |
| C-5 | Minor | `tests/e2e/tasks/statement-generate.ts:106` | `editHintedInvoice` klickt nur und wartet nicht auf die Seite, zu der er führt (anders als `recordInvoiceFromWarning` mit `Wait.forUrl`) |
| C-6 | Nit | `tests/e2e/targets/statement-generate.ts:62` | `hintedInvoiceLink` sucht auf der ganzen Seite, nicht im Hinweis; `hintedInvoice(hint, date)` plus `getByRole('link')` wiederverwenden (ponytail `reuse:`) |
| C-7 | Nit | `src/lib/statement-wizard.ts:72,88-89` | `partialCount?`, `lateInvoices?`, `invoicesWithoutServicePeriod?` optional, obwohl das Backend sie immer schickt; zusammen mit `?? []` in `categoryCheck` doppelte Vorsicht (ponytail `delete:`, sofern die Fixtures es erlauben) |
| C-8 | Nit | `tests/e2e/questions/statement-generate.ts:116-117` | `invoiceWithoutServicePeriodOn` (Text) und `invoicesWithoutServicePeriodOn` (Anzahl) unterscheiden sich nur durch ein «s»; z. B. `invoicesWithoutServicePeriodCountOn` |
| C-9 | Nit | `src/routes/statements/generate/InvoiceHint.svelte:28-34` | Der Linkname («Kaminfeger Keller, 20.01.2025, CHF 290.00») sagt nicht, dass er zum Bearbeiten führt; V-6 schlug «… bearbeiten» vor. Für eine Zeile, die ein Link mit dem Namen des Datensatzes ist, zulässig |

Ponytail: C-6, C-7. Sonst schlank (eine Komponente für beide Hinweise, eine Abfrage `withoutServicePeriod` für beide Listen, `yearAfter` aus vorhandenem Code herausgezogen und wiederverwendet). net: etwa −4 Zeilen möglich.

## C-1 (Major): #130 Leistungszeitraum ohne Szenario

**Warum falsch.** `CLAUDE.md`, Workflow 1: jede Verhaltensänderung, die der Benutzer sieht, beginnt mit einem Szenario; ohne Szenario nur, wenn der E2E-Stack den Zustand nicht erzeugen kann (`tests/e2e/CLAUDE.md:61-69`, abschliessende Liste). Der neue Satz «1 Rechnung zählt nur teilweise: …» erscheint in der Vorschau, also in der Oberfläche. Der Stack kann ihn erzeugen: der Schritt «im Gebäude {string} gibt es eine Rechnung der Kategorie {string} über {string} Franken vom {string} für die Zeit vom {string} bis {string}» (`tests/e2e/steps/statement-detail.steps.ts:58`) und «meldet die Prüfung der Kategorien für {string}: {string}» gibt es schon. Dass #130 nur Unit- und DOM-Test nennt, hebt die allgemeine Regel nicht auf (#130 «Plus the general finish in `CLAUDE.md`, "Workflow"»). Das Szenario aus #130 «Done means» betrifft nur den Rhythmus.

**Wie zeigen.** `grep -n "teilweise" tests/e2e/features/*.feature` findet nichts. Ein Szenario neben «Hinweis auf fehlende Rechnungen einer Kategorie», z. B. Kaltwasser 2023: 1000 vom 2023-01-31 (erste Rechnung in den ersten drei Monaten, sonst gilt das Vorjahr als nicht erfasst); 2024: 1200 für die Zeit vom 2024-07-01 bis 2025-06-30 (zählt mit 184/365 ≈ 604.93 → −40 % → `deviation`), Erwartung «… 1 Rechnung zählt nur teilweise …», fällt heute ohne die Zeile 186 rot. Damit wäre auch C-2 abgedeckt.

## C-2 (Major): Herkunft von `partialCount` ungetestet

**Warum falsch.** Das Verhalten «the finding carries the count» entsteht in `categoryInvoices` (`invoice-completeness.service.ts:186`) aus `inPeriod.whole` (`invoice.service.ts:518-519`). Der Unit-Test (`invoice-completeness.test.ts:91`) setzt `partial: true` direkt in die Eingabe von `checkCategories`; der DOM-Test setzt `partialCount: 1` direkt. Die pg-Tests (`invoice-completeness.pg.test.ts`) prüfen nur `lateInvoices`/`invoicesWithoutServicePeriod`, der Contract hat `partialCount: 0` ohne eine Rechnung mit Leistungszeitraum über die Periode hinaus.

**Wie zeigen.** Zeile 186 auf `partial: false` (oder `'noPeriod' in invoice.inPeriod`) ändern: alle Tests der Slice bleiben grün, die Vorschau zeigt den Satz nie. Fix: ein Fall in `invoice-completeness.pg.test.ts` (Rechnung mit Leistungszeitraum über das Periodenende, Abweichung zum Vorjahr, `findings[0].partialCount === 1`) oder das Szenario aus C-1.

## Bestätigt durch Code und Test

- #131 Backend: `withoutServicePeriod` wählt dieselben Rechnungen wie `getInvoicesForStatement` (umlagefähig, `servicePeriodStart IS NULL`, nach Rechnungsdatum); Fenster Ende+1 bis Ende+90 mit benannter Konstante `LATE_INVOICE_DAYS`. pg-Test: 20 Tage danach genannt, mit Leistungszeitraum, nicht umlagefähig und 91 Tage danach nicht genannt, 90. Tag (Grenze) genannt (Rechnung nachgezählt: 01.01.2025 + 90 Tage = 01.04.2025).
- #131 Vorschau: pro Gebäude (Name als Listenname), Lieferant, Rechnungsdatum, Betrag, Link `/invoices/{id}/edit` (Route existiert), `info`-Hinweis ohne Einfluss auf `needsConfirmation`; DOM-Test inkl. Weitergehen ohne Bestätigung; Szenarien «Hinweis …» und «Von einer Rechnung … zur Rechnung», beide ohne `@wip`, beide ohne die Änderung rot (Ziel `late-invoices` fehlt).
- #134: `underAYear` (Ende+1 < Start+1 Jahr) korrekt, auch 29.02.; pg-Test für kurze Periode und Gegenprobe ganzes Jahr (V-5); Szenario mit Gegenprobe «keine Rechnung vom 31.03.2024» nach positivem Anker und «verlangt die Vorschau keine Bestätigung».
- Texte in allen vier `messages/*.json`, Begriffe nach `docs/design/i18n-begriffe.md` (Leistungszeitraum, Abrechnungsperiode); V-3 (Plural) und V-7 (Wortlaut #134) übernommen; V-4 wie angegeben verworfen.
- a11y/Sprachen: `invoice-hints` in `screens.json` (mit `stateMeanings`), `accessibility.feature`, `sprachen-bildschirme.feature`, Seed in `fixtures/screens.ts` (Hauswart 31.01.2025 ganz gezählt, Lift 30.06.2025 30 Tage nach dem 31.05.2025).
- Design: nur `Alert` aus `src/lib/ui`, Token-Klassen wie in `TankQuestion.svelte`, Links `min-h-12`.
- Sicherheit: nur id, Lieferant, Datum, Betrag des eigenen Gebäudes; Laden über den bestehenden BFF-Aufruf, keine neue Route.
- Contract `tests/contracts/invoice-completeness.json` nachgeführt, im `api-contracts.pg.test.ts` mit Daten belegt.
- Screenplay: Schritte rufen nur Tasks und Questions; Questions liefern Text bzw. Anzahl; Feature-Sätze ohne UI-Wörter.
- Netto keine fremden Änderungen: das in 89d87f2 geänderte Szenario «Hinweis auf fehlende Rechnungen einer Kategorie» und das Rhythmus-Szenario sind in b638272 wieder auf dem Stand von `main`.

## Nicht bestätigt

- Alle Checks des Aufrufers (lint, check, backend type-check, `bunx vitest run` 2624, die drei Backend-Testdateien, E2E `statement-generate.feature`, axe/Sprachen `invoice-hints` und `category-check`): **vom Aufrufer gemeldet**, nicht wiederholt. Ein Lauf von `bunx vitest run` im Worktree war nicht möglich (Zugriff auf `node_modules` durch eine Deny-Regel gesperrt).
- E2E nach dem Umformulieren der beiden Navigationsszenarien in b638272: Lauf steht laut Aufrufer aus. Gelesen: beide nutzen jetzt die vorhandenen Schritte «… öffnet» (`statement-generate.steps.ts:67`, `:327`); keine verwaisten Schrittdefinitionen.
- Ob der Hinweis «ohne Leistungszeitraum» im a11y-Zustand `invoice-hints` wirklich erscheint: der Zustand wartet nur auf `late-invoices`; Seed gelesen, nicht ausgeführt.
- Ob die zusätzliche Rechnung vom 2026-01-20 in `api-contracts.pg.test.ts` andere Contracts derselben Datei verändert: nur gelesen (laut Aufrufer grün).
