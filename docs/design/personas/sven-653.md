# Sven – Dialoge (Branch w-653)

Persona: Sven, 45, blind, Screenreader und nur Tastatur, Desktop 1440 × 900. Urteil nach dem Accessibility-Baum (Name, Beschreibung, Fokus). Gespeichert habe ich nur in «Musterhaus Zentrum». Für den einen Mausklick in Aufgabe 1 hat mich der Auftrag ausdrücklich gebeten.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Mietvertrag, Dialog «Mietvertrag beenden» | Die Beschreibung des Dialogs zeigt auf die Zeile «Datum in Worten» des Felds Vertragsende. Beim Öffnen ist sie leer, also höre ich nur den Titel. Nach der Eingabe lautet sie «Donnerstag, 31. Dezember 2026», das höre ich aber schon beim Feld. Die eigentlich wichtigen Hinweise (Kündigungsfrist, «Ein neuer Mietvertrag kann am Tag danach beginnen», der Absatz zum Tod des Mieters) liegen hinter den Feldern. Mit Tab erreiche ich sie nicht, und vorgelesen werden sie auch nicht. |
| P-2 | Minor | Nebenkostenabrechnungen, Liste mit Filter, nach «Als bezahlt markieren» | Nach dem Speichern steht der Fokus auf der Überschrift «Keine Abrechnungen gefunden», danach kommt «Versuchen Sie, Ihre Filter anzupassen». Die Statusmeldung «Abrechnung NK-11111111-2025-0001 als bezahlt markiert» kommt zwar. Gleichzeitig kommt aber assertiv der Seitentitel, und der Text am Fokus klingt nach einem Fehler, obwohl alles geklappt hat. |

## Beobachtungen

- Im Auftrag steht «Abrechnung korrigieren». In der App heisst die Schaltfläche und der Dialog «Abrechnung berichtigen». Der Dialog «Rechnung löschen» verweist ebenfalls auf «Abrechnung berichtigen», das passt also zusammen.
- Der Filter «Versendet» zeigte für Musterhaus Zentrum nichts («0 Versendet», «Keine Abrechnungen gefunden»). Die versendete Abrechnung von Hans Müller (NK-11111111-2025-0001) stand unter «1 Überfällig», denn ihre Zahlungsfrist am 28.10.2026 war abgelaufen. Für mich ist eine überfällige Abrechnung auch eine versendete. Ich habe darum über «Überfällig» gefiltert. Später stand die Zählung auf «1 Versendet» und «6 Entwurf». Das hat eine andere Persona versendet, nicht ich.
- Nach dem Beenden zeigt die Mietvertragsseite «Vertragsende: Unbefristet, gekündigt auf den 31.12.2026» und weiter oben «Laufend». Das stimmt, «Unbefristet» neben einem Enddatum klingt aber zuerst widersprüchlich.
- Die Beschreibung des Dialogs «Als bezahlt markieren» lautet nur «Danach können Sie keine Mahnung mehr senden.». Für welche Abrechnung es gilt («NK-11111111-2025-0001, Hans Müller: Nachzahlung CHF 215.80»), steht nicht in der Beschreibung. Ich weiss es nur, weil der Name der Schaltfläche in der Liste es sagte.
- Bei «Rechnung löschen» ist die Beschreibung nur der erste Absatz. Den Hinweis «Rechnung schon abgerechnet» mit den vier Abrechnungen samt Status (eine davon «Überfällig») und die Anleitung zum Neuberechnen höre ich nur, wenn ich den Dialog selbst durchlese. Mit Tab komme ich nur zu den zwei Schaltflächen.
- Im Dialog «Mietvertrag beenden» wird das Datum in Worten erst angesagt, wenn ich das Feld verlasse. Während ich tippe, bleibt die Zeile leer.
- Bei Escape geht der Fokus jedes Mal auf die Schaltfläche zurück, die den Dialog geöffnet hat. In allen Dialogen bleibt der Fokus beim Tabben im Dialog gefangen. Gut so.
- Auf der Abrechnungsseite brauchte ich 44 Mal Tab bis «Abrechnung berichtigen». Es kommt nach der ganzen Kostentabelle mit den Rechnungslinks.

## Aufgabe geschafft: ja

## Aufwand

Etwa 20 Minuten und 18 Skriptläufe. Im Dialog «Mietvertrag beenden» habe ich einmal gespeichert (Maria Rossi, 3.01) und einmal abgebrochen (Hans Müller, 1.01). «Rechnung löschen» habe ich einmal abgebrochen. «Als bezahlt markieren» habe ich einmal gespeichert. «Abrechnung berichtigen» habe ich dreimal geöffnet und jedes Mal abgebrochen.

## Ablauf

