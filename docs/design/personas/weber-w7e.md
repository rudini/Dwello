# Dr. Weber – Protokoll unter «Einstellungen» (w7e)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. App: Persona-Stack auf http://localhost:3300, 17.10.2026 (Browserzeit 02:13 UTC).
Aufgabe: Verwaltungspauschale ändern und speichern, danach ohne Änderung erneut speichern; Protokoll prüfen; Datenschutzerklärung zum Protokoll lesen; Löschbestätigung öffnen und abbrechen.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/3eb48ef7-ceb3-5923-ae2d-df5dd75846f5/scratchpad/weber-w7e/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Protokoll, Dialog «Eintrag löschen?» | Bei einer Anmeldung sagt der Dialog «Die Änderung selbst bleibt bestehen.» Eine Anmeldung ist keine Änderung; der Satz passt nur zu Änderungs-Einträgen. |
| P-2 | Minor | Protokoll, Dialog «Eintrag löschen?» und Löschen-Schaltflächen | Der Dialog nennt den Eintrag nur mit seinem Text, ohne Datum und Uhrzeit. Bei gleichlautenden Einträgen (zweimal «Anmeldung mit Google») sehe ich im Dialog nicht, welchen ich lösche. Die Schaltflächen-Namen haben auch kein Datum. |
| P-3 | Minor | Datenschutz und Protokoll | Laut Datenschutzerklärung hält das Protokoll bei Rechnungen, die nicht mehr oder wieder umlagefähig sind, «Rechnungssteller, Beschreibung, Datum, Betrag und Gebäude» fest. Der Eintrag zu «Gartenpflege» zeigt aber nur «2 Rechnungen sind damit nicht mehr umlagefähig», ohne diese Angaben. Entweder steht mehr gespeichert, als ich sehen kann, oder die Erklärung behauptet mehr, als das Protokoll enthält. |
| P-4 | Minor | Datenschutz, Abschnitt «Anmeldung» | Das Protokoll des Servers enthält bei jeder Anmeldung und Sitzungsverlängerung die E-Mail-Adresse. Wie lange es aufbewahrt wird, steht nirgends. Beim Protokoll unter «Einstellungen» ist die Dauer genannt, beim Server-Protokoll fehlt sie. |
| P-5 | Nit | Protokoll | Der Satz steht als «von 4 % auf 3.5 %» im Protokoll, mit Dezimalpunkt. Eingegeben habe ich «3,5»; das wurde angenommen und als «3.5» gespeichert. Im deutschen Fliesstext würde ich «3,5 %» erwarten. |

## Beobachtungen

- Speichern ohne Änderung erzeugt keinen Eintrag. Das ist richtig so, sonst wäre das Protokoll voll von Einträgen ohne Inhalt.
- Die Uhrzeit stimmt mit Schweizer Zeit überein: Ich habe um 02:13 UTC gespeichert, das Protokoll zeigt 04:13, also Sommerzeit am 17.10. Eine Zeitzone steht nicht dabei. Für einen Nachweis würde ich «MESZ» oder Ähnliches begrüssen.
- Die Einträge sind minutengenau. Zwei Änderungen in derselben Minute (3 → 4 und 4 → 3,5, beide 04:13) unterscheidet nur ihre Reihenfolge in der Liste.
- Die Demodaten widersprechen sich: Laut Eintrag vom 08.09.2026 wurde der Satz «von 3 % auf 3.5 %» geändert, vor meiner Änderung stand im Feld aber 3. Mein Eintrag lautet entsprechend «von 3 % auf 4 %». Wer die Kette nachrechnet, findet eine Lücke. Das betrifft die Demodaten, nicht die Funktion.
- In der Kurzbeschreibung auf «Einstellungen» und auf der Protokoll-Seite steht «Anmeldungen und Änderungen, die Ihre Abrechnungen beeinflussen». Gelesen kann das heissen, auch die Anmeldungen beeinflussten die Abrechnungen.
- Zweimal heisst etwas «Protokoll»: das Protokoll unter «Einstellungen» und das «Protokoll des Servers». Die Datenschutzerklärung trennt beide ausdrücklich («ist davon getrennt»); trotzdem muss man genau lesen.
- Das Protokoll unter «Einstellungen» hat keine Höchstdauer, Einträge bleiben, bis ich sie lösche. Das steht klar da. Anmeldungen sammeln sich damit unbegrenzt.
- Im Protokoll standen auch Einträge anderer Personas vom selben Tag (z. B. eine zurückgesetzte Zahlung). Ich habe sie nicht bewertet und nicht angefasst.
- Im ganzseitigen Screenshot des Dialogs reicht die Abdunklung nur bis zur Fensterhöhe. Das kommt vom Screenshot, nicht von der App.

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten, 9 Schritte: Einstellungen öffnen, Protokoll vorher lesen, Satz auf 4 ändern und speichern, unverändert speichern, Protokoll lesen, zusätzlich «3,5» speichern, Datenschutz lesen, Löschdialog öffnen und abbrechen (dreimal, für verschiedene Arten von Einträgen).

