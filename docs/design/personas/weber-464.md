# Dr. Weber – Akonto-Erhöhung nachtragen und Abrechnung 2025 berichtigen (#464)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. App: Persona-Stack http://localhost:3300 (Deutsch), gespeichert nur im Gebäude «Musterhaus Zentrum».
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/94137d46-12c2-5dda-bd7d-6f5cd855db5e/scratchpad/weber-464/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Blocker | Mietvertrag bearbeiten | Es gibt kein Feld «Gültig ab», obwohl der Hilfetext beim Akonto und der Hinweis oben auf der Seite zweimal darauf verweisen. Ein neues Akonto lässt sich daher nicht ab einem Datum erfassen. |
| P-2 | Blocker | Mietvertrag bearbeiten | Speichern scheitert immer, auch ohne jede Änderung: «Der Mietvertrag wurde nicht gespeichert. Beim Speichern ist ein Fehler aufgetreten. Versuchen Sie es später erneut.» Das Backend antwortet mit 400 und einem internen JavaScript-Fehler (`undefined is not an object (evaluating '[...sorted].reverse().find(... entry.validFrom <= day).amount')`). Die Meldung sagt weder, was passiert ist, noch, was ich tun soll. |
| P-3 | Major | Abrechnung (Seite und PDF), Hilfe | Die Zeile heisst «Geleistete Akontobeiträge». Der Hilfetext beim Akonto und der Hinweis im PDF sagen aber, dass das *vereinbarte* Akonto abgezogen wird, nicht das bezahlte. Für einen Mieter, der Akonto nicht bezahlt hat, behauptet das PDF damit eine Zahlung, die er nie geleistet hat. Das Glossar in der Hilfe («minus seine geleisteten Akontobeiträge») widerspricht dem ebenso. |
| P-4 | Minor | Berichtigte Abrechnung (Entwurf) | Die berichtigte Abrechnung NK-11111111-2025-0005 hat genau die Beträge der ersetzten (Nachzahlung CHF 215.80, 12 × CHF 240.00). Eine Warnung, dass sich nichts geändert hat oder dass das Akonto noch nicht stimmt, gibt es nicht. «Als versendet markieren» steht trotzdem bereit. |
| P-5 | Minor | Hilfetext Akonto | Die Rechtsgrundlage fehlt (Art. 269d OR), die bei der Verwaltungspauschale direkt darunter steht. Die beiden Texte sind auch sonst nicht einheitlich: «10 Tage» gegenüber «zehn Tage», «nächsten Kündigungstermin» gegenüber «nächstmöglichen Kündigungstermin». |
| P-6 | Nit | PDF, Hinweise | «Haben Sie Akontobeiträge nicht bezahlt, regeln wir das ausserhalb dieser Abrechnung.» Das ist korrekt, sagt dem Mieter aber nicht, dass er die fehlenden Beiträge weiterhin schuldet. Das «wir» passt auch nicht zu jedem privaten Vermieter. |

## Beobachtungen

- Ist eine Abrechnung ersetzt, zeigt die Seite des Mietvertrags «4 Abrechnungen fehlen» mit «2025 abrechnen». Dass für 2025 eine Berichtigung wartet («Berichtigte Abrechnung erstellen» auf der ersetzten Abrechnung), steht dort nicht. Ein unerfahrener Vermieter startet so leicht einen neuen Abrechnungslauf statt der Berichtigung.
- Der Dialog «Abrechnung berichtigen» ist gut: Er sagt, was mit der alten Abrechnung geschieht, dass man nicht zurück kann und was man vorher tun muss («Hat der Mieter schon bezahlt, markieren Sie sie zuerst als bezahlt»). Der Hinweis auf die Verjährung (Art. 128 Ziff. 1 OR, Beginn nicht einheitlich geklärt) ist vorsichtig und ehrlich formuliert.
- Die ersetzte Abrechnung zeigt den klaren Hinweis «Diese Abrechnung ist ersetzt …» samt den Links «Mietvertrag öffnen» und «Berichtigte Abrechnung erstellen». Der Weg ist also gut beschrieben.
- Das PDF der Berichtigung sagt oben «Diese Abrechnung ersetzt die Abrechnung NK-11111111-2025-0001 vom 28.09.2026 … Bezahlen Sie nur noch den Saldo dieser Abrechnung.» Das ist gut. Hat der Mieter die alte Abrechnung aber schon bezahlt, verrechnet das PDF das nicht. Der Satz würde ihn dann zu einer zweiten Zahlung auffordern. Der Dialog weist den Vermieter zwar darauf hin, das PDF selbst aber nicht.
- In der Aufschlüsselung des PDF steht «12 Monate × CHF 240.00 (01.01.2025 – 31.12.2025)». Mit diesem Format liesse sich ein Wechsel ab 01.07. gut darstellen (6 × 240, 6 × 250). Prüfen konnte ich es nicht (P-1, P-2).
- Die Hilfe definiert «Nettomiete» als «die monatliche Grundmiete ohne Nebenkosten, auch Mietzins genannt». Rechtlich umfasst der Mietzins auch die Nebenkosten (Art. 257 OR). Das gehört nicht zu dieser Änderung.
- Inhaltlich halte ich die Aussagen zur Akonto-Erhöhung für korrekt: Sie gilt frühestens auf den nächsten Kündigungstermin, braucht eine Begründung und das amtliche Formular, muss mindestens 10 Tage vor Beginn der Kündigungsfrist beim Mieter sein und ist sonst nichtig. «Gültig ab» ist der Tag nach dem Kündigungstermin, und für eine Senkung genügt eine schriftliche Mitteilung. In meinem Fall, Erhöhung ab 01.07.2025, passt das zu einem Kündigungstermin am 30.06.

