# Slice-Review «oldaddr» (#114), Runde 2

Worktree: `review-oldaddr-code-2`, Commit `a454fa4`, Bereich `git diff 04c3b05 a454fa4`. Alle 20 Dateien gelesen, die Persona- und Fachberichte nur auf P-1, P-2, V-11, V-12 und V-14 hin.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-9 | Major | `backend/src/services/statement-pdf.service.ts:300-308`, `backend/src/services/statement.service.ts:425-433` | Der Fix behebt P-1 und P-2 nur beim Herunterladen eines Entwurfs. Wird ein Entwurf am selben Tag versendet, an dem sein PDF entstand, bleibt das gespeicherte PDF mit der alten Adresse oder IBAN. Danach liefert `getStatementPdf` es als versendetes PDF aus. Das ist der zweite Teil von Anna P-1: «Auch nach «Als versendet markieren» ist das PDF unverändert» |
| C-10 | Major | `tests/e2e/features/statement-detail.feature` | Für den Fix, den der Benutzer sieht (das PDF eines Entwurfs zeigt die geänderte Korrespondenzadresse bzw. IBAN), gibt es kein Szenario und keinen `No scenario: <reason>`. Die Diff ergänzt nur den Dialogschritt von C-1 |
| C-11 | Minor | `docs/api-specification.md:225` | Dort steht noch «made first when missing or (a draft) dated another day». Neu wird das PDF eines Entwurfs bei jeder Anfrage neu erstellt, das gilt auch für `/:id/pdf/base64` |
| C-12 | Minor | `tests/e2e/features/statement-detail.feature:233`, `tests/e2e/steps/statement-detail.steps.ts:127` | «nennt die Bestätigung die Postadresse»: «Postadresse» steht nicht in `UBIQUITOUS_LANGUAGE.md`. Der Begriff dort ist «Korrespondenzadresse» (Z. 24) |
| C-13 | Nit | `backend/src/services/statement-pdf.service.ts:289` | ponytail `delete:`: `storedPdf` liest weiter `statementDate`, das nur die entfernte `stale`-Prüfung gebraucht hat |
| C-14 | Nit | `src/__tests__/contract-edit.dom.test.ts:151` | Der Kommentar «das Feld heisst im Mieterformular «Adresse»» ist veraltet. Die Prüfung darunter verlangt jetzt «Korrespondenzadresse» |
| C-15 | Nit | `messages/fr.json:634,636`, `messages/it.json:634,636` | In `contracts_parties_fixed_by_law` und `contracts_end_death` bleibt «chez le locataire» bzw. «presso l’inquilino», also die Wendung, die V-12 in den Nächsten Schritten ersetzt hat. Mit «sous « Adresse de correspondance »» ist der Satz verständlich, aber nicht einheitlich |

ponytail-review: Der Fix ist schlank (eine Bedingung statt zwei). Zu kürzen ist nur C-13. Die Maske in `language.ts` ist jetzt enger und kürzer. `countryNames` enthält mit dem Wegfall von `filter(Boolean)` auch `''`. Das ist harmlos, weil ein leerer Text ohnehin kein deutsches Wort enthält. net: -1 line possible.

## C-9 (Major): Ein am selben Tag versendeter Entwurf behält das alte PDF

**Warum falsch:** `getStatementPdf` erstellt das PDF nur neu, solange die Abrechnung ein Entwurf ist. Beim Versand verwirft `updateStatement` das gespeicherte PDF nur, wenn sich `statementDate` oder `paymentDeadline` ändern (`pdfOutdated`, `statement.service.ts:425-428`). `generateStatementPdf` datiert einen Entwurf aber schon auf heute (`datedToday`). Wird am selben Tag versendet, liefert `datedToday` deshalb dieselben Werte, und `pdfBlob` bleibt stehen. Ab dann gilt `status !== 'draft'`, und `getStatementPdf` gibt das gespeicherte PDF zurück. So wird ein PDF zum versendeten PDF, das vor der Änderung der Adresse oder IBAN entstand. Das ist genau Annas Weg in P-1 (Blocker): PDF angesehen, neue Adresse eingetragen, «Als versendet markieren», danach im PDF immer noch die alte Adresse. Bei Helga P-2 ist es ebenso: Der Mieter würde auf das alte Konto einzahlen. Der Docstring verspricht «The PDF the tenant gets»: Den Versand deckt der Fix nicht ab.

