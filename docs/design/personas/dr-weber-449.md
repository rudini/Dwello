# Persona-Review: Dr. Weber, Zahlungserinnerung per Brief (#449)

Persona: Dr. Weber, 52, rechtlich vorsichtig, liest alles. Desktop 1440 × 900, Maus. Gespeichert nur im Gebäude «Musterhaus Zentrum» (Abrechnung NK-11111111-2025-0001, Hans Müller, Wohnung 1.01). App: Persona-Stack auf http://localhost:3300, Version 0.69.3+157-g861b9873, Datum der App 20.10.2026.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnung (Abschnitt «Mahnungen»), Dokumente, Mieterseite | Die Zahlungserinnerung steht als «erstellt am 20.10.2026, per E-Mail», obwohl der Dialog vorher sagte, dass es mangels E-Mail-Adresse ein Brief zum Ausdrucken ist. Der Kanal im Verlauf ist falsch. |
| P-2 | Major | Abrechnung, Meldung nach «Zahlungserinnerung senden» | Die Meldung heisst «E-Mail nicht zugestellt», obwohl gar keine E-Mail versucht wurde. Sie klingt wie ein Fehler und widerspricht dem Dialog. |
| P-3 | Major | Abrechnungsliste (Überfällig), Abrechnung «Zahlung» | «Gemahnt am 20.10.2026» und «Letzte Mahnung: 20.10.2026», obwohl der Brief nicht versendet ist. Nach der Zahlung bleibt «Letzte Mahnung: 20.10.2026» stehen, obwohl der Brief nie die Post erreicht hat. |
| P-4 | Minor | Abrechnung «Zahlung», Abrechnungsliste | «Nächste Mahnung möglich ab 31.10.2026» rechnet vom Erstelldatum. Die Ablehnung beim Versuch sagt aber, die nächste Stufe gehe erst, wenn die Erinnerung versendet und ihre Frist abgelaufen ist. Beide Aussagen widersprechen sich. |
| P-5 | Minor | Abrechnung, Knopf und Dialog | Knopf «Mahnung senden», Dialogtitel «Mahnung senden», Hauptknopf «Zahlungserinnerung senden». Gesendet wird aber nichts, Dwello erstellt nur ein PDF. Zwei Begriffe für dieselbe Sache und ein Verb, das nicht stimmt. |
| P-6 | Minor | Dialog «Abrechnung als bezahlt markieren» | Der Dialog sagt nur «Danach können Sie keine Mahnung mehr senden.» Dass die bereitliegende Zahlungserinnerung unter «Dokumente» nicht mehr versendet werden darf, steht erst nachher dort. |
| P-7 | Nit | Dokumente, Mieterseite, Abrechnung | Nach der Zahlung steht unter «Nicht mehr versenden: Abrechnung bezahlt» weiter «Der Mieter hat keine E-Mail-Adresse.». Für einen Brief, der nicht mehr verschickt wird, ist das ohne Belang. |

## Beobachtungen

