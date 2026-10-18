# Code-Review #222, Runde 2 (Delta)

Gegenstand: Worktree `review-222-code2`, Commit `1c81c7e4`, Delta `git diff 4eff7e61 1c81c7e4` (15 Dateien). Anforderung: Issue #222, «Decided (product owner)». Nach dem Persona-Review und der Fachrunde 4 hat der Produktverantwortliche `invoices_upload_deducted` und `invoices_beleg_deducted` in allen vier Sprachen geändert.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-6 | Minor | implementation_plan.md:22 | Die Skills-Zeile steht jetzt im Plan, sagt aber selbst, dass `tdd` und `ponytail` nicht geladen wurden. CLAUDE.md (Design-Regeln «Process», Workflow 3) verlangt für jede UI-Änderung `Skills: tdd, ponytail, ponytail-review`, auch für eine Textänderung. C-1 ist damit dokumentiert, die Regel aber nicht eingehalten. Die Abweichung steht schon als W-3 im Workflow-Review. |
| C-7 | Minor | implementation_plan.md:28-29, :35 | Die Korrektur von Helga P-1 und Weber P-1 bringt neue Texte, die keine Persona gesehen hat. Nach Workflow 6 laufen dann die Personas noch einmal, deren Befund die Korrektur beantwortet: Helga und Dr. Weber, mit einer Aufgabe nur zu diesen zwei Hinweisen. Im Plan steht dafür kein Punkt, und der Punkt «Reviews» (:35) nennt sie nicht. |

Es gibt keine Blocker und keine Majors.

## Runde-1-Befunde

- **C-1:** Die Skills-Zeile steht in `implementation_plan.md:22`. Sie sagt aber, dass `tdd` und `ponytail` nicht geladen wurden, siehe C-6.
- **C-2: erledigt.** In `implementation_plan.md:21` steht ein offener Punkt für die Glossaränderung durch den Produktverantwortlichen: Variante A bei «Akontorechnung». Der Pull Request wird erst nach dieser Änderung gemergt.
- **C-3: erledigt.** Die Fachrunden-Befunde nennen jetzt ihre Issues: V-6 → #262, V-7/V-8 → #261, V-10 → #263 (`implementation_plan.md`, Zeilen der Runden 2 und 3).
- **C-4: erledigt.** Das Item nennt alle drei neuen Zeilen, und die geänderten Dateien sind aufgeführt (Zeile «Files:»).
- **C-5: erledigt.** In `docs/design/i18n-begriffe.md:39` grenzt die Zeile «Mahnung eines Rechnungsstellers» den Begriff jetzt mit Klammern ab: «(de l’émetteur de la facture)», «(dell’emittente della fattura)», «(from the invoice issuer)». Nach `:63` heisst der Rechnungssteller genauso. In der Zeile stehen nur U+2019 und Akzente, keine anderen Sonderzeichen.

## Bestätigt

- **Texte wie entschieden:** Ein Skript (`python3 -I`) hat die 8 Texte in `messages/{de,fr,it,en}.json` mit dem Issue-Text verglichen (`gh api repos/rudini/Dwello/issues/222`, jeweils die Zeilen `de:`/`fr:`/`it:`/`en:` unter beiden Hinweisen). Nach dem Ersetzen von U+00A0 durch ein Leerzeichen sind alle 8 identisch.
- **fr-Typografie:** In fr `invoices_upload_deducted` steht U+00A0 innen in beiden Guillemets: `« Supprimer la facture »` und `« Retirer le fichier »`. In fr `invoices_beleg_deducted` steht U+00A0 vor «:». Es gibt kein `« `, kein ` »` und kein ` :` mit einem gewöhnlichen Leerzeichen (i18n-begriffe.md:31). Die Apostrophe sind U+2019.
- **Knopfnamen:** Die Texte nennen die Knöpfe genau so, wie sie in `messages/*.json` heissen.
  - `invoices_delete`: de «Rechnung löschen» (`messages/de.json:781`), fr «Supprimer la facture», it «Eliminare la fattura», en «Delete invoice».
  - `invoices_upload_remove`: de «Datei entfernen» (`:836`), fr «Retirer le fichier», it «Rimuovere il file», en «Remove the file».
  - Beide Knöpfe gibt es dort, wohin der Text führt: «Rechnung löschen» auf der Rechnungsseite (`src/routes/invoices/[id]/+page.svelte:121`), «Datei entfernen» in der Zeile der Datei im Dialog (`src/routes/invoices/InvoiceUploadRow.svelte:83`). Die Anweisung «auf ihrer Seite» stimmt also.
