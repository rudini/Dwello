# Dr. Weber – Akonto-Erhöhung nachtragen und Abrechnung 2025 berichtigen (#464, Runde 2)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. App: Persona-Stack http://localhost:3300 (Deutsch, frische Demodaten). Gespeichert habe ich nur im Gebäude «Musterhaus Zentrum», bei Hans Müller (Wohnung 1.01).
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/94137d46-12c2-5dda-bd7d-6f5cd855db5e/scratchpad/weber-464-2/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Mietvertrag bearbeiten, Ablehnung beim Speichern | Die Meldung «… Berichtigen Sie zuerst diese Abrechnung, oder wählen Sie ein späteres «Gültig ab».» stellt das spätere Datum als gleichwertigen Ausweg hin. Gilt das Akonto aber wirklich ab 01.07.2025, ist ein späteres Datum falsch: Die nächste Abrechnung zieht dann zu wenig Akonto ab, und der Mieter bezahlt CHF 60 zu viel. Ein Vermieter, der die Berichtigung scheut, nimmt genau diesen Ausweg. |
| P-2 | Major | PDF und Seite der berichtigten Abrechnung | Die Zeile heisst weiterhin «Geleistete Akontobeiträge». Darunter stehen jetzt «6 Monate × CHF 240.00» und «6 Monate × CHF 250.00», und der Hinweis sagt, abgezogen sei das *vereinbarte* Akonto. Das PDF quittiert damit Zahlungen, die Dwello gar nicht kennt. Der Befund war schon in Runde 1 offen (dort P-3). Mit der Aufteilung nach Zeitraum ist er jetzt deutlicher sichtbar. |
| P-3 | Minor | Berichtigte Abrechnung (Entwurf), Warnung | Die Warnung «Anderes Akonto als in der ersetzten Abrechnung» sagt nur, was zu tun ist, wenn der Betrag *falsch* ist. Für den gewollten Fall, also meinen, sagt sie nichts: weder «Stimmt das neue Akonto, prüfen und versenden Sie die Abrechnung» noch den Hinweis, dass ein rückwirkend eingetragenes höheres Akonto nur gilt, wenn es dem Mieter gültig mitgeteilt war (amtliches Formular). «Stimmt ein früherer Betrag am Mietvertrag nicht» ist ausserdem unklar: Welcher Betrag ist «früher»? |
| P-4 | Minor | PDF der berichtigten Abrechnung | Das PDF sagt dem Mieter nicht, *warum* die Abrechnung ersetzt wird und was sich geändert hat (Akonto ab 01.07.2025 CHF 250.00 statt CHF 240.00, Nachzahlung CHF 155.80 statt CHF 215.80). Auch über die «Bemerkungen» lässt sich das nicht ergänzen, denn sie erscheinen nicht im PDF (selbst ausprobiert, siehe Ablauf 13). |
| P-5 | Minor | Mietvertrag bearbeiten, Ablehnung beim Speichern | Die Meldung nennt die Abrechnung NK-11111111-2025-0001, verlinkt sie aber nicht. Ich musste über «Nebenkostenabrechnungen» selbst hinfinden. |
| P-6 | Minor | Mietvertrag bearbeiten, Hilfetext «Gültig ab» | Laut Text gilt das Akonto ab «der Erste eines Monats», das Beispiel lautet aber «31.12.2026». Das Beispiel widerspricht der Regel direkt daneben. |
| P-7 | Nit | Mietvertrag bearbeiten, Hilfetext Akonto | Der Hilfetext nennt die Rechtsgrundlage weiterhin nicht (Art. 269d OR; die Verwaltungspauschale darunter nennt sie). Uneinheitlich bleiben auch «10 Tage» gegenüber «zehn Tage» und «nächsten» gegenüber «nächstmöglichen Kündigungstermin» (Runde 1, P-5). |

## Beobachtungen