1. **Mietvertrag beenden, Fokus beim Öffnen.** Erwartet hatte ich den Titel, dann eine Beschreibung mit der Folge, dann den Fokus im ersten Feld. So war es: Titel «Mietvertrag von Maria Rossi, Wohnung 3.01, beenden?», Fokus im Feld «Vertragsende» (leer) mit seiner langen Hilfe. Die Beschreibung des Dialogs war aber leer (P-1).
2. **Mietvertrag beenden, Tab-Reihenfolge.** Wie erwartet: Vertragsende, «Kalender für Vertragsende öffnen», «Kündigung erhalten am (optional)», «Kalender für Kündigung erhalten am öffnen», «Abbrechen», «Mietvertrag beenden», dann wieder Vertragsende. Mit Shift+Tab gehts sauber zurück.
3. **Mietvertrag beenden, «31.12.26» tippen und mit der Maus auf «Mietvertrag beenden» klicken.** Ich hatte befürchtet, dass das zweistellige Jahr ohne Verlassen des Felds verloren geht. Das passierte nicht: Gesendet wurde `endDate=2026-12-31`, der Dialog ging zu, und der Fokus stand auf der Überschrift «Mietvertrag von Maria Rossi». Danach kamen «Nächste Schritte» mit «Der Mietvertrag ist gekündigt …». Das Datum wurde übernommen, auf der Seite steht «gekündigt auf den 31.12.2026». Eine eigene Statusmeldung habe ich nicht gehört. Die neue Überschrift «Nächste Schritte» genügt mir aber.
4. **Rechnung löschen (ewz, Allgemeinstrom Q4 2025, in vier Abrechnungen enthalten).** Erwartet und so gehört: Fokus auf «Abbrechen», Beschreibung «Die Rechnung von ewz über CHF 230.10 wird gelöscht. Sie fliesst dann in keine neue Nebenkostenabrechnung mehr ein. Das lässt sich nicht rückgängig machen.». Dass die Rechnung schon abgerechnet ist, steht nicht in der Beschreibung (siehe Beobachtungen).
5. **Filter «Versendet».** Erwartet hatte ich die Abrechnung von Musterhaus Zentrum. Gesehen habe ich «Keine Abrechnungen gefunden». Sie stand unter «Überfällig» (siehe Beobachtungen).
6. **Als bezahlt markieren, Dialog.** Fokus im Feld «Bezahlt am» mit dem Wert 04.11.2026, die Hilfe endet mit «Mittwoch, 4. November 2026». Beschreibung: «Danach können Sie keine Mahnung mehr senden.». Danach Tab: Kalender, «Bezahlter Betrag» 215.80, «Abbrechen», «Als bezahlt markieren». Das war wie erwartet.
7. **Als bezahlt markieren, Speichern mit Enter.** Erwartet hatte ich, dass die Statusmeldung angesagt wird und der Fokus an einer sinnvollen Stelle steht. Die Statusmeldung kam («Abrechnung NK-11111111-2025-0001 als bezahlt markiert»), assertiv kam aber auch «Nebenkostenabrechnungen - Dwello». Der Fokus stand auf «Keine Abrechnungen gefunden», weil der Filter «Überfällig» jetzt leer ist (P-2).
8. **Abrechnung berichtigen (NK-11111111-2025-0001, jetzt Bezahlt).** Fokus auf «Abbrechen». Beschreibung: «Die Abrechnung NK-11111111-2025-0001 wird durch eine berichtigte Abrechnung ersetzt. Die bisherige bleibt unverändert erhalten. Die berichtigte Abrechnung rechnet die CHF 215.80 an, die am 04.11.2026 bezahlt wurden. Das lässt sich nicht rückgängig machen.». Das ist genau die Folge, die ich hören will.
9. **Zweites Enter gleich nach dem Öffnen.** Erwartet hatte ich, dass es nichts Gefährliches tut. Es löst «Abbrechen» aus: Der Dialog geht zu, der Fokus steht wieder auf «Abrechnung berichtigen», und es geht keine Anfrage an den Server. Zweimal Enter ohne Pause hatte das gleiche Ergebnis, es wurde also nichts berichtigt.

## Vorschläge

- **P-1:** So stellt man es nach: Mietverträge, «Maria Rossi» (oder ein anderer laufender Vertrag in Musterhaus Zentrum) öffnen, «Beenden», dann die Beschreibung des Dialogs anhören: Sie ist leer. Nach der Eingabe eines Datums und Tab lautet sie nur das Datum in Worten. Als Beschreibung des Dialogs hätte ich gern einen kurzen Satz mit der Folge, etwa «Der Mietvertrag läuft bis und mit dem Vertragsende; danach können Sie einen neuen Mietvertrag für die Wohnung erfassen.» Die Zeile «Datum in Worten» soll nur beim Feld bleiben. Die Hinweise zur Frist und zum Todesfall sollten vor den Schaltflächen erreichbar sein, oder kurz in der Beschreibung stehen.
- **P-2:** So stellt man es nach: Nebenkostenabrechnungen, Filter «Überfällig» (oder «Versendet», wenn dort die einzige Abrechnung steht), «Als bezahlt markieren», «Als bezahlt markieren» bestätigen. Der Fokus steht dann auf «Keine Abrechnungen gefunden / Versuchen Sie, Ihre Filter anzupassen». Mir würde helfen, wenn der Fokus auf der Erfolgsmeldung oder der Listenüberschrift stünde, wenn der Seitentitel nach einer Aktion auf derselben Seite nicht nochmals assertiv käme, und wenn eine Liste, die durch die eigene Aktion leer wird, etwa «Keine überfälligen Abrechnungen mehr» sagte statt «Filter anpassen».

## Nicht geprüft

- Der Kalender-Knopf in den Datumsfeldern: Ich habe ihn nur in der Tab-Reihenfolge gehört, nicht geöffnet. Er war nicht Teil des Auftrags.
- Eine Fehlermeldung im Dialog «Mietvertrag beenden», etwa bei einem Datum vor Vertragsbeginn. Das gehörte nicht zum Auftrag, und der Vertrag von Maria Rossi ist inzwischen gekündigt.
- Wie sich «Abrechnung berichtigen» bestätigt anhört: Ich habe es dreimal geöffnet und jedes Mal abgebrochen, wie verlangt.
- Echte Screenreader (NVDA, VoiceOver): Ich urteile nur nach dem Accessibility-Baum von Chromium und den Live-Regionen, die ich mitgeschnitten habe.
