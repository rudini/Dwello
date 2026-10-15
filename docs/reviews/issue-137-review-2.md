# Code-Review #137, Runde 2 (Delta): Heizkosten nach Mietstagen im PDF

Geprüft: `git diff cbbaafa..3976b25` (Commit 3976b25) im Worktree `review-137-code2` (detached auf 3976b25), dazu die offenen Befunde aus `docs/reviews/issue-137-review-1.md`. Alle 9 geänderten Dateien gelesen. Ausserdem gelesen: `calculation.service.ts` (`groupInvoicesByCategory`, `rentalShare`, `calculateStatementForContract`), `prorating.service.ts` (`calculateApartmentProrating`, `handleMidYearMoves` auf 3976b25 und auf 25ce827), `statement-pdf.service.ts` (`lineItemOf`, `toPdfData`, `heatingOf`), `pdf.service.ts` (`timeShare`), `prorating.pg.test.ts` (Block `handleMidYearMoves`), `tests/helpers/rental.ts`, `statement-generate.feature` und das #137-Szenario in `statement-detail.feature`.

## Befunde

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-3 | Major | backend/src/services/calculation.service.ts:300–319 | Die Korrektur von D-1 ändert einen Betrag, den der Verwalter in der Vorschau und der Mieter in der Abrechnung sieht. Dafür gibt es kein Szenario in `tests/e2e/features` und keine Zeile `Scenario red:` im Plan, nur den pg-Test. |
| C-4 | Minor | docs/nebenkostenabrechnung-anforderungen.md:145, implementation_plan.md:17 | Regel 5 und die Beträge haben sich nach der Fachprüfung (Runde 1, nur das Szenario) geändert. Für die neue Regel «Heizkosten nach Tagen wie jede andere Rechnung, mit ihrem Leistungszeitraum» ist kein `fach-reviewer` vorgesehen (Workflow Schritt 1 und 5: Fachregeln und Beträge). |
| C-5 | Minor | backend/src/services/prorating.service.ts:200–239 | Seit D-1 verwendet kein Aufrufer im Produktivcode mehr `share` und `percentage` aus den beiden `byDays`-Zweigen. `calculation.service.ts:313` nimmt dann `rentalShare`, `heatingOf` liefert bei `byDays` `{}`. Die Tagesrechnung dort und ihre Prüfungen in `prorating.pg.test.ts:113–141` (`share` 4800, `(10000 × 182) / 366`) sichern nur noch Werte ab, die niemand verwendet. Kürzer wäre `{ byDays: true }` ohne eigene Tagesrechnung (ponytail: «nothing unused left behind»). |

Kein Blocker. Ein Major (C-3).

### C-3 (Major): Die D-1-Korrektur hat kein Szenario

**Warum falsch:** `CLAUDE.md`, Workflow Schritt 1, verlangt: «every feature or behavior change, including a bug fix a user can see, starts with a German scenario». D-1 ist so ein sichtbarer Fehler. Der Mieter einer Sommerperiode bezahlt für eine Heizkostenrechnung mit Leistungszeitraum einen anderen Betrag. Im Testfall sind es 469.56 statt 316.45 Franken. Der Fehler bestand schon vor #137: Auf 25ce827 rechnete `prorating.service.ts:234–237` im Zweig `period.percentage <= 0` bereits mit den Tagen der ganzen Periode. #137 behebt ihn jetzt mit. Damit gilt er als eigener Bugfix, auch wenn er aus einem Review stammt. Schritt 6 («a failing test first») ersetzt Schritt 1 nicht. Ein Ausweg `No scenario: server-side failure` trifft nicht zu: Es geht um einen Betrag, nicht um einen Fehler zwischen Serverteilen.

**Wie man es zeigt:** Die Zeilen 300–319 von `calculation.service.ts` auf den Stand von cbbaafa zurücksetzen, also `heatingResult.share` auch bei `byDays`. Dann wird nur `service-period.pg.test.ts` «teilt die Heizkosten nach den Tagen des Leistungszeitraums in der Periode» rot. Alle Szenarien bleiben grün:
- Das #137-Szenario in `statement-detail.feature` hat eine Heizkostenrechnung ohne Leistungszeitraum. Dort sind die alte und die neue Rechnung gleich (48/92).
- «Eine Rechnung gilt für ihren Leistungszeitraum» in `statement-generate.feature:71` prüft nur eine Hauswart-Rechnung über ein ganzes Jahr.

**Was fehlt:** ein Szenario, `@api` reicht, z. B. in `statement-generate.feature` neben Z. 71. Inhalt: eine Heizkostenrechnung mit Leistungszeitraum Juli bis September in einer Periode Juni bis August mit einem Heizprofil, das in diesen Monaten 0 % hat, und Einzug im Juli. Erwartet wird der Betrag nach den Mietstagen im Leistungszeitraum. Dazu im Plan `Scenario red: <Betrag>`. Das Heizprofil «Winter» und die Periode aus dem Seed `statement` des #137-Szenarios lassen sich wiederverwenden.

## Bestätigt