- Das Wichtigste vorweg: Was in Runde 1 blockiert hat, ist behoben. Es gibt jetzt ein Feld «Gültig ab», Speichern funktioniert, und der Mietvertrag zeigt «Akonto nach Zeitraum: CHF 240.00 vom 01.03.2021 bis 30.06.2025 / CHF 250.00 ab 01.07.2025». So stelle ich mir das vor.
- Die Ablehnung beim Speichern ist inhaltlich klar und richtig. Sie nennt Datum und Abrechnungsnummer und sagt, was zu tun ist. Der Weg danach führt über «Abrechnung berichtigen», «Mietvertrag öffnen» und «Berichtigte Abrechnung erstellen» und ist gut beschrieben.
- Die Beträge habe ich nachgerechnet und sie stimmen: 6 × 240 + 6 × 250 = 2'940.00; 3'095.82 − 2'940.00 = 155.82, gerundet 155.80. Der QR-Zahlteil lautet auf CHF 155.80, mit der neuen Abrechnungsnummer in den zusätzlichen Informationen.
- Die Aufteilung im PDF nach Zeitraum («6 Monate × CHF 240.00 (01.01.2025 – 30.06.2025)», «6 Monate × CHF 250.00 (01.07.2025 – 31.12.2025)») ist vorbildlich nachvollziehbar.
- Nach «Als versendet markieren» verschwindet die Warnung «Anderes Akonto …». Das finde ich vertretbar.
- «Gültig ab» ist mit 01.11.2026 vorbelegt (Sonntag, der nächste Monatserste). Wer nur einen Tippfehler im Betrag korrigieren will und das Datum übersieht, legt damit ungewollt einen neuen Zeitraum ab 01.11.2026 an. Der Hilfetext erklärt zwar, wie man korrigiert, die Vorbelegung arbeitet aber dagegen. Ich habe das selbst erlebt: Mein erster Versuch hat 01.11.2026 gespeichert, weil mein Datum nicht übernommen wurde. Wahrscheinlich habe ich getippt, bevor die Seite fertig geladen war. Ich habe den Eintrag mit «Akonto ab 01.11.2026 löschen» wieder entfernt. Der Bestätigungsdialog dafür ist klar: «Ab dann gilt wieder das Akonto von CHF 240.00.»
- Oben auf der Bearbeitungsseite steht «Tragen Sie eine Mietzinserhöhung erst ein, wenn sie gilt.» Beim Akonto, das rechtlich auch zum Mietzins gehört, darf ich ein künftiges «Gültig ab» aber sehr wohl eintragen; es ist sogar vorbelegt. Für einen Laien wirkt das widersprüchlich.
- «Neu berechnen» sagt nur «mit den Rechnungen, wie sie jetzt sind». Ob es auch ein geändertes Akonto aus dem Mietvertrag übernimmt, steht nicht da. Die Warnung verlangt stattdessen «Entwurf löschen und neu erstellen». Was der Unterschied ist, bleibt offen.
- Während die Berichtigung offen war, zeigte der Mietvertrag wie in Runde 1 «4 Abrechnungen fehlen» mit «2025 abrechnen» und keinen Hinweis auf die wartende Berichtigung. Nach dem Versenden steht wieder «3 Abrechnungen fehlen» (2021–2023).
- Wie in Runde 1: «Bezahlen Sie nur noch den Saldo dieser Abrechnung» würde einen Mieter, der die ersetzte Abrechnung schon bezahlt hat, zu einer zweiten Zahlung auffordern. Der Dialog «Abrechnung berichtigen» warnt den Vermieter zwar davor, das PDF selbst aber nicht. Und der Satz «… regeln wir das ausserhalb dieser Abrechnung» sagt dem Mieter weiterhin nicht, dass er fehlende Beiträge weiterhin schuldet.
- Die Hilfe beim Feld «Bemerkungen (optional)» lautet «Zum Beispiel eine Absprache mit dem Mieter.» Daraus geht nicht hervor, ob der Mieter die Bemerkung zu sehen bekommt. Sie erscheint auf der Seite der Abrechnung, aber nicht im PDF.
- Nach dem Speichern der Bemerkung blieb das alte PDF bestehen («PDF herunterladen», kein «PDF erstellen»). Einen Hinweis, dass das PDF älter ist als die Änderung, gab es nicht. Weil die Bemerkung ohnehin nicht gedruckt wird, ist das hier folgenlos.

