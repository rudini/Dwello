# Code-Review 5: Merge-Commit 811d7258 (PR #354, #71)

Geprüft: `git show 811d7258 --cc` (11 Dateien), `git diff 78aa4860 811d7258` (was der Zweig gegenüber `main` noch ändert) und die aufgelösten Stellen in `calculation.service.ts`, `pdf.service.ts`, `statement-pdf.service.ts`, `statement-pdf-render.test.ts` und `nebenkostenabrechnung-anforderungen.md`. Worktree: `/tmp/claude-0/-home-user-Dwello/80f6c78d-4176-5c5e-b0cf-a0f1691f2996/scratchpad/review-71-merge`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | backend/src/services/pdf.service.ts:795-799, 813 | Erst durch den Merge entstanden: `partNamed` (#236) hängt den Namen jetzt auch an eine Heizzeile ohne Leistungszeitraum, die nach Heizprofil gerechnet wird. Im PDF steht dann «… Anteil nach Heizprofil: 52.00 % (siehe Heiz- und Warmwasserkosten) (Rechnung «…»)», also zwei Klammern hintereinander. Kein Test legt diese Kombination fest: In `statement-pdf-render.test.ts:441-485` hat `invoiceParts` keine `description`, und das E2E-Szenario sowie Regel 5 prüfen den Text nur bis vor die Klammer mit dem Namen. Vorschlag: einen Render-Test mit `description` ergänzen und entscheiden, ob der Name vor dem Teil zum Heizprofil stehen soll. |
| C-2 | Nit | backend/src/services/pdf.service.ts:188 | Kommt von `main`, nicht von diesem Merge: Im französischen `partNamed` stehen in `« {description} »` normale Leerzeichen, während #348 sonst überall ` ` setzt. Nur zur Kenntnis, in diesem PR nicht ändern. |

Keine Blocker und keine Majors.

## Geprüft und bestätigt (beide Seiten erhalten)

- **calculation.service.ts.** `byRunProfile` (Z. 200-206) ruft `handleMidYearMoves` mit `billingStart(contract)` auf, wie `main` es in der aufgelösten Schleife tat (#133). `GroupRun.contract` hat `billedUntil`. `heatingOfRun` (Z. 489) nutzt ebenfalls `billingStart`. `byProfile` und `sharedByInvoices` rechnen mit `rental` aus `contractOverlap` (Z. 400). Dieser Wert kommt aus `prorating.service.ts:160`, das schon `billingStart` verwendet. Die Monate des Mieters in einer Rechnung mit Leistungszeitraum beginnen also auch nach «Abgerechnet bis» erst am Tag danach. Der Filter #91 auf vereinbarte Kategorien (Z. 378-379) ist unverändert vorhanden. Beide Importe stehen drin, und `periodReadings`/`tankCategory` (#257, #72) kommen vom Zweig. Die Zuordnung `invoiceParts[i]` zu `invoices[i]` für die Beschreibung (`statement-pdf.service.ts:95`) bleibt richtig, weil `byProfile` die Rechnungen in derselben Reihenfolge abbildet.
- **pdf.service.ts.** `partLines` kombiniert `partLine` (Zeile mit Heizprofil oder Tagen) mit `nameOf`/`partNamed` von `main`. Der Faktor «x %» oder «d/t» des Zweigs ist erhalten. Die Schlüssel #120/#358 (`replacesNote`, `prior*`, `and`) und die Formulierungen von #348 (de `sharesNoteFuel` «Kosten des Gebäudes», it «spese di riscaldamento», fr ` ` und « … », en «under the heating profile», ‘Heating and hot water costs’) sind in allen vier Sprachen erhalten. Die neuen fr/en-Texte des Zweigs (`heatingNoteParts`, `partProfile`, `partProfileRun`, `sharesNoteHeatingParts`) folgen jetzt diesem Stil. it/de blieben unverändert und passen dazu (it `partProfileRun` «vedi spese di riscaldamento e acqua calda» wie `sharesNoteFuel`).
- **statement-pdf.service.ts:202-204.** `billedOf` aus `main` und der Filter `heatingLine` des Zweigs (`!item.invoiceParts && totalAmount !== 0`) stehen beide drin.
- **statement-pdf-render.test.ts.** Beide `describe`-Blöcke sind erhalten (#71 und «PDF einer berichtigten Abrechnung»). Die fr/en-Erwartungen passen Zeichen für Zeichen zu den aufgelösten Texten. Die Leerzeichen ` ` werden beim Lesen offenbar normalisiert, denn die Erwartungen enthalten normale Leerzeichen.
- **Regel 5 in nebenkostenabrechnung-anforderungen.md.** Der Text von #71 und der Einschub zu #236 (Beschreibung der Rechnung) stehen beide drin. Die Fassung von `main` mit «offen in #71» ist richtig ersetzt.
- **E2E.** Das Szenario `statement-detail.feature` (Szenariogrundriss mit 71.5/26 % und das PDF-Szenario) und der Schritt `{float}` ändern sich durch den Merge nicht. Die geprüften PDF-Texte auf Deutsch hat `main` nicht verändert.
- Der Merge enthält nichts, was mit dem Auftrag nichts zu tun hat. Die übrigen Dateien unter `--name-only` sind Archiv- und Dokumentationsdateien und ohne Konflikt-Hunks zusammengeführt.

## Nicht bestätigt

- Lint, `check`, `type-check`, Backend `bun run test` (943 bestanden, Abdeckung 94.9 %), `bunx vitest run` (2952 bestanden) und E2E chromium+api `-g "Leistungszeitraum|Heizprofil|Heizkosten|Tank"` (50 bestanden): vom Aufrufer gemeldet, nicht erneut ausgeführt (Backend-Tests und E2E waren untersagt).
- Ob `billed-until.pg.test.ts` den Heizanteil prüft, der über `byRunProfile` mit `billingStart` läuft, habe ich nur an der Testbeschreibung abgelesen (Z. 3-6, Heizrechnung ohne Leistungszeitraum). Die Zusicherungen selbst habe ich nicht gelesen.
- Für eine Heizrechnung mit Leistungszeitraum zusammen mit «Abgerechnet bis» (#71 und #133 kombiniert) gibt es keinen Test. Laut Code ist das Verhalten über `contractOverlap` stimmig (siehe oben), mit einem Test belegt ist es nicht.
