# Dr. Weber – Kleinbetrag unter CHF 5 (#94)

Persona: Dr. Weber, 52, rechtlich vorsichtig, liest alles und rechnet nach. Desktop 1440 × 900, Maus.
App: http://localhost:3300 (Persona-Stack, `dwello_persona` mit Demodaten). Gespeichert habe ich nur in «Seepark Residenz».
Skripte, Screenshots und PDFs: `/tmp/claude-0/-home-user-Dwello/2c72529f-9bca-535a-94c9-4a75e2c3ffa5/scratchpad/persona-weber/`.

Ausgangslage (vom Aufrufer per SQL gesetzt): Thomas Weber, A1, 2025, Nachzahlung CHF 3.40; Nina Brunner, A2, 2025, Rückerstattung CHF 2.90. Vergleich: Sarah Meier, A2, 2025, Nachzahlung CHF 138.00 (nur angesehen).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnungsdetail, Liste, Übersicht | Nach «Als versendet markieren» springt eine erlassene Abrechnung sofort auf «Bezahlt», mit Zahlungsdatum im Verlauf («Bezahlt 17.10.2026»). Niemand hat bezahlt. Die Liste zeigt «Nachzahlung CHF 3.40 · Bezahlt», ohne Hinweis auf den Erlass. Die Meldung sagt nur «Abrechnung als versendet markiert». |
| P-2 | Major | PDF Rückerstattung, Detail | «Der Betrag ist kleiner als CHF 5.00. Wir zahlen ihn nicht aus.» Die Rückerstattung ist ein Anspruch der Mieterin. Darauf kann nur sie verzichten, nicht der Vermieter einseitig. Es gibt weder einen Weg «auf Wunsch auszahlen» noch eine Verrechnung. Rechtlich halte ich das für angreifbar (eventuell Produktentscheid in #94, dann «Blocked on me»). |
| P-3 | Minor | Abrechnung bearbeiten | Bei der erlassenen Nachzahlung zeigt «Frist und Bemerkungen bearbeiten» das Feld «Zahlungsfrist» mit dem Text «Bis zu diesem Datum bezahlt der Mieter die Nachzahlung», vorausgefüllt mit 16.11.2026. Das widerspricht dem Erlass. |
| P-4 | Minor | Detail → Zahlung zurücksetzen → Bearbeiten → Übersicht | Nach «Zahlung zurücksetzen» und unverändertem Speichern des Bearbeitungsformulars steht in der Übersicht unter Fristen «16.11.2026 Zahlungsfrist · Thomas Weber, in 30 Tagen», für einen erlassenen Betrag. Der Dialog «Als bezahlt markieren» verlangt dann «Bezahlt am: Der Tag, an dem das Geld eingegangen ist» und warnt «Danach können Sie keine Mahnung mehr senden». |
| P-5 | Minor | PDF Nachzahlung | Im PDF steht oben gross und fett «Nachzahlung CHF 3.40». Der Erlass steht nur in der kleinen Zeile darunter, und die Schlusszeile der Tabelle lautet ebenfalls «Nachzahlung 3.40». Wer nur überfliegt, glaubt, er schulde CHF 3.40. |
| P-6 | Nit | PDF Rückerstattung | Uneinheitlich: Bei der Nachzahlung steht «Wir verzichten darauf; Sie müssen nichts bezahlen.», bei der Rückerstattung nur «Wir zahlen ihn nicht aus.» Es fehlt «Sie müssen nichts tun» bzw. ein Satz, dass keine IBAN nötig ist. |
| P-7 | Nit | Abrechnungsdetail | «Sie verzichten darauf.» / «Sie zahlen ihn nicht aus.» klingt, als hätte ich das entschieden. Ich habe nichts gewählt, und nirgends steht, woher die Grenze von CHF 5 kommt und ob ich sie ändern kann. |

## Beobachtungen

- Die Rundungszeilen sind falsch: «Nachzahlung vor Rundung 3.44, Rundung − 0.04» ergibt kaufmännisch 3.45, nicht 3.40. Bei Brunner ergeben 2.87 + 0.03 = 2.90, das stimmt. Laut Aufrufer stammt das aus der SQL-Vorbereitung und gehört nicht zur Änderung.
- Bei beiden Kleinbeträgen stand in der Liste «PDF noch nicht erstellt», trotzdem liess sich die Abrechnung als versendet markieren. Im Verlauf erscheint «PDF erstellt» erst nach «Versendet». Was genau hat der Mieter also bekommen? Der Versanddialog bietet nur «PDF ansehen (öffnet in neuem Tab)» an.
- Nach «Zahlung zurücksetzen» war das gespeicherte PDF weg (wieder «PDF erstellen» statt «PDF herunterladen»).
- Nach dem Versenden ist «Zahlung zurücksetzen» die einzige prominente Aktion. Bei einem erlassenen Betrag wirkt das seltsam.
- Im Versanddialog steht nichts zum Kleinbetrag. Das ist unproblematisch, aber ein Satz «Der Mieter muss nichts bezahlen» hätte mich beruhigt.
- In der Detailansicht des Kleinbetrags fehlt die Zeile «Zahlungsfrist». Bei Meier steht sie («16.11.2026»). Das ist richtig so.
- Anna Schmidt (Musterhaus Zentrum, Rückerstattung CHF 2.50) stand bei meinem zweiten Blick ebenfalls auf «Bezahlt». Das war nicht mein Datensatz, ich habe ihn nicht angefasst.

## Aufgabe geschafft: ja

## Aufwand

Etwa 30 Minuten, 14 Skripte. Beide Abrechnungen versendet, beide PDFs gelesen, Vergleich mit Meier (PDF) und Fischer 2024 (Rückerstattung mit IBAN-Bitte). Zusätzlich bei Weber «Zahlung zurücksetzen», Formular speichern und wieder «Als bezahlt markieren», um eine Mahnung zu suchen.

## Ablauf

1. **Liste Nebenkostenabrechnungen.** Erwartet: Hinweis beim Kleinbetrag. Gesehen: «Nachzahlung CHF 3.40, Entwurf, PDF noch nicht erstellt», kein Hinweis auf den Erlass (Screenshot `02-statements.png`).
2. **Detail Weber.** Erwartet: klare Aussage zur Zahlung. Gesehen: Abschnitt «Zahlung: Der Betrag ist kleiner als CHF 5.00. Sie verzichten darauf.», keine Zahlungsfrist (`03-weber-detail.png`). Für mich verständlich.
3. **Detail Brunner.** Gesehen: «Der Betrag ist kleiner als CHF 5.00. Sie zahlen ihn nicht aus.» (`04-brunner-detail.png`). Hier zuckte ich: Darf ich das?
4. **Detail Meier (Vergleich).** Gesehen: «Der Mieter bezahlt die Nachzahlung von CHF 138.00.», Zahlungsfrist 16.11.2026 (`05-meier-detail.png`).
5. **Weber versenden.** Erwartet: Dialog, danach Status «Versendet». Gesehen: Dialog mit Empfänger und Kanal (E-Mail), nach dem Bestätigen die Meldung «Abrechnung als versendet markiert», aber Status-Badge «Bezahlt». Im Verlauf steht «Versendet 17.10.2026» und «Bezahlt 17.10.2026» (`08-weber-after-send.png`). Das hat mich überrascht, nirgends wird es erklärt.
6. **PDF Weber.** «PDF erstellen» geklickt, dann heruntergeladen. Eine Seite, kein Zahlteil, keine QR-Rechnung, keine Frist, kein «Bezahlt am». Im Kasten «Nachzahlung CHF 3.40 / Der Betrag ist kleiner als CHF 5.00. Wir verzichten darauf; Sie müssen nichts bezahlen.» Inhaltlich klar, optisch dominiert aber der Betrag (`pdf/weber-1.png`).
7. **Brunner versenden.** Wie bei Weber: sofort «Bezahlt» (`09-brunner-after-send.png`).
8. **PDF Brunner.** Zwei Seiten, kein Zahlteil, keine Bitte um IBAN, keine Überweisungsfrist. «Rückerstattung CHF 2.90 / Der Betrag ist kleiner als CHF 5.00. Wir zahlen ihn nicht aus.» Zum Vergleich steht bei Fischer 2024 (CHF 29.80): «Wir überweisen Ihnen den Betrag bis 14.05.2025. Teilen Sie uns dafür Ihre IBAN mit …».
9. **PDF Meier (Vergleich).** «Bitte bezahlen Sie den Betrag bis 16.11.2026 mit dem Zahlteil.», dazu QR-Zahlteil über CHF 138.00. Stimmig.
10. **Status prüfen.** Die Liste mit Filter «Bezahlt» zeigt Weber «Nachzahlung CHF 3.40 · Bezahlt» und Brunner «Rückerstattung CHF 2.90 · Bezahlt» (`10-list-paid.png`). In der Übersicht steht «12 Bezahlt». Erwartet hatte ich etwas wie «Erledigt (erlassen)».
11. **Mahnung suchen.** Im Status «Bezahlt» wird keine Mahnung angeboten. «Zahlung zurücksetzen» (Weber): Der Dialog sagt «Das Zahlungsdatum 17.10.2026 wird gelöscht» (`13-weber-reset-dialog.png`). Danach Status «Versendet», nur die Aktion «Als bezahlt markieren», keine Mahnung (`14-weber-after-reset.png`).
12. **Bearbeiten.** «Frist und Bemerkungen bearbeiten» zeigt eine Zahlungsfrist mit 16.11.2026 und dem Text «bezahlt der Mieter die Nachzahlung» (`15-weber-edit.png`). Ich habe unverändert gespeichert. Die Übersicht zeigt nun «Zahlungsfrist · Thomas Weber, in 30 Tagen». Das PDF bleibt korrekt (ohne Frist).
13. **Wieder als bezahlt markiert.** Der Dialog verlangt «Bezahlt am: Der Tag, an dem das Geld eingegangen ist» und «Danach können Sie keine Mahnung mehr senden» (`18-weber-paid-dialog.png`). Danach wieder «Bezahlt», und die Frist ist aus der Übersicht verschwunden.

## Verwirrung

- «Bezahlt» für einen Betrag, den niemand bezahlt hat. In meiner Buchhaltung wäre das falsch.
- «Sie verzichten darauf»: Habe ich das gewählt? Wo ist die Grenze von CHF 5 festgelegt?
- «Zahlung zurücksetzen» bei einem Erlass: Welche Zahlung?
- Zahlungsfrist im Bearbeitungsformular bei einem erlassenen Betrag.

## Fehlerrisiken

- Der Mieter liest nur die fette Zeile «Nachzahlung CHF 3.40» und zahlt trotzdem. Dann habe ich ungeklärtes Geld auf dem Konto.
- Die Mieterin fordert ihre CHF 2.90 ein, weil ein einseitiger Verzicht nicht gilt. Ich habe in Dwello keinen Weg, das auszuzahlen und festzuhalten.
- Nach einem Zurücksetzen entsteht eine Zahlungsfrist in der Übersicht. Nach Ablauf droht womöglich «Überfällig» und eine Mahnung für einen erlassenen Betrag (konnte ich nicht prüfen, siehe unten).
- Die Auswertung «Bezahlt» bzw. «Überfällige Beträge» vermischt Erlass und echte Zahlung.

## Vorschläge

- **P-1:** Seepark Residenz → Abrechnung Thomas Weber 2025 (Saldo < CHF 5) → «Als versendet markieren» → bestätigen. Status ist «Bezahlt», im Verlauf steht «Bezahlt 17.10.2026». Hilfreich wäre ein eigener Status oder eine Kennzeichnung «Erledigt – Kleinbetrag erlassen» (Badge, Liste, Verlauf «Kleinbetrag erlassen» statt «Bezahlt»), dazu eine Meldung, die das sagt: «Abrechnung als versendet markiert. Der Betrag ist unter CHF 5.00 und damit erledigt.»
- **P-2:** Abrechnung Nina Brunner 2025 → PDF. Hilfreich wäre, die Rückerstattung nicht einseitig verfallen zu lassen, etwa: «Wir verrechnen den Betrag mit Ihrer nächsten Akontozahlung» oder «Auf Wunsch zahlen wir ihn aus; teilen Sie uns dafür Ihre IBAN mit.» Sonst bitte fachlich prüfen lassen (fach-reviewer), ob der Verzicht so haltbar ist.
- **P-3:** Abrechnung Weber 2025 → «Frist und Bemerkungen bearbeiten». Hilfreich wäre, das Feld «Zahlungsfrist» bei einem Kleinbetrag auszublenden oder durch den Hinweis «Keine Zahlungsfrist: Betrag unter CHF 5.00» zu ersetzen.
- **P-4:** Weber 2025 (Bezahlt) → «Zahlung zurücksetzen» → bestätigen → «Frist und Bemerkungen bearbeiten» → «Änderungen speichern» → Übersicht zeigt «Zahlungsfrist · Thomas Weber». Hilfreich wäre: «Zahlung zurücksetzen» bei Kleinbeträgen nicht anbieten oder dort keine Frist anlegen. Der Dialog «Als bezahlt markieren» sollte bei einem Erlass nicht nach dem Geldeingang fragen.
- **P-5:** PDF Weber 2025. Hilfreich wäre ein Kasten mit «Nachzahlung CHF 3.40 – erlassen» oder «Zu bezahlen: CHF 0.00» und eine Schlusszeile «Nachzahlung (erlassen)».
- **P-6:** PDF Brunner 2025. Ergänzen: «Sie müssen nichts tun.»
- **P-7:** Detail Weber oder Brunner. Neutral formulieren, etwa «Beträge unter CHF 5.00 werden weder eingefordert noch ausbezahlt», und sagen, woher die Regel kommt.

## Nicht geprüft

- Ob eine erlassene Abrechnung mit Zahlungsfrist (Weg aus P-4) nach dem 16.11.2026 «Überfällig» wird und eine Mahnung anbietet. Die Serveruhr lässt sich im Persona-Stack nicht verstellen.
- Den Dialog «Als versendet markieren» bei Sarah Meier: Das Öffnen wurde von der Rechteprüfung abgelehnt. Ihr PDF habe ich nur heruntergeladen und gelesen.
- Andere Sprachen (fr/it/en) des PDFs und der Detailtexte.
- Den Rechenweg der Beträge selbst (Sache von daten-pruefer). Die Akonto-/Saldo-Werte sind per SQL gesetzt.