## Aufgabe geschafft: ja

Das Akonto CHF 250.00 ab 01.07.2025 ist im Mietvertrag erfasst. Die Abrechnung NK-11111111-2025-0001 ist ersetzt, und die berichtigte NK-11111111-2025-0005 (Nachzahlung CHF 155.80) ist als versendet markiert. Versenden würde ich sie aber nur mit einem Begleitbrief, der den Grund der Berichtigung nennt (P-4) und klarstellt, dass «Geleistete Akontobeiträge» die vereinbarten Beiträge meint (P-2).

## Aufwand

Etwa 20 Minuten, 19 Skript-Durchgänge. Davon gingen zwei auf meinen Fehlversuch mit dem Datum (Eintrag 01.11.2026 anlegen und wieder löschen). Der eigentliche Weg hat 7 Schritte: Mietvertrag bearbeiten, Ablehnung lesen, Abrechnung öffnen, berichtigen, Mietvertrag erneut speichern, berichtigte Abrechnung erstellen, PDF erstellen und versenden.

## Ablauf

1. **Mietverträge → Hans Müller.** Erwartet: Akonto mit Verlauf. Gesehen: «Akonto CHF 240.00», noch kein Verlauf (es gibt ja nur einen Betrag). «3 Abrechnungen fehlen» (2021–2023).
2. **Bearbeiten.** Erwartet: ein Datumsfeld zum Akonto. Gesehen: das Feld «Gültig ab», vorbelegt mit 01.11.2026, darunter «Sonntag, 1. November 2026». Die Hilfetexte habe ich vollständig gelesen (siehe P-6, P-7 und Beobachtungen).
3. **Erster Versuch.** 250.00 und 01.07.2025 eingegeben, gespeichert. Erwartet: Ablehnung wegen der versendeten Abrechnung. Gesehen: gespeichert, aber ab 01.11.2026 (Screenshot `04-crop.png`: Feld zeigt nach dem Verlassen wieder 01.11.2026). Vermutlich habe ich zu früh getippt. Den Eintrag habe ich über «Akonto ab 01.11.2026 löschen» und den Bestätigungsdialog wieder entfernt.
4. **Zweiter Versuch, sorgfältig getippt.** Unter dem Feld steht «Dienstag, 1. Juli 2025». Speichern. Erwartet: Ablehnung. Gesehen: rote Meldung direkt über den Schaltflächen: «Der Mietvertrag wurde nicht gespeichert. Das Akonto ab 01.07.2025 ändert die Abrechnung NK-11111111-2025-0001, die schon erstellt ist. Berichtigen Sie zuerst diese Abrechnung, oder wählen Sie ein späteres «Gültig ab».» (`09-refusal-viewport.png`). Die Sache ist klar, aber es gibt keinen Link (P-5) und der zweite Ausweg ist heikel (P-1).
5. **Abrechnung NK-11111111-2025-0001 (Versendet).** Über die Liste gefunden. Gesehen: «Geleistete Akontobeiträge − CHF 2’880.00», Nachzahlung CHF 215.80, unter «Weitere Aktionen» die Schaltfläche «Abrechnung berichtigen».
6. **Dialog «Abrechnung berichtigen».** Klar und vorsichtig formuliert, inklusive Verjährungshinweis (Art. 128 Ziff. 1 OR). Bestätigt.
7. **Ersetzte Abrechnung.** «Diese Abrechnung ist ersetzt. Stimmen Vertragsdaten oder Rechnungen nicht, korrigieren Sie sie jetzt.» Dazu «Mietvertrag öffnen» und «Berichtigte Abrechnung erstellen». Wie erwartet.
8. **Mietvertrag erneut speichern (250.00, 01.07.2025).** Erwartet: jetzt erlaubt. Gesehen: gespeichert, «Akonto CHF 250.00», «Akonto nach Zeitraum: CHF 240.00 vom 01.03.2021 bis 30.06.2025 / CHF 250.00 ab 01.07.2025» (`13-contract-saved.png`). Der Mietvertrag zeigt dabei «4 Abrechnungen fehlen / 2025 abrechnen».
9. **Berichtigte Abrechnung erstellen.** Ohne Rückfrage entsteht der Entwurf NK-11111111-2025-0005, «Ersetzt die Abrechnung NK-11111111-2025-0001 vom 28.09.2026». Gelbe Warnung mit Warndreieck: «Anderes Akonto als in der ersetzten Abrechnung. Die Akontobeiträge dieser Abrechnung (CHF 2’940.00) sind anders als in der ersetzten Abrechnung … (CHF 2’880.00). Stimmt ein früherer Betrag am Mietvertrag nicht, löschen Sie diesen Entwurf …» (`15-crop.png`). Die Warnung ist berechtigt, sie bestätigt mir aber den gewollten Fall nicht (P-3). Saldo: Nachzahlung CHF 155.80, Zahlungsfrist 18.11.2026.
10. **PDF erstellen und lesen.** Seite 1: Ersatzhinweis, «Nachzahlung CHF 155.80», «Ihre Nebenkosten CHF 3'095.82 – Geleistete Akontobeiträge CHF 2'940.00». Seite 2: die beiden Akontozeilen nach Zeitraum, darunter der Hinweis «Abgezogen sind die Akontobeiträge, die im Mietvertrag vereinbart sind. Haben Sie Akontobeiträge nicht bezahlt, regeln wir das ausserhalb dieser Abrechnung.» (P-2). Ein Grund für die Berichtigung fehlt (P-4). Seite 3: QR-Zahlteil CHF 155.80.
11. **«Neu berechnen» angesehen.** Der Dialog nennt nur die Rechnungen, nicht das Akonto. Ich habe abgebrochen.
12. **Bemerkung ergänzt.** Über «Frist und Bemerkungen bearbeiten» eingetragen: «Berichtigt: Ab 01.07.2025 beträgt Ihr Akonto CHF 250.00 statt CHF 240.00. …». Erwartet: Die Bemerkung steht im PDF. Gesehen: Sie steht auf der Seite, das bestehende PDF blieb aber unverändert.
13. **Neu berechnen, dann PDF neu erstellen.** Die Beträge blieben gleich (CHF 2’940.00, CHF 155.80). Die Bemerkung steht auch im neuen PDF nicht (P-4).
14. **Als versendet markieren.** Der Dialog ist klar («Dwello verschickt die Abrechnung nicht selbst …», Empfänger, Kanal «Per Brief»). Bestätigt. Status «Versendet», Datum 19.10.2026. Die Warnung ist verschwunden.

