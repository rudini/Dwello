# Fachreview #969, Schritt 1, Runde 1 (Commit 73cb6ea)

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Unter «Dokumente» zeigt Dwello die Kopie als «per Brief» und «Versendet». Genau das ist laut Entscheid nicht bekannt. |
| V-2 | Verwalter | Major | Im Verlauf steht das PDF nach der Änderung als «PDF erstellt» vor «Versendet». Daneben käme die Kopie als zweite PDF-Zeile. Der Verlauf schreibt damit die Geschichte um, statt nur zu wachsen. |
| V-3 | Verwalter | Major | Zwei weitere Wege verwerfen das einzige PDF ohne Kopie: «Erneut per Brief zustellen» und «Zahlung zurücksetzen». |
| V-4 | Verwalter | Major | Zur Frage «nur einmal?»: Nur die erste Kopie abzulegen verliert ein PDF, das der Mieter womöglich erhalten hat. Dwello soll jede verworfene Kopie ablegen. |
| V-5 | Verwalter | Minor | Das Szenario prüft nur, dass der Link sichtbar ist (statement-detail.feature:1262). Es prüft weder die Zeile im Verlauf mit Datum noch das Dokument ohne Versandstatus. Fix: `Dann nennt der Verlauf "PDF vor der Änderung" am heutigen Tag` (bzw. die Zeile nach V-2) und eine Zeile unter «Dokumente» ohne Versandstatus. |
| V-6 | Verwalter | Minor | Der Hinweis nach der Änderung sagt bei einer Abrechnung ohne versendetes PDF nicht, wo das alte PDF liegt: `+page.svelte:215` zeigt den Satz nur mit `data.delivery`. Fix: im else-Zweig `statements_pdf_before_change_in_history` (Texte unten). |
| V-7 | Verwalter | Minor | Der Export der Mieterdaten übergeht die Kopie (`tenant-export.service.ts:82,97`: `mailed.get(id) ?? pdfBlob`). Nach der Änderung fehlt dort das alte PDF, obwohl Dwello es aufbewahrt. Fix: Dokument `statement` ?? erste Kopie `pdf_before_change` ?? `pdfBlob`. |
| V-8 | Verwalter | Minor | Der pg-Test (statement-carry-over.pg.test.ts:446) legt Titel, `channel: null` und `tenantId` nicht fest. Der Titel ist ein gespeicherter Fachtext. Fix: im `toMatchObject` ergänzen, Titel in der Sprache des Mieters. |

## V-1 (Major): Kopie erscheint als «per Brief, Versendet»

Belege:
- `src/lib/document-status.ts:20`: Ein Dokument, das nicht «Zu versenden» ist, bekommt immer `statements_status_sent()` («Versendet», Ton positiv).
- `src/routes/tenants/[id]/TenantDocumentRow.svelte:15-17,25-29`: Jede Zeile, die kein Upload ist, zeigt den Kanal. Bei `channel` null ist das «per Brief». Dazu kommt der Versandstatus.
- `src/routes/documents/DocumentItem.svelte:21-33,52-56`: dasselbe mit Badge.

Die Kopie mit `channel: null, status: null` hiesse also «…, per Brief · Versendet». Der Plan sagt dazu nur «probably as a plain document». Ohne Änderung im UI ist es aber ein versendeter Brief. Der Entscheid sagt das Gegenteil: Ob das PDF versendet wurde, ist nicht bekannt. In einem Streit legt der Vermieter dann ein PDF als «Versendet» vor, das nach dem Versand entstanden sein kann.

Fix: Den Typ `pdf_before_change` im UI wie einen Upload behandeln, also ohne Kanal und ohne Versandstatus. Die Zeile lautet «Erstellt am {date}» (Keys unten). Löschen soll nicht möglich sein. Das ist heute schon so, weil `deleteDocument` nur `upload` löscht. Dazu eine Zeile im Szenario (V-5).

## V-2 (Major): Verlauf vor und nach der Änderung

Belege: In `MetadataCard.svelte:69-71` ist `firstPdfAt` ohne `delivery` gleich `pdfGeneratedAt`. In `:66` braucht `newPdf` den Wert `lastSent`, der ohne Dokument des Versands null ist.

Ablauf: Vor der Änderung zeigt der Verlauf «Erstellt», «PDF erstellt 03.02.2025 09:00» und «Versendet». Nach der Änderung verschwindet «PDF erstellt». Holt der Vermieter das neue PDF, steht «PDF erstellt 31.10.2026» wieder vor «Versendet», als wäre es das versendete. Fügt der Plan noch eine eigene Zeile «PDF vor der Änderung» hinzu, nennt der Verlauf zwei PDFs, und das falsche steht an der Stelle des ersten. Das zeigt schon der Basis-Commit. #969 macht es aber widersprüchlich. Es verletzt auch die Regel von #968 «der Verlauf wächst nur» (statement-detail.feature:1292).