- Den Dialog vor dem Erstellen finde ich gut: Er sagt, dass keine E-Mail-Adresse erfasst ist, dass ein PDF unter «Dokumente» entsteht, dass die Erinnerung auf Deutsch ist und dass ich den Brief am Tag der Post als versendet markieren soll. Auch der Betrag (CHF 215.80) steht drin.
- Der Hinweis oben auf «Dokumente» ist klar: Beim Markieren setzt Dwello das heutige Datum und eine neue Zahlungsfrist ein, danach ausdrucken und am selben Tag schicken. Auf der Abrechnung hat der Link «PDF herunterladen» der Zahlungserinnerung diesen Hinweis nicht. Wer dort druckt, hat einen Brief mit Datum 20.10.2026 und Frist 30.10.2026, auch wenn er ihn erst eine Woche später zur Post bringt.
- PDF der Zahlungserinnerung (eine Seite): Absender Muster Immobilien AG, Empfänger Hans Müller, Bahnhofstrasse 42, 8001 Zürich, «Zürich, 20.10.2026», Betreff «Zahlungserinnerung – Nebenkostenabrechnung NK-11111111-2025-0001», Anrede «Guten Tag Hans Müller», offener Betrag CHF 215.80, Frist 30.10.2026, IBAN und Referenz, der Satz «Haben Sie die Zahlung bereits geleistet, betrachten Sie dieses Schreiben als gegenstandslos.», darunter ein QR-Zahlteil mit demselben Betrag, Konto und derselben Referenz. Der Ton ist freundlich und stellt keine Drohung auf, die der Vermieter später einlösen müsste. Das ist richtig für eine erste Stufe.
- Die Mieterseite zeigt «Korrespondenzkanal: Per E-Mail» und gleichzeitig «E-Mail: Keine E-Mail-Adresse erfasst». Dieser Widerspruch in den Mieterdaten ist wohl der Ursprung von P-1, er stammt aber aus den Demodaten.
- Die Übersicht zeigte vor meiner Arbeit «0 Versendet», aber «1 Überfällig». Eine überfällige Abrechnung ist versendet worden, das verwirrt beim Zählen.
- Verlauf der Abrechnung: «Erstellt 20.10.2026, 18:34», «Versendet 28.09.2026». Erstellt nach dem Versand liest sich unlogisch (wohl wegen der Demodaten).
- «Ihr Mietverhältnis in dieser Periode» spricht auf der Vermieterseite den Mieter an.
- Nach der Zahlung: Status «Bezahlt», Knopf «Zahlung zurücksetzen», die Erinnerung steht auf Dokumente, Mieterseite und Abrechnung als «Nicht mehr versenden: Abrechnung bezahlt», der Knopf «Als versendet markieren» ist weg, der Filter «Zu versenden» meldet «Keine Briefe zu versenden». Die Frist auf der Übersicht ist auch weg. Das ist richtig und eindeutig.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, 11 Schritte (Skripte): Übersicht, Abrechnung, Dialog lesen, Erinnerung erstellen, Dokumente, PDF, Mieterseite und Liste, 2. Mahnung versuchen, Bezahlt-Dialog, Zahlung erfassen und prüfen, Filter «Zu versenden».

## Ablauf

1. **Übersicht.** Erwartet: ein Hinweis auf die überfällige Abrechnung. Gesehen: Unter «Fristen» steht «10.10.2026 Zahlungsfrist · Hans Müller seit 10 Tagen abgelaufen» mit Link zur Abrechnung, dazu «1 Überfällig» und «Überfällige Beträge CHF 215.80». Passt.
2. **Abrechnung NK-11111111-2025-0001.** Erwartet: Status und eine Mahnaktion. Gesehen: «Status: Überfällig», Knöpfe «Mahnung senden» und «Als bezahlt markieren», Saldo Nachzahlung CHF 215.80, Zahlungsfrist 10.10.2026. Passt.
3. **Knopf «Mahnung senden».** Erwartet: eine Vorschau oder zumindest Kanal und Sprache. Gesehen: Dialog «Mahnung senden» mit Kanal (Brief, weil keine E-Mail-Adresse), Ablage unter «Dokumente», Sprache Deutsch, Anweisung zum Markieren, Betrag. Der Hauptknopf heisst plötzlich «Zahlungserinnerung senden» (P-5). Den Brieftext selbst sehe ich erst im PDF.
4. **«Zahlungserinnerung senden».** Erwartet: die Bestätigung «Brief liegt unter Dokumente bereit». Gesehen: Meldung «E-Mail nicht zugestellt» mit dem Text «Das Dokument «Zahlungserinnerung» liegt unter «Dokumente» zum Versand bereit. Der Mieter hat keine E-Mail-Adresse.» (P-2). Im neuen Abschnitt «Mahnungen» steht «erstellt am 20.10.2026, per E-Mail», «Zahlungsfrist der Mahnung: 30.10.2026», «Zu versenden» (P-1). Bei «Zahlung» kommen «Letzte Mahnung: 20.10.2026» und «Nächste Mahnung möglich ab 31.10.2026» dazu (P-3, P-4). Der Knopf «Mahnung senden» ist weg.
5. **Dokumente.** Erwartet: der Brief mit Knopf zum Markieren. Gesehen: «An Hans Müller, erstellt am 20.10.2026, per E-Mail» (P-1), «Zu versenden», Knöpfe «Als versendet markieren» und «PDF herunterladen». Der Einleitungstext erklärt Datum und neue Frist beim Markieren. Gut.
6. **PDF öffnen.** Erwartet: ein sauberer Brief mit QR-Zahlteil. Gesehen: eine Seite, Inhalt wie unter Beobachtungen beschrieben, Dateiname «Zahlungserinnerung NK-11111111-2025-0001.pdf». Kein Befund.
7. **Abrechnungsliste «Überfällig».** Gesehen: «Überfällig Gemahnt am 20.10.2026 Nächste Mahnung möglich ab 31.10.2026» (P-3). Für mich heisst «gemahnt», dass der Mieter die Mahnung hat. Hat er nicht.
8. **2. Mahnung vor dem Versand.** Erwartet: ein Knopf, der mir erklärt, warum es noch nicht geht. Gesehen: Auf der Abrechnung gibt es keinen Mahnknopf mehr, nur «Nächste Mahnung möglich ab 31.10.2026». Um die Ablehnung zu sehen, habe ich nachgestellt, was ein Browsertab zeigt, der noch vor der ersten Erinnerung geöffnet wurde: dieselbe Aktion noch einmal abgeschickt. Antwort als Fehlermeldung: «Das hat nicht geklappt. Die Zahlungserinnerung ist noch nicht versendet. Markieren Sie sie unter «Dokumente» als versendet. Die nächste Mahnstufe ist nach ihrer Zahlungsfrist möglich.» Es entstand kein zweites Dokument. Der Inhalt ist richtig und sagt, was zu tun ist. Er widerspricht aber dem «möglich ab 31.10.2026» auf der Seite (P-4).
9. **«Als bezahlt markieren».** Erwartet: ein Hinweis auf den bereitliegenden Brief. Gesehen: Dialog mit «Danach können Sie keine Mahnung mehr senden.», Feld «Bezahlt am» (vorbelegt 20.10.2026, Hilfetext zum Format), Betrag. Nichts zum Brief unter «Dokumente» (P-6).
10. **Zahlung bestätigen.** Gesehen: «Status: Bezahlt», «Bezahlt am 20.10.2026», «Letzte Mahnung: 20.10.2026» bleibt stehen (P-3). Die Mahnung zeigt «Nicht mehr versenden: Abrechnung bezahlt».
11. **Dokumente und Mieterseite nach der Zahlung.** Erwartet: Der Brief lässt sich nicht mehr als versendet markieren. Gesehen: Auf beiden Seiten «Nicht mehr versenden: Abrechnung bezahlt», kein Knopf «Als versendet markieren», PDF weiterhin herunterladbar, Filter «Zu versenden»: «Keine Briefe zu versenden». Passt. Weiterhin «per E-Mail» (P-1) und «Der Mieter hat keine E-Mail-Adresse.» (P-7).