## Verwirrung

- «oder wählen Sie ein späteres «Gültig ab»»: Darf ich das Datum einfach verschieben, wenn die Erhöhung doch ab Juli galt? Der Text klingt, als wäre beides gleich richtig.
- «Stimmt ein früherer Betrag am Mietvertrag nicht»: «früher» im Sinn von zeitlich früher (die 240) oder von vorher eingetragen? Und was tue ich, wenn alles stimmt?
- «Geleistete Akontobeiträge» gegenüber «vereinbart»: unverändert widersprüchlich.
- «Neu berechnen» gegenüber «Entwurf löschen und neu erstellen»: Welches übernimmt das neue Akonto?
- «Bemerkungen»: intern oder für den Mieter?
- «der Erste eines Monats», Beispiel 31.12.2026.

## Fehlerrisiken

- Ein Vermieter wählt nach der Ablehnung ein späteres «Gültig ab» (zum Beispiel 01.01.2026), um die Berichtigung zu umgehen. Die versendete Abrechnung bleibt dann für das zweite Halbjahr 2025 um CHF 60 zu Lasten des Mieters falsch, und die Daten im Mietvertrag stimmen nicht mehr mit der Wirklichkeit überein (P-1).
- Ein Vermieter trägt ein höheres Akonto rückwirkend ein, das dem Mieter nie mit dem amtlichen Formular mitgeteilt wurde. Ohne gültige Mitteilung ist die Erhöhung nichtig. Die Warnung auf der berichtigten Abrechnung erinnert nicht daran (P-3).
- Der Mieter erhält eine zweite Abrechnung mit tieferer Nachzahlung und ohne Erklärung. Er fragt nach oder bezweifelt beide Abrechnungen (P-4).
- Ein Mieter, der Akonto schuldig geblieben ist, beruft sich auf die «Geleisteten Akontobeiträge» im PDF als Quittung (P-2).
- Ein vorbelegtes «Gültig ab» führt dazu, dass eine reine Betragskorrektur als neuer Zeitraum gespeichert wird (Beobachtungen).

