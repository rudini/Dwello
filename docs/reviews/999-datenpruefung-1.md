# Datenprüfung #999, Runde 1

Gegenstand: Zahlung (Teilzahlung) zurücksetzen und Verlauf der Zahlungen. Worktree `/tmp/scratchpad/review-999-daten-pruefer` (c7e729a), Diff gegen 94db423. Datenbank `dwello_persona`, Frontend :3300, Backend :3301. Es wurde nichts geändert: Die Bestätigung wurde nur geöffnet und mit Escape geschlossen; danach waren `payments`, `payment_resets` und `audit_log` (1 Eintrag) unverändert. Skripte: `/tmp/scratchpad/dp999/` (`recompute.py`, `p1-p4.mjs`).

## Befunde

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|----|---------|-----------|----------|-------------|
| D-1 | Major | Jede Abrechnung mit Teilzahlungen, deren PDF nach dem ersten Zurücksetzen erstellt wurde (Code-Pfad `resetPayment`; am Demo-Datensatz nicht ausgelöst) | Wird die letzte verbleibende Teilzahlung zurückgesetzt, fällt das PDF weg, das sie nennt («Bereits bezahlt CHF 100.00», QR-Betrag = Rest CHF 115.80), und wird neu erstellt: offen sind dann CHF 215.80 | Das PDF bleibt gespeichert und versendbar: Es nennt die zurückgesetzte Zahlung, der QR-Betrag ist zu tief. Grund: `resetPayment` setzt beim ersten Zurücksetzen `paymentRecordedAt: null`, obwohl Teilzahlungen bleiben |
| D-2 | Minor | NK-11111111-2025-0001, Verlauf | Die Zeilen folgen der Reihenfolge der Ereignisse: 100.00, Zurücksetzen 50.00, 60.00 (Protokoll und `paymentRecordedAt` belegen: Zurücksetzen 18:56:11 vor der Zahlung 18:56:27) | Zahlungszeilen stehen immer vor den Zeilen des Zurücksetzens: 100.00, 60.00, Zurücksetzen 50.00. Alle Beträge und Daten stimmen, nur die Folge nicht (Persona P-1) |

### D-1: Beleg und Reproduktion

Code (`backend/src/services/statement.service.ts`, `resetPayment`, Zeilen 861-875):

```
const paidPdf = pdfGeneratedAt && paymentRecordedAt && pdfGeneratedAt >= paymentRecordedAt;
... updateStatement(id, { status:'sent', ..., payments: kept, paymentRecordedAt: null, ...(paidPdf && {pdfBlob:null, pdfGeneratedAt:null}) })
if (paymentRecordedAt) await dropNewPdfSince(id, paymentRecordedAt);
```

`paymentRecordedAt` wird nur beim Festhalten einer Zahlung gesetzt (Z. 809-818) und hier immer auf `null`. Das PDF druckt `paidSoFar = paidAmount` bei Status sent/overdue (`statement-pdf.service.ts:147`, `pdf.service.ts:941`) und der QR-Betrag ist der Rest.

Ablauf (von Hand, nicht an der Persona-Datenbank ausgeführt, weil sie Daten ändert):
1. Abrechnung versendet, Teilzahlung CHF 100.00 festhalten, «PDF herunterladen» (PDF nennt 100.00 bezahlt, QR 115.80 bei Saldo 215.80).
2. Teilzahlung CHF 50.00 festhalten, «Zahlung zurücksetzen» bestätigen: `paidPdf` falsch (PDF älter als die 50.00), das PDF bleibt (richtig, es nennt nur die 100.00); `paymentRecordedAt` ist nun `null`.
3. «Zahlung zurücksetzen» erneut (nun die 100.00): `paymentRecordedAt` ist `null`, also `paidPdf` falsch, `dropNewPdfSince` entfällt. Das PDF mit «Bereits bezahlt CHF 100.00» und QR-Betrag 115.80 bleibt. Erwartet: CHF 215.80 offen.
Gleiches gilt für ein «neues PDF» zum Versenden (`documents`, `new_pdf`, `to_send`).