## Aufgabe geschafft: nein

Ich bin dreimal beim selben Schritt gescheitert: das neue Akonto ab 01.07.2025 im Mietvertrag erfassen und speichern (P-1, P-2). Die berichtigte Abrechnung habe ich erstellt und ihr PDF gelesen. Sie enthält aber noch das alte Akonto, und so würde ich sie nicht versenden.

## Aufwand

Etwa 25 Minuten, 17 Durchgänge (Skripte). Drei Versuche, im Mietvertrag zu speichern (vor und nach dem Ersetzen der Abrechnung), einer davon ganz ohne Änderung.

## Ablauf

1. **Übersicht.** Erwartet: einen Weg zu Hans Müller. Gesehen: die Frist «28.10.2026 Zahlungsfrist · Hans Müller», den Menüpunkt Mietverträge. Wie erwartet.
2. **Mietvertrag von Hans Müller.** Erwartet: das Akonto mit seinem Verlauf. Gesehen: «Akonto CHF 240.00», ohne Verlauf und ohne Hinweis auf eine Änderung.
3. **Bearbeiten.** Erwartet: ein Feld für das neue Akonto und ein Datum, ab wann es gilt. Gesehen: oben «Ein neues Akonto gilt ab dem Tag, den Sie dazu eintragen». Der Hilfetext beim Akonto nennt zweimal «Gültig ab». Ein solches Feld gibt es aber nicht, auch nicht, nachdem ich 250.00 eingetippt und das Feld verlassen habe (Screenshot `05-akonto-area.png`: Akonto 250.00, direkt darunter folgt die Nebenkostenpauschale). Auch im Accessibility-Tree fehlt es.
4. **Speichern (Versuch 1–3).** Erwartet: eine Rückfrage nach dem Datum, oder das Akonto gilt ab heute. Gesehen: rote Meldung «Der Mietvertrag wurde nicht gespeichert …» (`06-after-save.png`). Im Netzwerk: PUT `/api/contracts/…` → 400 mit internem Fehlertext. Der Request enthält kein Datum. Ohne Änderung kommt dieselbe Meldung.
5. **Abrechnung NK-11111111-2025-0001 (Versendet).** Erwartet: eine Möglichkeit zum Berichtigen. Gesehen: unter «Weitere Aktionen» die Schaltfläche «Abrechnung berichtigen». Die Zeile «Geleistete Akontobeiträge − CHF 2’880.00» ergibt 12 × 240.
6. **Dialog «Abrechnung berichtigen».** Klarer Text (siehe Beobachtungen). Bestätigt.
7. **Ersetzte Abrechnung.** Gesehen: Status «Ersetzt», der Hinweis «Stimmen Vertragsdaten oder Rechnungen nicht, korrigieren Sie sie jetzt …» und «Mietvertrag öffnen». Genau das habe ich erwartet.
8. **Mietvertrag erneut bearbeiten.** Gleicher Fehler wie in Schritt 4 (`12-edit-after-replace.png`). Auf der Seite des Mietvertrags steht jetzt «4 Abrechnungen fehlen» mit «2025 abrechnen».
9. **Berichtigte Abrechnung erstellen.** Neuer Entwurf NK-11111111-2025-0005, «Ersetzt die Abrechnung NK-11111111-2025-0001 vom 28.09.2026». Beträge unverändert, neue Zahlungsfrist 18.11.2026. Erwartet hatte ich eine Warnung, dass sich nichts geändert hat. Es kam keine (P-4).
10. **PDF erstellen und lesen.** Seite 1: Ersatzhinweis, Nachzahlung CHF 215.80, «Ihre Nebenkosten CHF 3'095.82 – Geleistete Akontobeiträge CHF 2'880.00». Seite 2: «Geleistete Akontobeiträge – 2'880.00 / 12 Monate × CHF 240.00 (01.01.2025 – 31.12.2025)». Bei den Hinweisen: «Abgezogen sind die Akontobeiträge, die im Mietvertrag vereinbart sind. Haben Sie Akontobeiträge nicht bezahlt, regeln wir das ausserhalb dieser Abrechnung.» Der Widerspruch zwischen der Bezeichnung «Geleistete» und dem Hinweistext ist P-3. Seite 3: QR-Zahlteil über CHF 215.80.

## Verwirrung