- **Begriffe:** Abrechnungsperiode heisst période de décompte / periodo di conteggio / billing period, Leistungszeitraum heisst période de prestation / periodo di prestazione / service period (`i18n-begriffe.md:60,62`). Das stimmt mit V-12 aus der Fachrunde 4 (`222-fachreview-4.md:55-62`) überein. Die Sätze zum Entfernen folgen V-13. Wie gemeldet weicht nur die Pronomenform ab («retirez-les», «li rimuova», «remove them»), und so steht sie auch im Issue.
- **Szenarien:**
  - `tests/e2e/features/invoices.feature:108` und `:167` erwarten den neuen de-Text Wort für Wort.
  - Im Feature steht kein `@wip`, und die Steps sind unverändert.
  - Im Plan steht `Scenario red (chromium, persona fixes)` mit den Texten aus Runde 2.
- **Unit- und DOM-Tests:** `src/__tests__/invoice-upload.test.ts:47,59` und `invoice-pages.dom.test.ts:879` prüfen die neuen de-Texte. Im Plan steht `Test red` mit «received the round-2 ones».
- **Keine Reste:** In `src`, `tests`, `messages` und `backend/src` gibt es keinen Treffer mehr für «löschen oder entfernen» und «und ihr Betrag ist vom Total».
- **Umfang:**
  - Geändert sind nur die zwei Texte in vier Sprachen, die drei Tests, die sie festhalten, eine Zeile in `i18n-begriffe.md` (C-5), der Plan und die Review-Berichte.
  - Es gibt keinen neuen Bildschirm und keinen neuen Zustand, darum braucht es keine Einträge in `screens.json`, `accessibility.feature` oder `sprachen-bildschirme.feature`.
  - Kein Backend, kein Prompt, kein Vertrag ist betroffen.
- **Persona-Befunde:** Die neuen Texte beantworten Helga P-1 (`helga-222.md:12`, zwei getrennte Sätze, die sagen, wo man löscht) und Weber P-1 (`weber-222.md:12`, Leistungszeitraum nach der Abrechnungsperiode).

## Nicht bestätigt

- `bun run lint`, `bun run deepcheck:audit`, Vitest für `invoice-upload.test.ts` und `invoice-pages.dom.test.ts` (89 bestanden) und `bun run test:e2e:wip` (chromium, beide Szenarien, vor dem Entfernen von `@wip`): vom Aufrufer gemeldet. Den Vitest-Lauf habe ich nicht wiederholt, weil der Zugriff auf `node_modules` im Worktree durch eine Deny-Regel gesperrt ist (wie in Runde 1).
- Einen E2E-Lauf ohne `@wip` mit den endgültigen Texten habe ich nicht gesehen. Ebenso nicht die a11y- und Sprachbildschirme mit den längeren Texten, z.B. ob es bei 390 px seitliches Scrollen gibt. Der Aufrufer lässt sie vor dem Push laufen.
- Die Persona-Berichte (`helga-222.md`, `marco-222.md`, `weber-222.md`) und `222-fachreview-4.md` habe ich nur so weit gelesen, wie es für P-1, V-12, V-13 und die Triage im Plan nötig war. Ob alle übrigen Befunde in #268 stehen, habe ich nicht im Issue nachgeprüft.
- Die Glossaränderung durch den Produktverantwortlichen (`UBIQUITOUS_LANGUAGE.md`, Variante A und Leistungszeitraum) liegt nicht vor. Sie steht als offener Punkt im Plan (:21).