Einordnung: Die Rücksetz-Logik im Backend ist im Diff unverändert (nur `part` und der Betrag im Protokoll sind neu). Dass ein Teilzahlungs-Zurücksetzen von `sent` aus möglich ist, gab es schon vorher; neu ist die Schaltfläche, die diesen Weg für den Liegenschaftsverwalter erreichbar macht. Ob das «vorher bestehend» im Sinn von «Done means» zählt, entscheidet der Aufrufer. Nicht live reproduziert: siehe «Nicht bestätigt».

### D-2: Beleg

```
payments       [{"date":"2026-11-01","amount":"100.00"},{"date":"2026-11-01","amount":"60.00"}]
payment_resets [{"part":true,"resetOn":"2026-11-01","paidDate":"2026-11-01","paidAmount":"50.00"}]
payment_recorded_at 2026-11-01 18:56:27.3   (die 60.00)
audit_log: payment_reset 2026-11-01 18:56:11.99 (die 50.00)
```

Verlauf auf der Seite (de): `Teilzahlung über CHF 100.00 | Teilzahlung über CHF 60.00 | Teilzahlung vom 01.11.2026 über CHF 50.00 zurückgesetzt`.

Was die Daten tragen: Die Reihenfolge der Ereignisse 100.00, (50.00 festgehalten und zurückgesetzt), 60.00 lässt sich nur für das Zurücksetzen gegenüber der letzten Zahlung belegen (Protokoll 18:56:11 vor `payment_recorded_at` 18:56:27). `payments[]` und `payment_resets[]` tragen nur Tagesdaten, keine Uhrzeit, und beide Daten sind verschiedener Art (`date` = Tag, an dem der Mieter zahlte, auch rückdatierbar; `resetOn` = Tag des Zurücksetzens). Eine Sortierung nach Datum liefert bei Gleichstand keine Folge und kann bei rückdatierter Zahlung falsch sein. Eine richtige Folge braucht eine Zeit je Zahlung und Zurücksetzen (Datenmodell) oder eine bewusste Regel («Zahlungen, dann Zurücksetzen» beibehalten und im Verlauf als gruppiert kenntlich machen). Die Seite zeigt heute die zweite Variante, ohne Hinweis. Entscheid beim Aufrufer.

## Gegenprüfung (stimmt)