- **C-1 (Runde 1) behoben:** `statement-pdf.pg.test.ts:104–123` erzeugt eine Sommerabrechnung (Juni bis August 2025, Mittelland, Einzug 1. Juli) über `generateStatement` → `generateStatementPdf`. Der Test prüft die Zeile mit «62/92 Tage», dass «Heizprofil» fehlt und dass der Hinweis nach Art. 8 VMWG steht. Ohne `if (byDays) return {}` in `heatingOf` (statement-pdf.service.ts:145) wäre `run.heating` gesetzt. Dann wäre `byProfile` wahr, `timeShare` zeigte Prozente und das Profil stünde im PDF: Der Test wird rot. Die Rot-Meldung steht im Plan. Die zusätzliche Rechnung (300 Franken, 15.07.2025) bleibt im Gebäude. Die übrigen Tests der Datei prüfen dazu keine Beträge: Die Prüfungen ab Z. 126 lesen das PDF aus `beforeAll`, die späteren Abrechnungen prüfen Datum, Frist und Zahlteil. Das ist dasselbe Muster wie beim Test darüber (Z. 86–102).
- **C-2 (Runde 1) behoben:** `const due` und der Rundungskommentar stehen wieder direkt vor «Rundung des Saldos im PDF» (statement-pdf-render.test.ts:76–79).
- **D-1 behoben, Rechnung nachvollzogen:** `service-period.pg.test.ts:82–116` legt eine Rechnung über 900 Franken an, Leistungszeitraum 01.07.–30.09.2024, Periode 01.06.–31.08.2024. Davon liegen 62 von 92 Tagen in der Periode: 606.52 Franken. Mieter ab 15.07. sind 48 von 62 Tagen, also 469.56 Franken und `periodShare` 0.7742. Das Gebäude hat eine einzige Wohnung (`createRental`), deshalb ist der Wohnungsanteil gleich der Summe. Rot laut Plan mit 316.45 Franken = 606.52 × 48/92, das passt zum Code auf cbbaafa.
- **Ganzjahresabrechnung unverändert:** `period.percentage` ist 100 > 0, also `byDays: false` (prorating.service.ts:238–239). Es bleibt `heatingResult.share` wie bisher.
- **Anteil nach Profil unverändert:** Jede Periode mit einem Profilanteil > 0 nimmt denselben Zweig wie bisher, auch wenn der Mieter in seinen Monaten 0 % hat (dann Anteil 0, wie bisher). Bei einer Heizrechnung mit Leistungszeitraum in einer Periode mit Heizmonaten bleibt es beim Profil (offen in #71, wie Regel 5 sagt).
- **Fehlendes Profil:** Früher galten `calculateProrationDays(Vertrag, Periode)`-Tage / Tage der Periode × Wohnungsanteil. Jetzt gilt `rentalShare` mit `contractOverlap`, das aus derselben Funktion stammt (`calculateApartmentProrating`). Ohne Leistungszeitraum ist das derselbe Bruch, denn `inPeriod` umfasst dann die ganze Periode (Kommentar `InvoiceGroup`, Z. 75). Gerundet wird beide Male einmal auf Rappen. Mit Leistungszeitraum folgt es jetzt Regel 5 wie eine Abrechnung ganz ohne `heatingProfileId`, die schon vorher `rentalShare` nahm. Den Fall «nicht gefunden, aber mit `byDays: true`» hat auch der PDF-Pfad: `heatingOf` liefert ohne Profil `{}`.
- **Heizrechnung ohne Leistungszeitraum bei `byDays`:** `rentalShare` = Mietstage / Tage der Periode, also dieselben 48/92 wie bisher (bestätigt durch das #137-Szenario und den neuen pg-Test im PDF, «62/92 Tage»). Eine Gruppe mit Summe 0 ergibt 0, wie bisher (0 × Anteil).
- **PDF passt zur Rechnung:** Bei einer Heizrechnung mit Leistungszeitraum in einer Sommerperiode zeigt `timeShare` den Prozentwert (77.42 %), wie bei jeder anderen Rechnung mit Leistungszeitraum. Das bestand schon vorher und ist D-2/D-3 in #208.
- **Regel 5** beschreibt den neuen Fall korrekt («dann wie jede andere Rechnung, mit ihrem Leistungszeitraum»).
- **Plan:** Die Zeilen der Runde 1 für code-reviewer und daten-pruefer folgen dem Format von Schritt 6. Die Testdateien unter «Files» sind nachgeführt. Die Personas sind begründet ausgelassen (Workflow-Review W-1).
- **Format und Umfang:** Alle vier geänderten Codedateien sind Prettier-sauber (`bunx prettier <f> | diff`). Keine fachfremden Änderungen, keine UI-Texte, keine API-Antwort geändert (`tests/contracts` nicht betroffen).

## Nicht bestätigt

- lint 0, check 0, deepcheck:audit still, fallow sauber, test:coverage (2432 passed), Backend-Tests (613 pass), type-check 0, E2E `statement-detail.feature` + `statement-generate.feature` (chromium + api, 54 passed): vom Aufrufer gemeldet, nicht neu ausgeführt. Die Backend-pg-Tests schreiben in die Test-Datenbank, E2E ist ausgeschlossen. Im Delta gibt es keine Frontend-Datei, die ein Vitest-Lauf prüfen könnte.
- Die im Plan genannten Rot-Meldungen (C-1: `byDays`-Rückgabe herausgenommen; D-1: 316.45 statt 469.56) habe ich nicht nachgestellt, nur am Code von cbbaafa plausibilisiert.
- Ob ein `heatingProfileId` überhaupt auf ein fehlendes Profil zeigen kann (Fremdschlüssel, Löschen eines eigenen Profils mit Abrechnungen): nicht geprüft. Für die Bewertung oben ist das unerheblich, weil das Verhalten dann der Abrechnung ohne Profil entspricht.
- Die Issues #208 und #209: nicht auf GitHub gelesen, nur die Verweise im Plan.