Zur Frage nach der Reihenfolge: Die Zeilen sollen bleiben, wie sie vor jeder Änderung standen. Die Kopien kommen als Links dazu.
- «PDF erstellt» behält bei einer Abrechnung mit Kopie das Datum der ersten Kopie (`createdAt` = früheres `pdfGeneratedAt`), an seiner bisherigen Stelle.
- Jede weitere Kopie war ein neues PDF nach einer Änderung (Glossar «neues PDF», UBIQUITOUS_LANGUAGE.md:172). Sie bekommt die Zeile «Neues PDF erstellt» an ihrem `createdAt`, nach «Versendet».
- Das aktuelle PDF, wenn eines erstellt wurde, ist ebenfalls «Neues PDF erstellt» (`newPdf`: `pdfGeneratedAt` später als die letzte Kopie, wenn `lastSent` fehlt).
- Unter den Zeilen folgt je Kopie der Link «PDF vor der Änderung herunterladen» (testid `statement-history-pdf-before-change`). Bei mehreren Kopien nennt jeder Link sichtbar sein Datum. Darunter steht der Hilfesatz (Texte unten). Der Verlauf nennt das PDF damit über den Link mit seinem Namen. Eine eigene Zeile «PDF vor der Änderung» braucht es nicht.

Will der Product Owner trotzdem eine eigene Zeile, dann gehört sie an die Stelle von «PDF erstellt» und ersetzt diese Zeile. Das aktuelle PDF muss auch dann «Neues PDF erstellt» heissen.

## V-3 (Major): Weitere Wege verwerfen das einzige PDF

Der Entscheid gilt für jedes Verwerfen eines PDF einer Abrechnung, die kein Entwurf ist: «before discarding the PDF of a non-draft statement that has no statement Dokument». Der Plan deckt nur `changesPdf` ab.

- `backend/src/services/statement-send.service.ts:138`: `redeliverByLetter` setzt `pdfBlob: null` und erstellt das PDF neu. `before` (:135) dient nur zum Zurückrollen bei einem Fehler. `redeliverable` (statement.service.ts:370) gilt für jede versendete Abrechnung, also auch für eine ohne Dokument des Versands. Danach ist das alte PDF weg.
- `backend/src/services/statement.service.ts:815`: `resetPayment` übergibt `pdfBlob: null` als `data` an `updateStatement`. Dort ist `changesPdf` false, und der geplante Haken greift nicht.

Fix: Die Ablage in `updateStatement` auslösen, sobald eine Abrechnung, die kein Entwurf ist, ihr PDF verliert, also `pdfOutdated || data.pdfBlob === null`. In `redeliverByLetter` die Kopie vor Zeile 138 ablegen. Je Weg ein pg-Test. Ein Entwurf bleibt aussen vor: `updateStatementStatus` von `draft` nach `sent` hat `existing.status === 'draft'`, das ist richtig.

## V-4 (Major): Jede verworfene Kopie ablegen, nicht nur die erste

Empfehlung: Dwello legt jedes verworfene PDF ab, solange die Abrechnung kein Dokument `statement` hat.

Grund: Bei diesen Abrechnungen legt `keepNewPdf` kein neues PDF «Zu versenden» an (`statement-send.service.ts:157-160`, Test `statement-mail.pg.test.ts:428`). Der Hinweis nach der Änderung rät aber «senden Sie ihm das neue PDF» (`statements_sent_pdf_changed_notes`). Das zweite PDF kann also ebenso beim Mieter liegen wie das erste, ohne dass Dwello es weiss. Nur die erste Kopie zu behalten wiederholt genau den Verlust, den #969 beheben soll.

Doppelte Kopien entstehen nicht: Eine Änderung ohne neu erstelltes PDF findet `pdfBlob` null und legt nichts ab. Der geplante Code tut das von selbst, denn eine Kopie ist kein Dokument `statement`. Es braucht also keine Bedingung «nur einmal». Fix: ein pg-Test mit Änderung, neuem PDF und zweiter Änderung, der zwei Kopien mit ihren `createdAt` erwartet. In der UI dazu die Links mit Datum (V-2).

## Texte

