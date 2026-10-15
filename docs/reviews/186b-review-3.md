# Code-Review #186 Slice B, Runde 3 (Delta)

Gegenstand: `a02b029..7947dad` ohne die Seite von `main` im Merge `12bc149`. Geprüft habe ich die Commits `07d4ad2`, `7125844` und `7947dad` im Worktree `review-186b-code3`. `git diff 12bc149 7947dad` umfasst diese Dateien: `README.md`, `docs/reviews/186b-review-2.md`, `implementation_plan.md`, `messages/fr.json`, `src/__tests__/categories-page.dom.test.ts`, `src/__tests__/categories.test.ts`, `src/__tests__/invoice-pages.dom.test.ts`, `tests/e2e/fixtures/backend.ts` und `docs/reviews/workflow-rules-review-issue-186.md`. Ich habe alle gelesen.

Ergebnis: M-6 bis M-9 sind behoben. M-10 ist bis auf einen Halbsatz behoben. Es gibt keinen offenen Blocker oder Major. Neu sind nur zwei Nits.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| M-11 | Nit | `src/__tests__/categories.test.ts:187-189` | Der alte Kommentar ««non è sicura» liest sich auch als …» (Z. 187) ist stehen geblieben. Die neue Zeile 188 wiederholt ihn erweitert. Z. 187 kann weg. |
| M-12 | Nit | `README.md:292`; `implementation_plan.md` (Zeile «code-reviewer round 2 slice 186B») | Für M-10 bleibt ein Rest aus dem Vorschlag zu H-22 offen: «bei mehreren Staaten alle nennen» steht nicht im README. Der Plan führt M-10 trotzdem als ganz behoben. Entweder einen Halbsatz ergänzen («… names it; several countries are all named») oder im Plan «teilweise» notieren. |

## Status der offenen Befunde aus Runde 2

| ID | Status | Beleg |
|----|--------|-------|
| M-6 (Major) | behoben | Jeder Text, den M-6 nennt, hat jetzt einen Test. Jede Erwartung fehlt in den Meldungen von `80c804a`; das habe ich mit `git show 80c804a:messages/<l>.json` Text für Text verglichen. Damit war jeder Test gegen den alten Text rot. **Hilfetext fr/it (H-26):** `categories-page.dom.test.ts:505-518` erwartet «l’assurance bâtiment et les impôts» und «assicurazione edificio e imposte». Alt war «l’assurance du bâtiment …» und «assicurazione dell’edificio …». **Administration it/en:** `:489-490`. Alt war «se il contratto di locazione lo prevede (art. 4 …)» bzw. «if the rental contract provides for it». **KI-Hinweise en (H-28):** `categories.test.ts:190-200`, en unsure und unavailable. Alt war «Choose yourself». **Titel fr/it/en (H-23):** `invoice-pages.dom.test.ts:204-217` prüft den Titel. Alt war «Droit suisse du bail», «Diritto svizzero di locazione», «Swiss tenancy law». Die Locale wird überall im `finally` zurückgesetzt. Ich habe die Tests erneut ausgeführt: grün. |
| M-7 (Minor) | behoben | `fr.json:777` «(art. 256, al. 1, 256b et 257a CO)». Der Test `invoice-pages.dom.test.ts` (fr, Zitierweise) war gegen den alten Text «art. 256 al. 1» rot. Bei it und en ändert sich die Zitierweise nicht; diese Zeilen prüfen nur den bestehenden Text. |
| M-8 (Nit) | behoben | `tests/e2e/fixtures/backend.ts:271`, `:300` rufen `predefinedCategory` (`:29-31`) auf. Die Suche ist gleich geblieben (`nameDE`, `categories?limit=100`), das Verhalten also auch. `:259` und `:265` suchen nach `name === 'Heating'`. Das ist eine andere Suche und gehört zu Recht nicht dazu. |
| M-9 (Nit) | behoben | `fr.json:1369` «L’IA n’en est pas certaine.». Der Test `categories.test.ts:192` war gegen «n’est pas sûre» rot. |
| M-10 (Nit) | grösstenteils behoben | `README.md:292` nennt jetzt «the country where the data is processed». In `:297` steht «data centers», also dieselbe Schreibweise wie in `:298`. Rest siehe M-12. |

## Weitere Prüfungen

- **`07d4ad2` (Workflow-Review, Plan):** Der Commit ändert nur Doku. Er fasst keine Regel, keinen Skill, kein Agent und keinen Hook an. Damit entspricht er Workflow 7 («Only write the review»). Der Dateiname `workflow-rules-review-issue-186.md` folgt der Vorgabe. Die Planzeile ist abgehakt.
- **Planzeile Runde 2:** Sie nennt die Tests und ihr Rot. Ich zähle 10 neue Testfälle, deren Erwartung vom alten Text abweicht: 4 in `categories-page`, 3 in `categories.test` (die it-Zeile gab es schon), 3 Titel in `invoice-pages`. Dazu kommt die fr-Zitierweise. Der Plan nennt «all 16». Die Zahl hängt davon ab, ob man Assertions oder Fälle zählt. Ob jeder Fall rot war, habe ich am Text belegt, nicht durch einen eigenen Lauf.
- **Ausserhalb des Auftrags:** Nichts. Alle Textänderungen stehen in Runde 2 (M-7, M-9). `de.json`, `it.json` und `en.json` hat das Delta nicht berührt. Die Formatierung beschränkt sich auf die eigenen Zeilen.
- **Keine neuen Bildschirme oder Zustände.** Das Delta enthält keinen UI-Code.

## Nicht bestätigt

- Von mir erneut ausgeführt und grün auf `7947dad`: `bunx vitest run src/__tests__/categories-page.dom.test.ts src/__tests__/categories.test.ts src/__tests__/invoice-pages.dom.test.ts src/__tests__/no-german-in-code.test.ts` (468 Tests).
- Das Rot der neuen Fälle habe ich nicht durch einen Lauf gegen `80c804a` gezeigt. Belegt ist es durch den Vergleich der erwarteten Wortlaute mit den alten Meldungen (siehe M-6). Die Läufe selbst sind «vom Aufrufer gemeldet».
- «Vom Aufrufer gemeldet», nicht erneut ausgeführt: `bun run lint` und `bun run check` auf `7947dad`; E2E chromium mit «Rechnung», «Kostenkategorien» und den Rechnungsbildschirmen (124) nach M-8; der volle E2E-Lauf chromium + api (723) auf `12bc149`; `deepcheck:audit` und `fallow audit` (über die Commit-Hooks).
- Die Seite von `main` im Merge `12bc149` habe ich wie beauftragt nicht geprüft.
- Ob die fr/it/en-Formulierungen fachlich richtig sind, habe ich nicht geprüft. Das ist Sache des `fach-reviewer`.