## Ablauf

1. **Einstellungen öffnen** (Seitenleiste «Einstellungen», /config). Erwartet: die Verwaltungspauschale als Feld. Gesehen: «Verwaltungspauschale in %» steht auf 3, mit ausführlichem Hilfetext (üblich etwa 3 %, höchstens 10 %). Ganz unten steht der Abschnitt «Protokoll» mit einem Link. (01-einstellungen.png)
2. **Protokoll vorher** (/config/audit-log). Erwartet: eine Liste mit Datum. Gesehen: 5 Einträge aus den Demodaten mit Datum und Uhrzeit und je einer Schaltfläche «Löschen». Der Einleitungssatz sagt «Die Einträge bleiben, bis Sie sie löschen.» (02-protokoll.png)
3. **Satz von 3 auf 4 ändern, speichern.** Erwartet: eine Bestätigung. Gesehen: der Statushinweis «Einstellungen gespeichert – Absender, Verwaltungspauschale, Fristen und Vorschläge gespeichert.»; das Feld zeigt 4. (03-nach-speichern.png)
4. **Ohne Änderung erneut speichern.** Erwartet: dieselbe Bestätigung, aber kein neuer Eintrag. Gesehen: dieselbe Bestätigung. (04-nach-speichern.png)
5. **Protokoll lesen.** Erwartet: genau ein neuer Eintrag mit altem und neuem Satz. Gesehen: «17.10.2026, 04:13 – Vorgeschlagene Verwaltungspauschale von 3 % auf 4 % geändert», kein Eintrag für das unveränderte Speichern. Satz und Uhrzeit stimmen (02:13 UTC = 04:13 MESZ). «Vorgeschlagene» passt zum Hilfetext, nach dem der Wert nur ein Vorschlag für die Abrechnungen ist. (05-protokoll.png)
6. **Zusatzprüfung: «3,5» mit Komma eingeben, speichern.** Erwartet: dass das Komma angenommen wird. Gesehen: angenommen, das Feld zeigt danach «3.5». Im Protokoll steht «von 4 % auf 3.5 % geändert», ebenfalls 04:13. (06-nach-speichern.png, 07-protokoll.png)
7. **Datenschutz** (Fusszeile, /privacy). Erwartet: was das Protokoll enthält, wozu und wie lange. Gesehen:
   - Inhalt: Anmeldungen mit dem Anbieter, ohne Name und E-Mail-Adresse. Dazu Änderungen der Verwaltungspauschale und der Umlagefähigkeit, betroffene Rechnungen mit Rechnungssteller, Beschreibung, Datum, Betrag und Gebäude, sowie zurückgesetzte Zahlungen.
   - Zweck: «Damit Sie später nachvollziehen können, was sich geändert hat».
   - Dauer: «bis Sie sie im Protokoll löschen», auch wenn die Rechnung gelöscht ist.
   - Abgrenzung: «Das Protokoll des Servers (siehe «Anmeldung») ist davon getrennt.» Unter «Anmeldung» steht, dass dort die E-Mail-Adresse festgehalten wird, aber nicht, wie lange (P-4).
   Das Protokoll selbst zeigt keine Rechnungsangaben (P-3). (08-datenschutz.png)
8. **Löschen öffnen, abbrechen** (beim Eintrag «von 4 % auf 3.5 %»). Erwartet: eine Bestätigung, die die Folge nennt. Gesehen: Dialog «Eintrag löschen?»: «Dieser Eintrag wird endgültig aus dem Protokoll gelöscht: … Die Änderung selbst bleibt bestehen. Das lässt sich nicht rückgängig machen.» Der Fokus liegt auf «Abbrechen», «Löschen» ist rot. Nach «Abbrechen» ist der Eintrag noch da. Das ist gut: Der Dialog sagt klar, dass nur der Nachweis verschwindet und nicht der Satz. (09-loeschen-dialog.png)
9. **Dasselbe bei «Anmeldung mit Google» und dem Gartenpflege-Eintrag, mit Esc geschlossen.** Gesehen: Auch bei der Anmeldung steht «Die Änderung selbst bleibt bestehen.» (P-1). Datum und Uhrzeit fehlen im Dialog (P-2). Nach Esc kehrt der Fokus auf die Löschen-Schaltfläche des Eintrags zurück. (10-dialog.png, 11-dialog.png)

