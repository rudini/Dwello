# Code-Review 534/968, Runde 3

Worktree `/tmp/claude/review-534-code3` bei `0db2cfb`, Delta `2b9d542..0db2cfb` ohne `docs/reviews` und `docs/design/personas`. Vorheriger Bericht: `docs/reviews/534-review-2.md`.

Geschlossen: C-3, C-15, C-16, C-12

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-18 | Minor | `src/routes/documents/+page.svelte:77`, `src/routes/documents/MarkSentButton.svelte:27` | Jeder `MarkSentButton` bekommt dasselbe `form?.actionError` der Seite. Nach einer Abweisung schliesst der Liegenschaftsverwalter den Dialog und öffnet die Bestätigung eines anderen Briefs. Dort steht dann sofort die Abweisung des ersten Briefs, noch bevor er bestätigt hat. Die Meldung bleibt bis zur nächsten Action stehen. `failure` lädt die Liste nicht neu |
| C-19 | Minor | `src/routes/documents/+page.server.ts:25` | Der neue Zweig `newPdf: sent.type === 'new_pdf'` ist nur mit `false` getestet (`documents.test.ts:55`). Der DOM-Test setzt `newPdf: true` direkt. Kein Test und kein Szenario markiert unter «Dokumente» ein neues PDF als versendet. Würde der Vergleich nie zutreffen, bliebe alles grün, und der Hinweis nach V-1 erschiene nie |
| C-20 | Minor | `src/routes/statements/[id]/NewPdfToSend.svelte:21-30` | Drei geänderte Zeilen ohne Test: (a) die Rückerstattungs-Variante `statements_new_pdf_mark_sent_text_refund` (V-4), (b) der neue Toast `statements_new_pdf_marked_sent` nach dem Erfolg, (c) dass der Dialog nach einer Abweisung schliesst und die Meldung der Seite (`+page.svelte:221`) sichtbar wird (C-15, Detailseite). Der Test in `statement-pages.dom.test.ts:1932` prüft nur den Text ohne Rückerstattung und das Formular |
| C-11 | Minor | `tests/e2e/tasks/statement-detail.ts:108-109`, `tests/e2e/tasks/documents.ts:12-13` | Unverändert offen. Vom Aufrufer bewusst gelassen: Ein Warten auf den Hinweis bricht die Szenarien mit Abweisung |
| C-17 | Minor | wie in Runde 2 | Unverändert, kein Test im Delta |
| C-8 | Minor | `backend/src/services/delivery.ts:27` | Unverändert |
| C-9 | Minor | wie in Runde 2 | Unverändert |
| C-10 | Minor | `statement-detail.feature:1261`, `statement-redeliver.feature:51` | Unverändert |
| C-14 | Minor | `tests/contracts/statement.json:59` | Unverändert |

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - lint, check, Backend type-check, fitness
  - `bunx vitest run --changed origin/main` (3850)
  - Backend-pg-Tests statement-mail, reminders, api-contracts (164)
  - E2E chromium statement-reminder, documents, statement-detail, statement-redeliver (140)
  - axe-/Sprach-Zeilen von statement-sent-detail und documents (26)
  - dass die neuen DOM-Tests zu V-1 und C-15 vor ihrem Fix rot waren
  - dass der C-3-pg-Test ohne `sinceDelivery` rot war
- Nach Lesen plausibel, aber nicht ausgeführt:
  - Der erweiterte Test `statement-mail.pg.test.ts:387-390` schlägt ohne `sinceDelivery` fehl, weil `remindersCounted` jetzt die einzige Quelle der Mahnstufe ist.
  - Der geänderte Test `documents.dom.test.ts:117` findet `form-error` nur im geöffneten Dialog. Die Meldung auf der Seite ist entfernt.
- Ob ein E2E-Schritt die geänderten Texte (`statements_redelivered`, `documents_not_to_send_redelivered`, `backend_reminder_statement_redelivered`) wörtlich prüft: Ich habe in `tests/e2e` und `src/__tests__` per grep keinen Treffer auf den alten Wortlaut gefunden. Der Aufrufer meldet die Läufe von statement-redeliver und statement-reminder als grün.

Geprüft:
- C-3: `nextLevel` liest `statement.remindersCounted`. Das ist `count(*)::int`, also eine Zahl und kein String. Es kommt aus `getStatement` über `statementColumns`. `countReminders` ist samt Import von `count` entfernt.
- C-15 «Dokumente»: `failure` lädt die Seite nicht neu, deshalb bleibt der Dialog mit `error` offen. `ActionDialog` legt den Fokus auf die Meldung.
- C-15 Detailseite: `FormDialog` schliesst nach jeder Antwort, die Meldung `form.actionError` steht auf der Seite.
- C-16, C-12: Verträge und API-Spezifikation sind ergänzt.
- V-1 bis V-4: Die neuen und geänderten Texte stehen in allen vier `messages/*.json`. «Versendetes PDF herunterladen» gibt es als `statements_history_sent_pdf`.
- `mark-sent-dialog` steht in `seedFor`.