## Verwirrung

- «Mahnung» und «Zahlungserinnerung» wechseln auf demselben Weg: Knopf «Mahnung senden», Abschnitt «Mahnungen», Dokument «Zahlungserinnerung», Fehlermeldung «nächste Mahnstufe». Ich vermute, die Zahlungserinnerung ist die erste Mahnstufe. Das steht aber nirgends.
- «senden» am Knopf: Gesendet wird nichts, ich muss den Brief selbst drucken und zur Post bringen.
- «E-Mail nicht zugestellt»: Ist etwas schiefgegangen? Der Dialog hatte doch gesagt, es gibt keine E-Mail.
- «per E-Mail» beim Brief: Welcher Kanal gilt nun?
- «Gemahnt am» / «Letzte Mahnung»: Ab wann zählt eine Mahnung als erfolgt, beim Erstellen oder beim Versand?

## Fehlerrisiken

- P-3 und P-1: Leitet der Vermieter später eine Betreibung ein oder kündigt er wegen Zahlungsverzug, stützt er sich vielleicht auf «Gemahnt am 20.10.2026, per E-Mail». Beides stimmt nicht: Es gab keine E-Mail, und der Brief ging zu diesem Datum nicht weg. Eine Aussage, die er nicht belegen kann.
- P-4: Der Vermieter plant am 31.10.2026 die zweite Mahnung und erfährt erst dann, dass zuerst der Brief markiert sein muss. Die Frist des Mieters läuft ab dem Versand.
- P-6 und Beobachtung zum PDF-Link auf der Abrechnung: Wer den Brief schon gedruckt hat und dann die Zahlung erfasst, sieht im Dialog keine Warnung und schickt den Brief vielleicht trotzdem. Der Satz «betrachten Sie dieses Schreiben als gegenstandslos» mildert das zum Glück. Ein früh gedrucktes PDF trägt ausserdem ein altes Datum und eine kürzere Frist.