**So zeigt man es:** In `statement-pdf.pg.test.ts` nach dem Muster der neuen Tests: `generateStatementPdf(id, 'de')`, dann per `PUT /api/v1/tenants/:id` eine neue Adresse setzen, dann `updateStatementStatus(id, 'sent')` und `getStatementPdf(id)`. Das PDF enthält noch die alte Strasse («Testgasse 5»). Im E2E-Stack: PDF erstellen, Korrespondenzadresse ändern, als versendet markieren, PDF herunterladen.

**Behebung (Vorschlag):** Beim Übergang `draft → sent` das gespeicherte PDF immer verwerfen. Dann entsteht es beim ersten Abruf mit den aktuellen Daten und den Daten des Versandtags. Dazu einen Test wie oben, der vorher rot ist.

## C-10 (Major): Kein Szenario für das neu erstellte PDF eines Entwurfs

**Warum falsch:** `CLAUDE.md`, Workflow Schritt 1, und die Pflichtliste verlangen für jede Verhaltensänderung ein Szenario in `tests/e2e/features`, auch für einen Fix, den der Benutzer sieht. P-1 und P-2 sind solche Fixe: Der Liegenschaftsverwalter lädt das PDF herunter und sieht eine andere Adresse bzw. IBAN als vorher. Die Diff enthält dazu nur die zwei pg-Tests. In der Diff steht weder ein Szenario noch ein `No scenario: <reason>`, und auch die Commit-Nachricht nennt keines. Der E2E-Stack kann den Zustand erzeugen, die Bausteine gibt es schon: «die Korrespondenzadresse von … ist …» bzw. das Bearbeiten des Mieters, «das PDF der Abrechnung erstellt», «herunterlädt», «steht im PDF», «die Verwaltung hat die IBAN … hinterlegt».

**So zeigt man es:** `grep -n "PDF" tests/e2e/features/*.feature` findet kein Szenario, das das PDF erstellt, danach die Adresse oder IBAN ändert und das PDF erneut prüft. Nimmt man in `getStatementPdf` `|| result.status === 'draft'` wieder heraus, bleibt jede E2E-Prüfung grün.

**Behebung:** Ein Szenario in `statement-detail.feature`, z. B. «PDF eines Entwurfs nach dem Eintragen der neuen Adresse»: PDF erstellen, neue Korrespondenzadresse eintragen, PDF herunterladen, dann steht im PDF die neue Adresse. Sinnvoll ist auch der Versandschritt aus C-9.

## Runde-1-Befunde, abgeglichen

- **C-1 (Major), behoben:** Das Szenario «Abrechnung an eine Korrespondenzadresse im Ausland» öffnet jetzt den Dialog und prüft `recipient` auf «Marktstätte 3, 78462 Konstanz, Deutschland». Ohne die Länderzeile in `tenantAddress()` endet der Text bei «78462 Konstanz», `toContain` wäre also rot. Der Schritt ruft nur eine Question auf. Zum Wortlaut: C-12.
- **C-3, behoben:** `contract-detail-page.dom.test.ts:278-296` prüft mit `ended: true` den Text `contracts_next_steps_address` und als einzigen Link «Neue Adresse eintragen». Ohne den Zweig wären «Neuen Mietvertrag … erfassen» bzw. der alte Text da, der Test also rot. Die übrigen Aufrufe übergeben jetzt `ended: false`.
- **C-4, behoben:** `language.ts` überspringt nur Texte, die genau ein Ländername sind (`countries.has(text.trim())`). Ländernamen innerhalb längerer Texte werden nicht mehr maskiert. `fixtures/screens.ts` legt keine Adresse im Ausland an. Die Bildschirme mit Länderauswahl hat der Aufrufer neu laufen lassen («tenant-new|tenant-edit»).
- **C-5 / V-12, behoben:** fr «dans la fiche du locataire», it «nella scheda dell’inquilino», en «in the tenant’s details», je dreimal in `contracts_next_steps_text`, `…_successor` und `…_address`. Das ist der Wortlaut aus V-12. Rest: C-15.
- **C-6, behoben:** Der Test setzt die Adresse des Gebäudes jetzt selbst und prüft zuerst `true`. Allein und ohne die Regel ist er rot.
- **C-2, C-7, C-8:** Die Begründungen der Ablehnung halten. C-2 ist eine Frage der Commit-Struktur ohne Defekt, C-7 ein Nit, und C-8 gab es schon vor dieser Änderung.

