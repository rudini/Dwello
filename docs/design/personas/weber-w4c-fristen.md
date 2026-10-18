# Dr. Weber – Zahlungsfristen und Mahnungen (w4c-fristen)

Persona: Dr. Weber, 52, rechtlich vorsichtig, liest alles. Desktop 1440 × 900, Maus, Sprache Deutsch. App: http://localhost:3300 (Persona-Stack, Demodaten). Nur angesehen, nichts gespeichert (keine POST-Anfrage abgesetzt; der Mahnungsdialog wurde geöffnet und ohne Bestätigung geschlossen).
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/1d798145-76bc-59e3-a308-cd244ffd6342/scratchpad/weber-w4c-fristen/`.

Prüfzeitpunkt: Server und Browser 16.10.2026, 23:18 UTC, also 17.10.2026, 01:18 Schweizer Zeit.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Einstellungen, «Mahnfrist (Tage)» | Die Hilfe sagt allgemein «Überfällig ist die Abrechnung schon ab dem Tag nach der Zahlungsfrist; mahnen können Sie ab dann». Das Feld «Zahlungsfrist» gleich darüber gilt aber ausdrücklich auch für Rückerstattungen («oder Sie überweisen eine Rückerstattung»). Bei einer Rückerstattung schulde ich als Vermieter das Geld. Der Satz schränkt «überfällig» und «mahnen» nicht auf Nachzahlungen ein. |
| P-2 | Minor | Einstellungen, «Mahnfrist (Tage)» | Der Begriff «Mahnfrist» bedeutet in der Schweizer Praxis meist die Frist *in* einer Mahnung (die Nachfrist, die man dem Mieter setzt). Hier heisst er die Wartezeit, bis die Übersicht eine Mahnung vorschlägt. Die Hilfe erklärt das zwar, aber die Bezeichnung des Feldes führt in die Irre. Dazu kommt: «Die nächste Mahnung schlägt die Übersicht nach der Zahlungsfrist der letzten Mahnung vor.» Wie lang diese Zahlungsfrist der Mahnung ist, steht nirgends (nicht in den Einstellungen und nicht im Mahnungsdialog). |
| P-3 | Minor | Übersicht, «Fristen» | Die Zeile «06.10.2026 · Zahlungsfrist · Hans Müller · seit 11 Tagen abgelaufen» ist rot markiert. «Als Nächstes zu tun» enthält aber keine Aufgabe zu dieser überfälligen Abrechnung. Das stimmt zwar mit den Einstellungen überein (Mahnfrist 14 Tage, Vorschlag also erst ab etwa 20./21.10.2026), doch die Übersicht sagt weder, dass ich jetzt schon mahnen darf, noch wann sie eine Mahnung vorschlagen wird. Die Unterzeile «welche Fristen anstehen» passt nicht zu einer abgelaufenen Frist. |
| P-4 | Minor | Abrechnung NK-11111111-2025-0001, Dialog «Mahnung senden»; Hilfe | Die Begriffe wechseln: Der Knopf heisst «Mahnung senden», der Dialog spricht von «Zahlungserinnerung» und der Bestätigungsknopf heisst «Zahlungserinnerung senden». Juristisch sind beide Wörter eine Mahnung im Sinn von Art. 102 OR, aber der Laie erkennt das nicht. Zudem «sendet» der Knopf nichts: Laut Dialog erstellt Dwello nur ein PDF unter «Dokumente», das ich selbst per Post schicke. Die Hilfe sagt dagegen: «Sie geht je nach Korrespondenzkanal des Mieters per E-Mail oder als Brief.» Hans Müller hat eine E-Mail-Adresse, der Dialog spricht trotzdem nur von der Post. Die Hilfe widerspricht damit dem Dialog. |
| P-5 | Nit | Einstellungen, «Mahnfrist (Tage)» | «mahnen können Sie ab dann» ist vorsichtig formuliert, rechtlich aber zu eng: Nach Art. 102 Abs. 1 OR darf man mahnen, sobald die Forderung fällig ist. Die Zahlungsfrist ist eher ein Entgegenkommen gegenüber dem Mieter (Einsicht in die Belege, Art. 257b Abs. 2 OR). Der Vermieter wird dadurch nicht geschädigt, die Aussage ist nur ungenau. |
| P-6 | Nit | Übersicht, «Vermietete Wohnungen pro Gebäude» | «Die Nebenkosten einer leeren Wohnung tragen Sie als Vermieter.» Das ist sachlich richtig (Leerstandskosten kann man nicht auf die anderen Mieter überwälzen). Es gilt aber ebenso für eine «gesperrte» Wohnung und für eine «Vermietet ab …»-Wohnung vor dem Vertragsbeginn. Der Satz nennt nur «leer». |

## Beobachtungen

- Die Zahlen stimmen: Übersicht 13 Wohnungen, 9 vermietet, 4 leer. Pro Gebäude 4/6 + 3/4 + 2/3 = 9 vermietet, und leer sind 2.02, 3.02, B1 und OG2 = 4. Die Seite «Musterhaus Zentrum» bestätigt «6, davon 4 vermietet und 2 leer» (2.02 und 3.02 leer).
- «seit 11 Tagen abgelaufen»: 06.10. bis 17.10.2026 (Schweizer Zeit) sind 11 Tage, das ist richtig. Nach UTC-Datum (16.10.) wären es 10 Tage. Dwello rechnet offensichtlich in Schweizer Zeit.
- Die Demo-Abrechnung von Hans Müller hat das Abrechnungsdatum und den Versand am 28.09.2026 und die Zahlungsfrist 06.10.2026. Das sind nur 8 Tage, obwohl die Vorgabe 30 Tage sind. Das ist rechtlich heikel: Der Mieter hat Anspruch auf Einsicht in die Belege, und eine so kurze Frist dürfte vor der Schlichtungsbehörde kaum als angemessen gelten. Vermutlich ein Effekt der Demodaten.
- Der «Verlauf» der Abrechnung zeigt «Erstellt 17.10.2026, 01:16» und «PDF erstellt 17.10.2026, 01:16», aber «Versendet 28.09.2026». Die Abrechnung wäre also vor ihrer Erstellung versendet worden. Ebenfalls Demodaten, wirkt aber unglaubwürdig.
- Die Abrechnung selbst ist in sich stimmig: Zwischensumme CHF 3'005.65, Verwaltungspauschale 3 % = CHF 90.17, Gesamtkosten CHF 3'095.82, abzüglich Akonto CHF 2'880.00 ergibt CHF 215.82, auf 5 Rappen gerundet CHF 215.80. Dieser Betrag stimmt mit «Überfällige Beträge CHF 215.80» in der Übersicht und mit «Hans Müller schuldet noch CHF 215.80» im Dialog überein.
- Die Hilfe beim Feld «Zahlungsfrist» in den Einstellungen stimmt mit «Frist und Bemerkungen bearbeiten» überein («Bis zu diesem Datum bezahlt der Mieter die Nachzahlung»). Gut ist der Hinweis, dass die Änderung erst für künftig versendete Abrechnungen gilt.
- Der Dialog «Mahnung senden» verlangt eine ungewohnte Reihenfolge: «Markieren Sie den Brief dort … als versendet. Drucken Sie ihn danach aus.» Erst die Hilfe erklärt den Grund (Datum und neue Zahlungsfrist entstehen beim Markieren).
- Ob die 3. Mahnung auf Art. 257d OR (Zahlungsrückstand, Kündigungsandrohung mit 30 Tagen Frist) eingeht, ist nicht erkennbar. Dwello sagt nirgends, dass eine «Mahnung» von Dwello keine Mahnung im Sinn von Art. 257d OR ist.

## Aufgabe geschafft: ja

Alle genannten Stellen habe ich gelesen und beurteilt. Die Aufgabe «zu überfälligen Abrechnungen» in «Als Nächstes zu tun» war am Prüftag nicht sichtbar (siehe P-3). Ihren Text konnte ich deshalb nicht beurteilen.

## Aufwand

Etwa 15 Minuten, 7 Durchgänge (Übersicht, Einstellungen, Abrechnung, Mahnungsdialog, Frist bearbeiten, Hilfe, Gebäude, Abrechnungsliste).

## Ablauf

1. **Übersicht.** Erwartet: eine Aufgabe zur überfälligen Abrechnung von Hans Müller. Gesehen: «Als Nächstes zu tun» enthält nur «Nebenkostenabrechnungen erstellen» (Alpenblick) und «Abrechnungen prüfen und versenden» (7 Entwürfe). Unter «Fristen» steht die rote Zeile «06.10.2026 Zahlungsfrist · Hans Müller – seit 11 Tagen abgelaufen». Die Kachel zeigt «1 Überfällig» und «Überfällige Beträge CHF 215.80» (Screenshot 01-dashboard.png).
2. **Einstellungen (/config), Abschnitt «Fristen».** Erwartet: klare Regeln, wann ich mahnen darf. Gesehen: Zahlungsfrist 30 und Mahnfrist 14, mit den oben zitierten Hilfetexten. Die Mahnfrist erklärt, warum die Übersicht noch keine Mahnung vorschlägt. Die Begriffe und die fehlende Einschränkung auf Nachzahlungen fallen auf (P-1, P-2).
3. **Klick auf die Fristenzeile.** Erwartet: die Abrechnung. Gesehen: Abrechnung NK-11111111-2025-0001 mit dem Status «Überfällig» und den Knöpfen «Mahnung senden» und «Als bezahlt markieren». Mahnen ist also sofort möglich, was zum Text in den Einstellungen passt (03-statement.png).
4. **«Mahnung senden» öffnen (nicht bestätigt).** Erwartet: welche Frist die Mahnung setzt und wie sie zugestellt wird. Gesehen: «Dwello erstellt die Zahlungserinnerung als PDF …», «Hans Müller schuldet noch CHF 215.80», Knopf «Zahlungserinnerung senden». Keine Frist angegeben (P-2, P-4; 04-mahnung-dialog.png).
5. **«Frist und Bemerkungen bearbeiten» (nur angesehen).** Die Zahlungsfrist ist auf Dienstag, 6. Oktober 2026 gesetzt, der Hilfetext passt zu den Einstellungen (05-frist-bearbeiten.png).
6. **Hilfe.** Abschnitt «Zahlungen und Mahnungen» und Begriff «Mahnung»: «zuerst eine Zahlungserinnerung, danach höchstens eine 2. und eine 3. Mahnung». Der Versand «per E-Mail oder als Brief» widerspricht dem Dialog (P-4).
7. **Vermietete Wohnungen pro Gebäude.** Die Zahlen stimmen mit der Gebäudeseite «Musterhaus Zentrum» überein (06-musterhaus.png). Der Satz zu den Leerstandskosten ist richtig, aber unvollständig (P-6).
8. **Abrechnungsliste.** Es gibt keine versendete Rückerstattung, die überfällig sein könnte (Rückerstattungen sind nur «Entwurf» oder «Bezahlt»). P-1 liess sich daher nicht am Bildschirm nachstellen.

## Verwirrung

- «Mahnfrist»: Ich dachte zuerst an die Frist, die ich dem Mieter in der Mahnung setze.
- «Mahnung» und «Zahlungserinnerung»: Ist die erste Stufe rechtlich eine Mahnung (Verzug nach Art. 102 OR) oder nur ein freundlicher Hinweis?
- «senden»: Dwello sendet nicht, es erstellt ein PDF.
- «Fristen … welche Fristen anstehen», obwohl dort eine abgelaufene Frist steht.

## Fehlerrisiken

- Ein Vermieter glaubt nach «Zahlungserinnerung senden», die Mahnung sei verschickt, und bringt den Brief nie zur Post (P-4).
- Bei einer überfälligen Rückerstattung legen die Texte nahe, man könne den Mieter mahnen (P-1).
- Ein Vermieter verwechselt die Dwello-Mahnung mit einer Zahlungsfrist nach Art. 257d OR und kündigt zu früh, oder er rechnet mit der falschen Frist (P-2, Beobachtung zu Art. 257d).
- Ein Vermieter wartet unnötig auf den Vorschlag der Übersicht, obwohl er schon mahnen könnte (P-3).

## Vorschläge

- **P-1:** Einstellungen öffnen, Abschnitt «Fristen», Hilfe zu «Mahnfrist (Tage)» lesen. Vorschlag: «Überfällig ist eine Nachzahlung schon ab dem Tag nach der Zahlungsfrist; mahnen können Sie ab dann. Eine Rückerstattung überweisen Sie bis zur Zahlungsfrist.»
- **P-2:** Gleiche Stelle. Eine andere Bezeichnung wählen (etwa «Mahnung vorschlagen nach (Tage)»), über das Glossar zu entscheiden. Ausserdem sagen, welche Zahlungsfrist eine Mahnung setzt, in den Einstellungen und im Dialog «Mahnung senden».
- **P-3:** Übersicht öffnen, solange die Zahlungsfrist abgelaufen ist, die Mahnfrist aber noch nicht. Unter der Fristenzeile zum Beispiel «Mahnen können Sie jetzt; Dwello schlägt die Mahnung ab 20.10.2026 vor.» Die Unterzeile «Was jetzt zu tun ist und welche Fristen anstehen» auch auf abgelaufene Fristen ausrichten.
- **P-4:** Abrechnung von Hans Müller öffnen und «Mahnung senden» anklicken. Einen Begriff durchziehen (Knopf und Bestätigung gleich benennen, zum Beispiel «Zahlungserinnerung erstellen») und die Hilfe an das tatsächliche Verhalten (PDF unter «Dokumente») anpassen oder umgekehrt.
- **P-5:** Einstellungen, Hilfe «Mahnfrist». Zum Beispiel: «Mahnen können Sie, sobald die Zahlungsfrist abgelaufen ist.» (Das ist faktisch gleich, klingt aber nicht nach einem Verbot.)
- **P-6:** Übersicht, Satz unter «Vermietete Wohnungen pro Gebäude». Zum Beispiel: «Die Nebenkosten einer Wohnung ohne laufenden Mietvertrag tragen Sie als Vermieter.»

## Nicht geprüft

- Den Text der Aufgabe zu überfälligen Abrechnungen in «Als Nächstes zu tun»: Am Prüftag lief die Mahnfrist von 14 Tagen noch. Ich darf nichts speichern und die Uhr des Servers nicht verändern.
- Eine überfällige Rückerstattung: Es gibt keine versendete, und versenden hätte Speichern bedeutet.
- Den Inhalt des Mahnungs-PDFs (Frist, Hinweis auf Art. 257d OR): Das PDF entsteht erst beim Bestätigen, das hätte gespeichert.
- Die Gültigkeitsgrenzen der Felder Zahlungsfrist und Mahnfrist (keine min/max-Attribute sichtbar): Eine Prüfung hätte Speichern vorausgesetzt, und eine andere Persona speichert gleichzeitig die Einstellungen.