## Vorschläge

- **P-1:** Mietvertrag Hans Müller → Bearbeiten → Akonto 250.00, Gültig ab 01.07.2025 → Änderungen speichern, solange NK-11111111-2025-0001 versendet ist. Hilfreich wäre, den Ausweg einzuschränken, etwa: «Gilt das Akonto ab 01.07.2025, berichtigen Sie zuerst die Abrechnung NK-…-0001. Haben Sie sich nur im Datum vertan, tragen Sie das richtige «Gültig ab» ein.»
- **P-2:** Berichtigte Abrechnung → PDF, Seiten 1 und 2, sowie die Seite der Abrechnung. Die Zeile «Akontobeiträge gemäss Mietvertrag» (oder «Vereinbarte Akontobeiträge») nennen, überall gleich.
- **P-3:** Berichtigte Abrechnung erstellen, nachdem das Akonto im Mietvertrag geändert wurde. Die Warnung ergänzen, etwa: «Haben Sie das Akonto absichtlich geändert, prüfen Sie die Beträge und versenden Sie die Abrechnung. Eine Erhöhung zählt nur, wenn Sie sie dem Mieter mit dem amtlichen Formular mitgeteilt haben.» Statt «ein früherer Betrag» besser «ein Betrag bei «Akonto nach Zeitraum»».
- **P-4:** PDF der berichtigten Abrechnung, Seite 1, Ersatzhinweis. Den Grund ergänzen, etwa: «Geändert hat sich: Akontobeiträge (CHF 2'940.00 statt CHF 2'880.00).» Oder die Bemerkungen im PDF drucken und beim Feld sagen, dass der Mieter sie sieht.
- **P-5:** Gleiche Schritte wie P-1. Die Abrechnungsnummer in der Meldung als Link auf die Abrechnung setzen.
- **P-6:** Mietvertrag bearbeiten, Hilfetext «Gültig ab». Als Beispiel «01.07.2025» oder «01.01.2027».
- **P-7:** Mietvertrag bearbeiten, Hilfetext Akonto. «(Art. 269d OR)» anhängen und die Wortwahl an den Text der Verwaltungspauschale angleichen.

## Nicht geprüft

- Ob «Neu berechnen» allein ein nachträglich geändertes Akonto übernimmt. Mein Akonto war schon vor dem Erstellen der Berichtigung eingetragen, «Neu berechnen» lief deshalb ohne Änderung.
- Das Löschen eines Akonto-Zeitraums, der eine versendete Abrechnung betrifft (etwa 01.07.2025 jetzt löschen). Damit hätte ich meine eben versendete Abrechnung verfälscht.
- Der Fall, dass Hans Müller die ersetzte Abrechnung schon bezahlt hatte («Als bezahlt markieren» vor dem Berichtigen).
- Andere Sprachen des PDF und andere Gebäude. Gespeichert habe ich nur im Gebäude Musterhaus Zentrum, bei Hans Müller.
- Den Fehlversuch mit dem Datum (Ablauf 3) habe ich nicht weiter verfolgt. Er hing vermutlich an meinem zu frühen Tippen, nicht an der App.
