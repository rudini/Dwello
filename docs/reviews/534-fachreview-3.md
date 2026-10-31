# Fachreview 534/968, Runde 2 (Schritt 5)

Gegenstand: `git diff 2b9d542 0db2cfb -- messages src/routes/documents src/routes/statements`, Worktree `/tmp/claude/review-534-fach3` bei `0db2cfb`; Vorbericht `docs/reviews/534-fachreview-2.md`.

Geschlossen: V-1, V-2, V-3, V-4

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-5 | Verwalter | Minor | `documents_print_now_new_pdf` (mein Wording aus Runde 1) nennt «Zahlungsfrist» auch beim neuen PDF einer Rückerstattung. `keepNewPdf` legt es für jede `redeliverable` Abrechnung an (`backend/src/services/statement-send.service.ts:162-166`), also auch für Rückerstattungen, und die Abrechnung zeigt dort «Rückerstattung bis» (wie V-4). Fix: ein Text, der für beide Fälle stimmt (Wording unten), keine eigene Variante nötig |

## Wording

| key | de | fr | it | en |
|---|---|---|---|---|
| documents_print_now_new_pdf (V-5) | Das neue PDF bleibt, wie es ist: Dwello ändert kein Datum darin. Drucken Sie es jetzt aus und schicken Sie es heute per Post. | Le nouveau PDF reste tel quel : Dwello n’y modifie aucune date. Imprimez-le maintenant et envoyez-le aujourd’hui par la poste. | Il nuovo PDF resta com’è: Dwello non vi modifica alcuna data. Lo stampi ora e lo spedisca oggi per posta. | The new PDF stays as it is: Dwello changes no date in it. Print it now and post it today. |

## Nicht bestätigt

- Keine neue Rechtsbehauptung im Delta, daher keine Fedlex-Abfrage. Die offenen Punkte aus Schritt 1 gelten unverändert.

Geprüft: V-1 – `+page.server.ts:26` setzt `newPdf` aus `sent.type === 'new_pdf'` (`type` ist in `summary`, `document.service.ts:34`; `markDocumentSent` gibt `getDocument` zurück), `MarkedSentNotice.svelte:17` zeigt für eine Mahnung weiter `documents_print_now`. Der Inhalt stimmt: `postNewPdf` verwendet `pdfBlob` und `paymentDeadline` der Abrechnung unverändert (`reminder.service.ts:185-197`). Alle vier Sprachen wörtlich wie in meiner Tabelle. V-2, V-3 (`statements_redelivered`, `documents_not_to_send_redelivered`, `backend_reminder_statement_redelivered`) und V-4 (`statements_new_pdf_mark_sent_text_refund`, Weiche über `statement.refund`, `src/lib/server/statement.ts:146`) sind in de/fr/it/en wörtlich übernommen. Die Verweise «Versendetes PDF herunterladen», «Télécharger le PDF envoyé», «Scaricare il PDF inviato» und «Download PDF sent» entsprechen `statements_history_sent_pdf`. Der Link zeigt auf das zuletzt versendete PDF (`MetadataCard.svelte:59`). Der neue Text `statements_new_pdf_marked_sent` ist in allen vier Sprachen fachlich richtig und konsistent mit «Dwello hält fest» aus dem Dialog davor, der das Drucken schon verlangt.