Eigene Rechnung aus der Datenbank (`recompute.py`), ohne Dwello-Code:
- Saldo: Kosten 3'095.82 − Akonto 2'880.00 = 215.82, auf 5 Rappen 215.80 (Kontrolle: Pauschale 3 % von 3'005.65 = 90.17; Summe der acht Kategorien 3'005.65). Gespeichert 215.80.
- Zahlungen 100.00 + 60.00 = 160.00 = `paid_amount`; offen 215.80 − 160.00 = 55.80.
- Status: gespeichert `sent`, Zahlungsfrist 28.10.2026 vor heute (01.11.2026), offen > 0: angezeigt «Überfällig». `paid_date` leer (keine vollständige Zahlung).
- `payment_resets`: ein Eintrag, 50.00, `part: true`, Datum 01.11.2026. Das Zurücksetzen der 50.00 hat die Zahlungen [100, 50] auf [100] gebracht (danach 60.00 dazu): konsistent.
- Protokoll: ein Eintrag `payment_reset` mit `paidDate` 2026-11-01 und `paidAmount` 50.00. Zahlungen selbst schreiben kein Protokoll (so schon vor #999, ausser dem Zurücksetzen gibt es nur Statuszeilen im Verlauf).

Seite, Liste, Bestätigung (de, fr, it, en gelesen, Cookie `PARAGLIDE_LOCALE`):
- Detailseite und Liste: de «Bezahlt: CHF 160.00, offen: CHF 55.80», fr «Payé : … reste dû : …», it «Pagato: … ancora dovuto: …», en «Paid: … outstanding: …». Status «Überfällig/En retard/Scaduto/Overdue».
- Verlauf: Zeilen und Beträge stimmen in allen vier Sprachen (Teilzahlung über 100.00, über 60.00, Teilzahlung vom 01.11.2026 über 50.00 zurückgesetzt, jeweils Datum 01.11.2026); Folge siehe D-2.
- Bestätigung (nur geöffnet): zurückgesetzt wird die 60.00 vom 01.11.2026, bleibt 100.00, offen 215.80 − 100.00 = 115.80, Status Überfällig; in allen vier Sprachen gleiche Beträge. Die Texte stimmen mit der Tabelle in `docs/reviews/999-fachreview-1.md` und `messages/*.json` überein (fr mit geschütztem Leerzeichen vor «:»).
- Protokollseite `/config/audit-log`: «Zahlung vom 01.11.2026 über CHF 50.00 zur Abrechnung NK-11111111-2025-0001 zurückgesetzt» und die fr/it/en-Fassungen der Tabelle (das Protokoll sagt «Zahlung», nicht «Teilzahlung»; so entschieden in der Tabelle, kein Befund).
- Beträge der Rückerstattung und der vollständigen Zahlung nach Teilen wurden anhand des Codes geprüft (`chf` mit Betrag ohne Vorzeichen, offen = Saldo − bleibende Zahlungen), nicht an Daten, weil die Persona keine solche Abrechnung hat.

PDF und QR-Rechnung der gespeicherten Abrechnung (erstellt 01.11.2026 19:53, vor allen Zahlungen):
- 3 Seiten, nennt keine Zahlung (richtig, sie entstand vor der ersten Zahlung); Nachzahlung 215.80, Zahlungsfrist 28.10.2026.
- QR (Seite 3, `pdftoppm -r 200`, Decoder OpenCV im Scratchpad): Version 0200, IBAN `CH4431999123000889012` (Mod-97 = 1, QR-IID 31999, = Konfiguration `iban`), Empfänger Muster Immobilien AG, Betrag `215.80` CHF (= Saldo), Zahlungspflichtiger Hans Müller, Bahnhofstrasse 42, 8001 Zürich, Referenztyp QRR `010382982886242923285400855` (Prüfziffer 5, rekursiv Modulo 10 gerechnet, = `qr_bill_reference`), Mitteilung `Nebenkostenabrechnung NK-11111111-2025-0001`, EPD.
- Ein neues PDF, das nach den Zahlungen entsteht, gibt es für diese Abrechnung nicht; sein Betrag (erwartet 55.80) ist deshalb nicht geprüft.

Geprüft: NK-11111111-2025-0001 (Saldo, Zahlungen, offen, Status, `payment_resets`, Protokoll, Detailseite, Liste, Bestätigung, Verlauf in de/fr/it/en, gespeichertes PDF mit QR-Rechnung).

## Nicht bestätigt

- D-1 live: Ich habe den Ablauf nicht an der Persona-Datenbank ausgeführt (würde Daten ändern) und keinen Backend-Test laufen lassen (Worktree ohne `node_modules`, Repository darf nicht geändert werden). Der Befund beruht auf dem Code `statement.service.ts:809-818, 861-875` und `statement-pdf.service.ts:147`. Suche: `grep -rn paymentRecordedAt backend/src` zeigt keine andere Stelle, die den Wert nach dem Zurücksetzen wieder setzt.
- QR-Betrag eines nach den Teilzahlungen erstellten PDFs (Rest 55.80): gibt es für die Abrechnung nicht, und ein neues zu erstellen würde die Datenbank ändern.
- Rückerstattung (Saldo < 0) mit Teilzahlungen und vollständige Zahlung nach Teilen (Verlauf «Zahlung über …»): keine solche Abrechnung in der Persona-Datenbank; nur aus Code und den DOM-Tests im Diff gelesen.
- Positionsbeträge der Abrechnung: nur die Summe der acht Kategorien, die Pauschale und der Saldo nachgerechnet, nicht jede Rechnung, jeder Verteilschlüssel und der Tankbestand (liegt ausserhalb dieser Änderung).