| key | de | fr | it | en |
|---|---|---|---|---|
| `pdfBeforeChangeTitle` (backend, `reminder-letter.ts` WORDING, Sprache des Mieters) | Nebenkostenabrechnung, PDF vor der Änderung | Décompte des charges, PDF avant la modification | Conteggio spese accessorie, PDF prima della modifica | Utility cost statement, PDF before the change |
| `statements_history_pdf_before_change` (Name, falls doch als eigene Zeile, V-2) | PDF vor der Änderung | PDF avant la modification | PDF prima della modifica | PDF before the change |
| `statements_history_pdf_before_change_download` | PDF vor der Änderung herunterladen | Télécharger le PDF avant la modification | Scaricare il PDF prima della modifica | Download PDF before the change |
| `statements_history_pdf_before_change_download_on` (mehrere Kopien) | PDF vor der Änderung vom {date} herunterladen | Télécharger le PDF avant la modification du {date} | Scaricare il PDF prima della modifica del {date} | Download PDF before the change, created on {date} |
| `statements_history_pdf_before_change_hint` | Ob der Mieter genau dieses PDF erhalten hat, weiss Dwello nicht. Es kann nach dem Versand erstellt worden sein. | Dwello ne sait pas si le locataire a reçu exactement ce PDF. Il a pu être créé après l’envoi. | Dwello non sa se l’inquilino ha ricevuto esattamente questo PDF. Può essere stato creato dopo l’invio. | Dwello does not know whether the tenant received exactly this PDF. It may have been created after the statement was sent. |
| `statements_pdf_before_change_in_history` (V-6) | Das PDF vor der Änderung finden Sie im Verlauf. | Vous trouverez le PDF avant la modification dans l’historique. | Trova il PDF prima della modifica nella cronologia. | You will find the PDF before the change in the history. |
| `documents_pdf_before_change_made` (V-1) | Erstellt am {date} | Créé le {date} | Creato il {date} | Created on {date} |
| `documents_pdf_before_change_made_to` (V-1, Übersicht «Dokumente») | Zu {name}, erstellt am {date} | Pour {name}, créé le {date} | Per {name}, creato il {date} | For {name}, created on {date} |

Kein Text enthält Guillemets, Doppelpunkt, Semikolon, Frage- oder Ausrufezeichen. Ein geschütztes Leerzeichen im Französischen braucht es daher nicht. Die Begriffe folgen i18n-begriffe.md:74 (Änderung = modification / modifica / change), :161 (PDF envoyé / nouveau PDF) und `statements_history` (Historique / Cronologia / History).

## Fehlende Begriffe (Issue mit `domain`, `needs-decision`)

- Neue Zeile in UBIQUITOUS_LANGUAGE.md: **PDF vor der Änderung**. Das gespeicherte PDF einer Abrechnung ohne versendetes PDF (versendet vor #449 oder über den Status), das Dwello als Dokument ablegt, bevor eine Änderung der Zahlungsfrist oder der Bemerkung, ein erneutes Zustellen oder ein Zurücksetzen der Zahlung es verwirft. Es trägt den Zeitpunkt seiner Erstellung. Ob der Mieter genau dieses PDF erhalten hat, ist nicht bekannt. Es ist kein Versand, hat keinen Versandstatus und zählt für Mahnungen nicht. Der Verlauf bietet jedes an (#969). Code: Dokument `type = 'pdf_before_change'`.
- Die Zeile **Dokument** (UBIQUITOUS_LANGUAGE.md:227) ergänzen um «…, oder ein PDF vor der Änderung einer Abrechnung». Die heutige Definition (Brief, E-Mail oder Upload) deckt die Kopie nicht ab.

## Nicht bestätigt

- `toldDeadline` (#966): Es gibt die Funktion in 73cb6ea nicht (`grep -rn toldDeadline backend/src` ist leer). Dass sie nur `statement`/`new_pdf` zählt, liess sich daher nicht prüfen. Bestätigt sind `sinceDelivery` und `sendingsOf` (`delivery.ts:12-24`), `keepNewPdf` (`statement-send.service.ts:157-160`) und die Mahnzählung (`statement.service.ts:66-84`, nur `reminder`).
- `POST /statements/:id/generate-pdf` (`routes/statements.ts:458`) überschreibt das gespeicherte PDF einer Abrechnung, die kein Entwurf ist, ohne es zu verwerfen. Die UI bietet den Knopf nur ohne PDF an (`PdfAction.svelte:29`). Andere Aufrufer habe ich nicht gesucht.
- Ob das «Where» des Issues (`backend/src/db/demo-data.ts`) Demodaten mit Kopie verlangt: nicht im Issue-Text entschieden, nicht geprüft.
- Mietrecht: keine Regel aus OR/VMWG betroffen. Die Kopie geht nicht an den Mieter, und Dwello behauptet mit dem Hilfesatz keinen Zugang. Fedlex habe ich nicht abgefragt, weil kein Befund eine Rechtsaussage braucht.

Geprüft: Szenario-Ablauf mit Versand über den Status-Weg (`backend.ts:391`, danach `changeStatementStatus` mit PDF, `statement-pdf.service.ts:385-391`), Entwurf ausgenommen, Anonymisieren löscht die Kopie mit (`tenant-anonymise.service.ts:41`), Kopie nicht löschbar (`document.service.ts:168-176`), ohne Knopf «Als versendet markieren» (`MarkSentButton.svelte:13`).
