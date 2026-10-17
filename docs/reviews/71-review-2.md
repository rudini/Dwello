# Code-Review #71 (Heizprofil im Leistungszeitraum), Runde 2 (abschliessend)

Worktree `review-71-code2` (detached auf f8ef41c), Bereich `git diff 5ef0f20 f8ef41c` (ein Commit, f8ef41c). Ich habe alle 11 geänderten Dateien gelesen. Dazu kamen `calculation.service.ts` von Z. 60 bis 260 (`daysOf`, `partOf`, `byProfile`, `sharedByInvoices`, `byRunProfile`, `shareOfGroup`), `statement-pdf.service.ts` (`toPdfData`, `heatingOf`, `runDetailsOf`), `pdf.service.ts` (`ownProfileDays`, `sharesNote`, `heatingNote`, `heatingLines`), `__tests__/helpers/pdf-text.ts` und der Rumpf von #335 und #339 über `gh api`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | backend/src/services/statement-pdf.service.ts:179, calculation.service.ts:190 | Die Fixes C-1 (R1) und M-4 zusammen erzeugen einen neuen Widerspruch. Eine Heizposition mit eigenen Tagen, deren Rechnungen zusammen 0 ergeben, gibt jetzt `periodShare 0` und `invoiceParts null` zurück. `runDetailsOf` wählt sie deshalb als `heatingLine`. Ist sie die erste Heizposition, druckt das PDF «Heizkosten nach Heizprofil «…»: 0.00 % der Heizkosten Ihrer Wohnung in der Abrechnungsperiode». Darunter stehen aber die Monate des Mieters, zusammen z. B. 52.00 %. Hat das Gebäude eine zweite Heizkategorie mit Kosten, ist der Satz für diese falsch. Auf 5ef0f20 wurde die Position ausgeschlossen (Teile mit `profile`), dort stand `stored.percent`. Der Fall tritt nur bei #237 auf (Rechnung und Gutschrift über verschiedene Tage), daher Minor. Abhilfe: in `runDetailsOf` zusätzlich `parseFloat(item.totalAmount) !== 0` prüfen oder im Zweig für die Nullsumme `heatingOf` den Anteil des Laufs lassen. Dazu ein Test im pg-Test, der zur Nullsumme den Satz mit 52.00 % prüft. |
| C-2 | Nit | backend/src/services/pdf.service.ts:723 | Der Kommentar zu `ownProfileDays` sagt noch «invoices by the Heizprofil's months in their own days». Seit M-4 zählt auch eine Heizposition mit Teilen nach Tagen (0-%-Monate). |
| C-3 | Nit | backend/src/services/pdf.service.ts:170, :197, :206, :179 | Diese Texte haben keinen Test, ein Tippfehler bliebe unbemerkt: die neuen Sätze `sharesNoteHeatingParts` in fr, it und en (P-3), it `heatingNoteParts` («la quota di tale fattura», V-10) und das geschützte Leerzeichen (V-11). Der it.each-Test prüft nur den Satzanfang bis «… senza periodo di prestazione.». `readPdf` macht aus dem geschützten Leerzeichen ein normales, darum ist V-11 so nicht prüfbar. Das ist zulässig, weil der Wortlaut übersetzt und begutachtet ist (Skill `slice-review`, Triage). |
| C-4 | Nit | implementation_plan.md:14 | In der Zeile «Files» fehlt `statement-pdf.pg.test.ts`, das mit dem Fix M-4 dazugekommen ist. |

Es gibt keine Blocker und keine Majors.

ponytail-review: `calculation.service.ts:L179: shrink: [from, to] wiederholt die Klammerung aus rentedIn (Z. 131-132). Eine gemeinsame clamp-Hilfe nutzen, etwa −1 Zeile.` net: −1 Zeile möglich. Sonst ist der Code schlank.

## Bestätigt