## Verwirrung

- «Vorgeschlagene Verwaltungspauschale»: zuerst irritierend, weil das Feld in den Einstellungen nur «Verwaltungspauschale in %» heisst. Der Hilfetext («Vorschlag beim Erstellen der Abrechnungen») klärt es. Hilfreich wäre es, wenn die Überschrift in den Einstellungen das Wort «Vorschlag» auch trüge.
- «Protokoll» gegenüber «Protokoll des Servers»: zwei Dinge mit einem Wort.
- «Die Änderung selbst bleibt bestehen» bei einer Anmeldung: Welche Änderung?

## Fehlerrisiken

- Zwei gleichlautende Einträge, Dialog ohne Datum: Man löscht leicht den falschen Nachweis, und das lässt sich nicht rückgängig machen (P-2).
- Wer das Protokoll als Nachweis gegenüber einem Mieter nutzen will, sieht bei Umlagefähigkeits-Einträgen nicht, welche Rechnungen betroffen waren, obwohl die Datenschutzerklärung das verspricht (P-3).
- Ohne Zeitzone und ohne Sekunden ist die Reihenfolge mehrerer Änderungen in derselben Minute nur aus der Listenreihenfolge ablesbar.

## Vorschläge

- **P-1:** Protokoll öffnen, bei «Anmeldung mit Google» auf «Löschen» klicken. Der Dialog sagt «Die Änderung selbst bleibt bestehen.» Hilfreich: Den Satz nur bei Änderungs-Einträgen zeigen. Bei Anmeldungen genügt «Dieser Eintrag wird endgültig aus dem Protokoll gelöscht. Das lässt sich nicht rückgängig machen.»
- **P-2:** Protokoll mit zwei Einträgen «Anmeldung mit Google» öffnen, bei einem auf «Löschen» klicken. Der Dialog nennt kein Datum. Hilfreich: Datum und Uhrzeit des Eintrags in den Dialogtext und in den Namen der Schaltfläche aufnehmen («Eintrag vom 27.09.2026, 04:10 löschen»).
- **P-3:** Protokoll öffnen, Eintrag «Kategorie «Gartenpflege»: von umlagefähig auf nicht umlagefähig geändert; 2 Rechnungen …» lesen, dann Datenschutz lesen. Hilfreich: die betroffenen Rechnungen (Rechnungssteller, Datum, Betrag, Gebäude) beim Eintrag zeigen, etwa aufklappbar. Oder, falls nichts davon gespeichert wird, die Datenschutzerklärung anpassen. Zu prüfen ist, ob der Demo-Eintrag nur ohne Rechnungsangaben angelegt wurde (siehe «Nicht geprüft»).
- **P-4:** Datenschutz, Abschnitt «Anmeldung», lesen. Hilfreich: ein Satz, wie lange das Server-Protokoll aufbewahrt wird oder wer das festlegt (der Betreiber).
- **P-5:** In «Einstellungen» «3,5» eingeben und speichern, dann das Protokoll öffnen. Dort steht «3.5 %». Hilfreich: Prozentsätze im deutschen Text mit Dezimalkomma zeigen, im Feld wie im Protokoll.

## Nicht geprüft

- Ob ein neu erzeugter Umlagefähigkeits-Eintrag die betroffenen Rechnungen zeigt (P-3): Dafür hätte ich eine Kategorie ändern müssen. Die Aufgabe erlaubt Speichern nur in den Einstellungen.
- Ob Änderungen von Absender, Fristen oder Vorschlägen protokolliert werden: Laut Datenschutzerklärung nicht. Ich habe nur die Verwaltungspauschale geändert.
- Das tatsächliche Löschen eines Eintrags: Laut Aufgabe nur öffnen und abbrechen.
- Der Inhalt und die Aufbewahrung des Server-Protokolls: Von der Oberfläche aus nicht einsehbar.
- Andere Sprachen und mobile Ansicht: nicht Teil von Dr. Webers Profil.