## Vorschläge

- **P-1:** Abrechnung von Hans Müller öffnen, «Mahnung senden», «Zahlungserinnerung senden»; Abschnitt «Mahnungen», «Dokumente» und Mieterseite zeigen «per E-Mail». Hilfreich: der tatsächliche Kanal, z. B. «als Brief (keine E-Mail-Adresse erfasst)», und nach dem Markieren «per Post versendet am …».
- **P-2:** Gleicher Weg, Meldung direkt nach dem Erstellen. Hilfreich: eine Erfolgsmeldung statt einer Fehlerüberschrift, z. B. «Brief erstellt. Die Zahlungserinnerung liegt unter «Dokumente» zum Ausdrucken bereit.»
- **P-3:** Erinnerung erstellen, nicht markieren; Liste «Überfällig» zeigt «Gemahnt am 20.10.2026», die Abrechnung «Letzte Mahnung: 20.10.2026», auch nach der Zahlung. Hilfreich: «Gemahnt» und «Letzte Mahnung» erst mit dem Versanddatum; vorher z. B. «Zahlungserinnerung erstellt, noch nicht versendet»; nach der Zahlung ohne Versand keine «Letzte Mahnung».
- **P-4:** Erinnerung erstellen, nicht markieren; Seite zeigt «Nächste Mahnung möglich ab 31.10.2026», ein erneuter Versuch wird abgelehnt, weil die Erinnerung noch nicht versendet ist. Hilfreich: solange der Brief nicht markiert ist, statt eines Datums «Nächste Mahnung erst möglich, wenn Sie die Zahlungserinnerung als versendet markiert haben und ihre Frist abgelaufen ist.»
- **P-5:** Abrechnung, Knopf und Dialog. Hilfreich: bei fehlender E-Mail-Adresse Knopf und Titel «Zahlungserinnerung erstellen», und einmal erklären, dass die Zahlungserinnerung die erste Mahnstufe ist.
- **P-6:** Erinnerung erstellen, dann «Als bezahlt markieren». Hilfreich: wenn ein Brief bereitliegt, ein Satz im Dialog: «Die Zahlungserinnerung unter «Dokumente» ist noch nicht versendet. Schicken Sie sie nach der Zahlung nicht mehr.»
- **P-7:** Nach der Zahlung Dokumente öffnen. Hilfreich: den Satz zur E-Mail-Adresse ausblenden, sobald der Brief «Nicht mehr versenden» ist.

## Nicht geprüft

- «Als versendet markieren» selbst: Die Aufgabe verlangte, vor dem Versand die 2. Mahnung zu versuchen und danach die Zahlung zu erfassen. Darum habe ich den Brief nie markiert und nicht gesehen, ob Datum und Frist im PDF danach wirklich neu gesetzt werden.
- Ob ein noch offener Tab nach der Zahlung den Brief trotzdem als versendet markieren kann: Der Knopf war auf allen Seiten weg. Den Versuch aus einem alten Tab habe ich nicht nachgestellt, weil ich die Aktion dafür nicht kenne, ohne in den Code zu schauen.
- Ob die Übersicht unter «Als Nächstes zu tun» einen zu versendenden Brief anzeigt: Ich habe die Übersicht zwischen Erstellen und Zahlung nicht geöffnet. Danach war der Zustand nicht mehr herstellbar.
- Ob am 31.10.2026 ein Mahnknopf erscheint, obwohl der Brief nicht markiert ist (P-4): Das Datum der App lässt sich als Nutzer nicht vorstellen.
- Andere Sprachen (fr/it) der Zahlungserinnerung: Hans Müller hat Deutsch. Die Mieter mit anderer Sprache liegen ausserhalb meines Auftrags zum Speichern.
- Zur Ablehnung der 2. Mahnung: Mit der normalen Oberfläche ist sie nicht erreichbar, weil der Knopf fehlt. Ich habe sie gesehen, indem ich die Aktion eines veralteten Tabs nachgestellt habe (Schritt 8).

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/weber-449/` (03-mahnung-dialog.png, 04-nach-erinnerung.png, 05-dokumente.png, er1-1.png = PDF, 08-zweite-mahnung.png, 09-bezahlt-dialog.png, 10-nach-bezahlt.png, 11-dokumente-nach-bezahlt.png, 12-mieter-nach-bezahlt.png, 13-zu-versenden.png).