- **C-1 (R1), Nullsumme:** `sharedByInvoices` gibt bei `group.totalAmount === 0` vor `byProfile` `{ periodShare: 0, shareDays: noDays }` zurück (Z. 189-190). Damit fällt die spätere Prüfung auf 0 weg. Der neue pg-Test «nennt keine Rechnungen unter einer Heizposition, deren Rechnungen zusammen null ergeben» erwartet `invoiceParts: null`. Ohne den Fix wäre er rot gewesen, denn `invoiceParts` wäre ein Array gewesen. Die Nebenwirkung steht unter C-1.
- **C-5 / V-9:** «aucune» und «nessuna» sind gesetzt, die Render-Tests sind angepasst.
- **C-6:** `partOf` wird jetzt von `daysOf` und `byProfile` gemeinsam benutzt. Damit trägt `byProfile` auch `fuelStock`. Das ist nicht erreichbar, weil `ownDays` Tankkategorien ausschliesst (Z. 220), und deshalb harmlos.
- **C-7, C-8:** `list` und `toDate` sind entfernt, das Verhalten bleibt gleich.
- **M-4:**
  - `heatingLine` schliesst jede Heizposition mit `invoiceParts` aus, und `ownProfileDays` gilt für `byProfile && invoiceParts`.
  - Gespeicherte Abrechnungen sind nicht betroffen, das habe ich geprüft. Teile an Heizpositionen gab es vor #71 nur in Läufen nach Tagen (`stored.byDays`), und dort gibt `heatingOf` `{}` zurück. Eine Tankposition in einem Lauf nach Profil hat `noDays`.
  - Der neue pg-Test (Sommerrechnung Juni bis August, Einzug am 01.07., geändertes Profil Jul–Dez = 40 %) prüft drei Dinge: 62/92, den Satz mit 40.00 % statt 67.39 % und die Erläuterung zum 0-%-Fall. Ohne die beiden Änderungen schlägt er fehl, denn er bekäme 67.39 % und `heatingNote`. Damit ist auch C-4 aus Runde 1 auf der Schicht `statement-pdf.pg.test.ts` abgedeckt.
- **P-3:** Der de-Satz lautet jetzt «Haben diese Monate im Heizprofil zusammen 0 %, zählen stattdessen Ihre Mietstage darin.», mit Render-Test und pg-Test. fr, it und en sind sinngemäss gleich umgebaut, ungetestet (C-3). Kein E2E-Schritt prüft den alten Satz (grep in `tests/e2e`).
- **V-10, V-11:** Sie sind in allen vier Sprachen umgesetzt, das gilt auch für ` %`.
- **V-12:** Regel 5 trennt jetzt den Satz zu #335 vom Satz «Ohne Heizprofil …». Sonst ist der Text unverändert (Diff der Zeile verglichen).
- **V-13:** In #335 steht jetzt «620.00 instead of 50.00 (…; 100.00 under the old one)».
- **P-1:** Daraus ist #339 entstanden (offen, `fachlich`, `entscheiden`). Der Plan nennt es.
- **Texte:** Es betrifft nur PDF-Texte in `pdf.service.ts`. `messages/*.json`, Bildschirme und `screens.json` sind nicht betroffen. Es gibt keine neuen Domänenbegriffe.
- **Szenario:** M-4 korrigiert noch nicht ausgeliefertes Verhalten von #71, dessen Szenarien in `statement-detail.feature` stehen. Die tiefste Schicht, die den Fall zeigt, ist der neue pg-Test. Das E2E-Szenario wurde nicht geändert.
- **Unbeteiligtes:** Nichts. Zum Diff gehören auch die Berichte `71-review-1.md`, `71-fachreview-2.md` und `dr-weber-71.md` sowie der Plan.

## Nicht bestätigt

- Diese Checks hat nur der Aufrufer gemeldet, ich habe sie nicht wiederholt:
  - `bun run lint`, `bun run check`, `cd backend && bun run type-check`
  - `cd backend && bun run test` (777 pass, 94.4 % Zeilen)
  - E2E `--project=chromium --project=api -g "Leistungszeitraum|Heizprofil|Heizkosten"` (38 passed)
  - fallow und Commit-Gates, Prettier ohne Diff
- **C-1 ist aus dem Code abgeleitet, nicht ausgeführt.** Ich habe weder Backend-Tests noch PDFs laufen lassen, das war so vorgegeben. Gelesen habe ich `shareOfGroup`, `sharedByInvoices`, `runDetailsOf`, `heatingOf`, `heatingLines` und `periodShare` als `decimal(8,4)` (`schema.ts:465`, gespeichert über `String(item.periodShare)`).
- **Rotphase der neuen Tests:** Ich habe sie nur durch Lesen beurteilt (oben).
- **Wortlaut fr/it/en:** Ich habe ihn nicht gegen `docs/design/i18n-begriffe.md` geprüft, nur auf Sinngleichheit mit de.