- «Gültig ab»: ein Begriff, auf den die Hilfe verweist, den ich auf dem Bildschirm aber nirgends finde.
- «Geleistete Akontobeiträge» gegenüber «vereinbartes Akonto»: Was zieht Dwello denn nun ab? Ich muss erst den Hinweis ganz unten im PDF lesen, um zu verstehen, dass «geleistet» hier nicht «bezahlt» heisst.
- «Versuchen Sie es später erneut»: Später geht es auch nicht. Das ist kein vorübergehender Fehler.
- «4 Abrechnungen fehlen / 2025 abrechnen» auf dem Mietvertrag, während eine Berichtigung offen ist: Soll ich nun neu abrechnen oder berichtigen?

## Fehlerrisiken

- Ein Vermieter erstellt und versendet die berichtigte Abrechnung mit dem alten Akonto, weil keine Warnung kommt (P-4). Für die zweite Jahreshälfte 2025 rechnet sie dann CHF 60 zu wenig Akonto an. Der Mieter erhielte eine zweite Abrechnung, die genau gleich ist wie die erste.
- Ein Vermieter trägt das neue Akonto (sobald Speichern wieder geht) ohne Datum ein. Dann gilt es womöglich rückwirkend für das ganze Jahr oder ab heute. Ohne Feld «Gültig ab» lässt sich das nicht steuern.
- Ein Mieter, der Akonto schuldig geblieben ist, liest «Geleistete Akontobeiträge CHF 2'880.00». Das ist eine Quittung für Geld, das er nicht bezahlt hat. In einem Streit über die fehlenden Beiträge kann er sich darauf berufen.
- Ein Mieter, der die ersetzte Abrechnung schon bezahlt hat, liest «Bezahlen Sie nur noch den Saldo dieser Abrechnung» und zahlt ein zweites Mal.

## Vorschläge

- **P-1:** Mietvertrag Hans Müller → Bearbeiten → Akonto 250.00 eintippen, Feld verlassen: Ein Feld «Gültig ab» erscheint nicht. Hilfreich wäre ein Datumsfeld «Gültig ab» direkt unter dem Akonto, mit Pflicht bei einer Änderung, als Vorschlag der Tag nach dem nächsten Kündigungstermin und einem Beispiel (01.07.2025). Auf der Seite des Mietvertrags sollte der Verlauf stehen («CHF 240.00 bis 30.06.2025, CHF 250.00 ab 01.07.2025»).
- **P-2:** Mietvertrag Hans Müller → Bearbeiten → ohne Änderung «Änderungen speichern»: 400, generische Meldung. Hilfreich wäre, dass das Speichern funktioniert. Eine Ablehnung des Backends sollte eine Meldung haben, die sagt, was fehlt (zum Beispiel «Tragen Sie ein, ab wann das neue Akonto gilt»), statt «Versuchen Sie es später erneut».
- **P-3:** Abrechnung NK-11111111-2025-0005 → PDF, Seiten 1 und 2 sowie Abrechnungsseite und Hilfe-Glossar «Saldo». Die Zeile «Akontobeiträge gemäss Mietvertrag» (oder «Vereinbarte Akontobeiträge») nennen, und zwar überall gleich: Seite, PDF und Hilfe.
- **P-4:** Abrechnung berichtigen → Berichtigte Abrechnung erstellen, ohne dass sich Vertrag oder Rechnungen geändert haben. Eine sichtbare Warnung auf dem Entwurf: «Die berichtigte Abrechnung hat dieselben Beträge wie NK-…-0001. Haben Sie Vertragsdaten oder Rechnungen korrigiert? Danach: Neu berechnen.»
- **P-5:** Mietvertrag bearbeiten, Hilfetext Akonto. «(Art. 269d OR)» anhängen und die Formulierungen an den Text der Verwaltungspauschale angleichen (einheitlich «10 Tage» oder «zehn Tage», einheitlich «nächstmöglichen Kündigungstermin»).
- **P-6:** PDF, Hinweise. Etwa: «Abgezogen sind die im Mietvertrag vereinbarten Akontobeiträge. Nicht bezahlte Akontobeiträge schulden Sie weiterhin; sie werden separat eingefordert.»

## Nicht geprüft

- Wie Dwello ein Akonto mit Datum (240 bis 30.06., 250 ab 01.07.2025) in der berichtigten Abrechnung und im PDF zeigt und welche Warnung dann erscheint. Ich konnte das Akonto nicht speichern (P-1, P-2).
- Ob nach einer Korrektur am Vertrag «Neu berechnen» auf dem Entwurf die neuen Akontozeilen übernimmt. Aus demselben Grund nicht geprüft.
- Den Entwurf NK-11111111-2025-0005 habe ich nicht als versendet markiert, weil ich ihn so nicht versenden würde. Er bleibt als Entwurf im Gebäude Musterhaus Zentrum, und die Abrechnung NK-11111111-2025-0001 ist ersetzt.
- Ob der Fehler aus P-2 auch andere Mietverträge betrifft. Ich habe nur im Gebäude Musterhaus Zentrum und nur bei Hans Müller gespeichert.
