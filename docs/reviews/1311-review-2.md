# Code-Review #1311 / #1312, Runde 2 (ba6a26b..9bbc0f1, mit Merge von origin/main)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-5 | Minor | Commit 49e9783 (Message) | Bleibt offen: Keine der neuen Commit-Messages nennt das Szenario «Vor dem Tag steht die aufgehobene Wohnung noch leer» als Pin. Der Pull Request existiert noch nicht. |
| C-6 | Major | src/routes/dashboard/BuildingFigures.svelte:49 | Die neue Kennzahl «Aufgehoben» der Übersicht mit ihrer Erklärung (V-2) hat kein Szenario. `dashboard.feature:381` prüft nur «1/1» und das fehlende «Wohnung 1.02 leer». |
| C-7 | Major | tests/a11y/screens.json:241 | Keine Bildschirmzeile zeigt die Übersicht mit der Kennzahl «Aufgehoben» und `stat-help-discontinued`. Das ist eine Variante mit eigenem Link. Für `/dashboard` legt `seedFor` keine Daten an (tests/e2e/fixtures/screens.ts:141, früher Return), und auch die Demodaten haben keine aufgehobene Wohnung. Axe und «keine deutschen Wörter» laufen also nie auf dieser Variante. |
| C-8 | Minor | backend/src/routes/dashboard.ts:50 | `portfolio.occupancyRate` teilt jetzt durch `totalApartments` mit der aufgehobenen Wohnung. Die Belegungsquote sinkt also, sobald eine Wohnung aufgehoben ist. Der Kommentar in Z. 77 und docs/api-specification.md:74 sagen aber «counts in no Belegung «occupied/total» of the dashboard». Die Oberfläche zeigt den Wert nicht, die API gibt ihn aber aus. Kein Test prüft ihn. |
| C-9 | Minor | src/routes/dashboard/BuildingFigures.svelte:106 | Der Kommentar «#731: the two status words …» ist falsch, seit `explained` drei Wörter haben kann. |

Geschlossen: C-1, C-2, C-3, C-4.

## C-6

**Warum falsch.** Die Übersicht zeigt eine neue Kennzahl «Aufgehoben». Sie verlinkt auf `/apartments?status=discontinued`, und darunter steht die Erklärung des Mietstatus. Der Benutzer sieht das, also braucht es nach CLAUDE.md, Workflow 1, und der Liste «Always check» ein Szenario ohne `@wip`. Die Kennzahl gibt es nur, wenn eine Wohnung aufgehoben ist. Fehlt sie, gehen die Kennzahlen nicht mehr auf die Zahl «Wohnungen» auf. Genau das sollte V-2 beheben, und kein E2E-Test fängt einen Rückfall.

**So zeigt es sich.** Wird der Spread `...(data.portfolio.discontinuedApartments ? [...] : [])` entfernt, bleiben alle E2E-Szenarien grün. Rot wird nur `dashboard-page.test.ts`. Die Steps gibt es schon: `erklärt die Übersicht bei den Kennzahlen {string} mit {string}` (tests/e2e/steps/dashboard.steps.ts:235) und `die Kennzahl {string} öffnet` (Z. 138). Dafür braucht die Map `statuses` in tests/e2e/questions/dashboard.ts den Eintrag «Aufgehoben». Es reicht, das Szenario «Aufgehobene Wohnung in der Belegung» um eine Zeile «Und erklärt die Übersicht bei den Kennzahlen "Aufgehoben" mit "Die Wohnung gibt es ab dem Tag unter «Aufgehoben ab» nicht mehr; …"» zu ergänzen. Das Szenario ist auf `main` neu, also frei.

## C-7

**Warum falsch.** Laut CLAUDE.md, «Process», braucht jede Variante mit eigenen Bedienelementen eine Zeile in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`. Diese Variante hat einen neuen Link `stat-discontinued` und einen neuen Erklärblock. Der Zustand `dashboard default` läuft ohne Datensätze (`seedFor` gibt für Pfade ohne `{` sofort zurück), zeigt die Kennzahl also nicht. Die Prüfungen des Aufrufers («axe and language rows … dashboard») haben die Variante deshalb nie gesehen.

**So zeigt es sich.** Die Kennzahl erscheint nur bei `discontinuedApartments > 0`. Kein Zustand von `dashboard` in screens.json legt eine aufgehobene Wohnung an. Lösung: einen Zustand (z. B. `discontinued-figure`) in die Liste von `seedFor` aufnehmen, wo `8.01` schon aufgehoben wird. Dazu gehören eine Bedeutung in `stateMeanings` und je eine Zeile in beiden Features.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bun run fitness`, `cd backend && bun run type-check`, `bunx vitest run` (4679), Backend `bun run test` (2197, Coverage 97.3 %), E2E chromium+api der acht genannten Features (165), die axe- und Sprachzeilen (76). Ebenso die Rot-Läufe: DOM-Test der Eigennutzung, Karten-DOM-Test und pg-Test der Dashboard-Summe (P-1), DOM- und pg-Test der Kennzahl, PDF-Test «Berechnung».
- C-5: Den Text des Pull Requests gibt es noch nicht.
- Den Entscheid in #1312 zu M-1 und V-2 habe ich nicht gelesen. Verglichen habe ich nur den Text der Eigennutzung in vier Sprachen mit docs/reviews/1311-fachreview-1.md, Z. 48, und «Berechnung» mit docs/reviews/1311-fachreview-2.md, Z. 27. Beide stimmen wörtlich.
- Ob «Berechnung» in `segmentNote` auch für das PDF von #1301 (Änderung der Fläche) fachlich gewollt ist: Der Satz ist seit dem Merge für beide Fälle derselbe. Die Fachreview 1311-2 V-1 bezog sich nur auf `segmentIntro`. Den Test von #1301 (statement-pdf-render.test.ts:1225) hat die Auflösung mitgezogen.

Geprüft: Auflösung des Merges (messages, pdf-texts, Glossar, Edit-Seite, DOM-Test, screens.json und Fixture, Targets und Questions nehmen beide Seiten). Die C-1-Lösung zählt auf Karte und Detail wieder `apartmentCount`, mit Test. Das C-2-Szenario ist ohne den festen Status rot (Step prüft Text und 0 Auswahlen). C-3: Vertrag um `discontinuedFrom` ergänzt. C-4: `filteredBy` prüft den Status. Neue Texte stehen in allen vier `messages/*.json`. Vertrag `dashboard.json` ist ergänzt. Der pg-Test der Portfolio-Summe ist ohne die Änderung rot. ponytail-review: nichts Unbenutztes, `existingCount` vollständig entfernt.