## Neu in der Diff, abgeglichen

- **P-1/P-2 (Download eines Entwurfs):** `getStatementPdf` erstellt jedes PDF eines Entwurfs neu. Die zwei neuen pg-Tests (neue Adresse über die echte API, neue IBAN über `setConfig`) wären ohne den Fix rot. `generateStatementPdf` datiert den Entwurf auf heute, `stale` war also falsch, und es kam das alte PDF. Die Tests ändern die Daten des gemeinsamen Datensatzes, stehen aber im letzten `describe`. Die IBAN stellt `afterAll` zurück (`iban` steht in `company`). Kein Aufrufer im Frontend schickt eine Sprache an `generate-pdf` (`+page.svelte:79`, `fixtures/backend.ts:268`). Dass ein Entwurf jetzt in der Sprache des Mieters neu erstellt wird, verliert also keine gewählte Sprache. Lücken: C-9, C-10, C-11.
- **V-11:** Alle vier Sprachen nennen in `contracts_end_death` und `contracts_parties_fixed_by_law` jetzt die Beschriftung des Feldes (`tenants_correspondence_address`: «Korrespondenzadresse», «Adresse de correspondance», «Indirizzo di corrispondenza», «Correspondence address»). Geprüft wird das in `contract-detail-page.dom.test.ts:206`, `contract-edit.dom.test.ts:153` und `contract-form.steps.ts:367`. Mit dem alten Text sind alle drei rot. Die zwei DOM-Dateien habe ich neu laufen lassen.
- **V-14:** `docs/anforderungen-vertragsende.md`: Das Akzeptanzkriterium sagt jetzt «Korrespondenzadresse», und die «Offenen Fragen» verweisen auf den Entscheid in #114. Das passt zur Umsetzung (Strasse und PLZ, kein neues Feld).
- **`implementation_plan.md`, `docs/reviews/*`, Persona-Berichte:** Das sind nur Doku- und Plan-Einträge, sie ändern kein Verhalten. Der Plan führt die Runde 2 als offen und `daten-pruefer` als ausstehend.
- **Sicherheit:** keine neue Route, keine neue Eingabe. Das PDF bekommt nur Daten, die es schon hatte, jetzt aktuell.
- **E2E-Schichten:** Der neue Schritt ruft nur `verwalter.sees(recipient)` auf, keine Locators.

## Nicht bestätigt

- Selbst ausgeführt: `bunx vitest run src/__tests__/contract-detail-page.dom.test.ts src/__tests__/contract-edit.dom.test.ts`, 2 Dateien, 85 Tests bestanden.
- Vom Aufrufer gemeldet: Backend `bun test` (748) mit den zwei neuen Tests in `statement-pdf.pg.test.ts` und dem geänderten `old-address.pg.test.ts`, Backend `bun run type-check`, das ganze `bunx vitest run` (2722), `bun run lint`, `bun run check`, E2E chromium für statement-detail, contract-detail, contract-edit und tenant-edit (97) sowie die Sprachzeilen «contract» (29) und «tenant-new|tenant-edit» (4). Backend und E2E habe ich nicht laufen lassen: Das Backend schreibt in die Testdatenbank, und E2E darf ich nicht starten.
- C-9 habe ich nur aus dem Code geschlossen (`statement.service.ts:425-433, 486-497`, `statement-pdf.service.ts:247-308`), nicht mit einem laufenden Test gezeigt.
- Dass die engere Sprachprüfung (C-4) auf den anderen Bildschirmen weiter grün ist, vor allem `statement-old-address-detail/send-dialog` und den Bildschirmen der Mieter mit `TenantContactCard`, habe ich nicht gemessen. Gemeldet sind nur die Zeilen «contract» und «tenant-new|tenant-edit».
- Die Übersetzungen von V-11 und V-12 hat niemand muttersprachlich geprüft (wie im Fachbericht vermerkt).
