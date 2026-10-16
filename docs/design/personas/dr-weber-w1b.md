# Persona-Review: Dr. Weber, Runde w1b – Korrektur einer Rechnung nach erstellten Abrechnungen

Persona: Dr. Weber, 52, rechtlich vorsichtig, liest alles, rechnet nach. Desktop 1440 × 900, Maus, Sprache Deutsch.
Gebäude: «Musterhaus Zentrum», Abrechnungsperiode 01.01.2025 – 31.12.2025.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/448bd968-db3f-51d5-8b5a-96a95e074d39/scratchpad/dr-weber-w1b/`

Korrigierte Rechnung: Wasserversorgung Zürich, «Wasser und Abwasser Q4 2025», Rechnungsnummer MZ-2025-018, von CHF 940.00 auf CHF 904.00 (angenommener Zahlendreher). Gespeichert.

## Befunde

| ID | Schweregrad | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnung Hans Müller (versendet), Hinweis «Rechnungen seit der Abrechnung geändert» | Der Hinweis sagt «Ist der Betrag zu hoch, erstatten Sie ihm die Differenz». Herr Müller hat aber noch nicht bezahlt (Status «Versendet», Zahlungsfrist 28.10.2026). Zu erstatten gibt es nichts. Er hat einen Einzahlungsschein über CHF 215.80 in der Hand, richtig wären nach meiner Nachrechnung rund CHF 210.15. Der Hinweis sagt nicht, dass er den alten Zahlteil nicht benutzen soll, und auch nicht, was ich danach in Dwello mit «Als bezahlt markieren» mache, wenn ein anderer Betrag eingeht. |
| P-2 | Minor | Rechnung bearbeiten (nach dem Speichern) | Hier stehen zwei Hinweise übereinander: «Abrechnungen nicht aktuell» («… ohne diese Rechnung oder mit einem früheren Stand davon») und «Rechnung schon abgerechnet» («… Abrechnungen mit dieser Rechnung»). Sie sagen fast dasselbe, aber mit anderen Worten und anderen Ratschlägen («erstatten Sie ihm die Differenz» bzw. «zu viel Bezahltes zahlen Sie zurück»). Ich frage mich, ob das zwei verschiedene Probleme sind. |
| P-3 | Minor | Rechnung (Detail und Bearbeiten), Hinweis «Abrechnungen nicht aktuell» | Der Hinweis nennt weder die betroffenen Abrechnungen noch ihre Zahl und verlinkt nicht auf sie. Ich erfahre auch nicht, ob versendete dabei sind. Ich muss selbst in die Liste und jede Abrechnung öffnen. |
| P-4 | Minor | Abrechnung (Entwurf und versendet), Hinweis | «Es wurde 1 Rechnung … erfasst, geändert oder gelöscht», aber welche? In der Kostenaufstellung steht die Rechnung Q4 weiter mit CHF 940.00 und ohne Markierung. Der Link führt auf die Rechnung, die jetzt CHF 904.00 zeigt. Dass genau diese Zeile betroffen ist, finde ich nur durch Vergleichen heraus. |
| P-5 | Minor | Abrechnung Anna Schmidt (Entwurf), Dialog «Als versendet markieren» | Der Dialog wiederholt nicht, dass der Entwurf veraltet ist. Ich kann einen Entwurf, von dem ich weiss, dass er falsch ist, ohne zweite Warnung als versendet markieren. |
| P-6 | Nit | Rechnung, Hinweis «Abrechnungen nicht aktuell» | «… erstellen Sie die Abrechnungen erneut, dann rechnen sie die Rechnung so ab, wie sie jetzt ist.» Das kleine «sie» liest sich wie ein Tippfehler für «Sie». Die Abrechnungen sind gemeint, das merke ich aber erst beim zweiten Lesen. |
| P-7 | Nit | Hinweise (versendet) | «Schicken Sie dem Mieter eine berichtigte Abrechnung mit dem Beleg»: Das Gesetz verlangt Einsicht in die Belege (Art. 257b Abs. 2 OR), nicht ihre Zustellung. Als Empfehlung ist der Satz in Ordnung, er klingt aber wie eine Pflicht. |

## Beobachtungen

- Die Übersicht (Dashboard) und die Abrechnungsliste zeigen nach der Korrektur nirgends, dass Abrechnungen veraltet sind. Das Dashboard fordert weiter «7 Nebenkostenabrechnungen sind noch im Entwurf. Prüfen Sie sie und stellen Sie sie den Mietern zu.» In der Liste steht bei Hans Müller weiter der Knopf «Als bezahlt markieren», ohne Hinweis.
- Auch die Entwürfe von Pierre Dubois und Maria Rossi sind betroffen. Das sehe ich nur, wenn ich sie einzeln öffne. Der Rechnungshinweis sagt immerhin «Löschen Sie die Entwürfe dieser Periode».
- Die Rechnungs-Detailseite sagt vor der Korrektur nichts davon, dass die Rechnung schon abgerechnet ist. Das steht erst beim Bearbeiten («Rechnung schon abgerechnet … Bestehende Abrechnungen ändern sich dadurch nicht.»). Ich finde das gut, denn die Warnung kommt vor dem Speichern.
- Nach dem Speichern komme ich auf die Detailseite zurück. Eine eigene Erfolgsmeldung habe ich nicht gesehen, aber der neue Betrag und der gelbe Hinweis stehen direkt da.
- Die Bearbeiten-Seite zeigt die Kategorie kurz als leere Auswahl («Kategorie auswählen»). Erst nach etwa einer Sekunde ist «Kaltwasser» gewählt. Wer schnell ist, sieht kurz eine leere Kategorie.
- Das PDF von Herrn Müller ist nach der Korrektur unverändert (Textvergleich identisch). Das ist richtig so, denn versendete Abrechnungen werden nicht stillschweigend geändert.
- Der Verlauf von Herrn Müller zeigt «Erstellt 16.10.2026, 23:23», aber «Versendet 28.09.2026», also versendet vor dem Erstellen. Vermutlich kommt das von den Demodaten.
- Im Erstellen-Assistenten stand «Entwurf gespeichert, 21:27», während die App sonst 23:2x zeigt. Mein Testbrowser lief in UTC, daher stammt das vermutlich aus der Testumgebung und ist kein Befund.
- Der Erstellen-Assistent ist bei einem neuen Lauf auf das Heizprofil «Heizung + Warmwasser» voreingestellt. Die bestehenden Abrechnungen nennen «Heizung Mittelland». Wer einen Entwurf neu erstellt und das nicht anpasst, bekommt ein anderes Profil. Bei ganzjährigen Mietverträgen spielt das keine Rolle.
- Die Vorschau im Assistenten sagt klar: «Alle Mietverträge haben in dieser Periode schon eine Abrechnung. Um einen Entwurf neu zu berechnen, löschen Sie ihn … Versendete Abrechnungen lassen sich nicht neu berechnen.» Das hilft.

### Vergleich Detailseite und PDF (Hans Müller, Anna Schmidt)

| Angabe | Detailseite | PDF | Urteil |
|---|---|---|---|
| Mietverhältnis in der Periode | «Mietstage in der Abrechnungsperiode – Ihr Mietverhältnis in dieser Periode: 01.01.2025 – 31.12.2025, 365 Mietstage» | «Ihr Mietverhältnis in dieser Periode: 01.01.2025 – 31.12.2025 (365 Mietstage von 365 Tagen)» | Inhaltlich gleich. Auf der Seite für den Vermieter wirkt «Ihr» etwas fremd. |
| Wohnungsanteil | Betrag pro Kategorie, z. B. Lift CHF 281.67 | gleiche Beträge, zusätzlich der Schlüssel «1 / 6 Wohnungen», «75.50 / 492.50 m²» | Beträge gleich. Die Detailseite zeigt nicht, wie der Anteil zustande kommt. |
| Zeitanteil | «365/365 Tage» | «365/365 Tage» | gleich |
| Anteil | Spalte «Anteil» in % (16.67 %, 15.33 %, Heizung 15.73 %) und Spalte «Betrag» in CHF | Spalte «Ihr Anteil» in CHF, keine Prozente | Dasselbe Wort steht für verschiedene Dinge. Die Prozentwerte habe ich nachgerechnet, sie stimmen (Heizung 0.7 × 15.33 % + 0.3 × 16.67 % = 15.73 %). |
| Kosten | «Kosten des Gebäudes» | «Kosten Liegenschaft» | anderes Wort, gleiche Beträge |
| Ihre Nebenkosten | Müller CHF 3’095.82, Schmidt CHF 3’593.52 | gleich | gleich, Summe und 3 % Pauschale nachgerechnet |
| Heizung/Tank | Zeile «Veränderung Tankbestand CHF 392.80» | Block mit Anfangsbestand, Rechnungen und Endbestand | Das PDF ist ausführlicher, aber nicht widersprüchlich |

Von einer Kostenposition zu ihren Rechnungen: Ja, unter jeder Kategorie stehen ihre Rechnungen als Links mit dem abgerechneten Betrag. Die Tankveränderung steht als Text ohne Link da, das ist schlüssig.

Rechtliche Hinweise im PDF: Art. 257b Abs. 2 OR (Belegeinsicht) und Art. 8 Abs. 1 und 2 VMWG (detaillierte Heizkostenabrechnung, Auskunft über den Bestand) sind richtig zitiert.

## Aufgabe geschafft: ja

Den Betrag habe ich korrigiert und gespeichert, alle verlangten Prüfungen sind gemacht. Den veralteten Entwurf von Anna Schmidt habe ich nicht gelöscht und nicht neu erstellt (siehe «Nicht geprüft»).

## Aufwand

Etwa 15 Minuten, rund 14 Schritte: Dashboard, Rechnungsliste 2025, Abrechnungsliste, zwei Abrechnungen samt PDF vorher, Rechnungsdetail, Bearbeiten, Speichern, Rechnungsdetail und Bearbeiten nachher, zwei Abrechnungen samt PDF nachher, Dashboard und Liste nachher, Versenden-Dialog (abgebrochen), Löschen-Dialog (abgebrochen), Erstellen-Assistent bis zur Vorschau.

## Ablauf

1. **Dashboard.** Erwartet: Überblick. Gesehen: «Abrechnungen prüfen und versenden», 7 Entwürfe, Frist Hans Müller 28.10.2026. (Screenshot 01-dashboard.png)
2. **Rechnungen 2025.** Erwartet: Liste mit Filter nach Jahr. Gesehen: 40 Rechnungen, jede Zeile mit Gebäude, Datum, Betrag und «Bearbeiten». Ich wähle «Wasser und Abwasser Q4 2025», Musterhaus Zentrum, CHF 940.00.
3. **Ausgangslage festhalten.** Ich öffne die Abrechnungen von Müller (Nachzahlung CHF 215.80, versendet) und Schmidt (Rückerstattung CHF 6.50, Entwurf) und lade beide PDFs. Alle Summen habe ich nachgerechnet, sie stimmen.
4. **Rechnungsdetail vorher.** Erwartet: ein Hinweis, dass die Rechnung abgerechnet ist. Gesehen: kein Hinweis, nur die Daten und «Rechnung bearbeiten».
5. **Bearbeiten vorher.** Erwartet: eine Warnung. Gesehen: Ein gelber Kasten «Rechnung schon abgerechnet» sagt, die Abrechnungen stimmen nach einer Änderung nicht mehr: Entwürfe löschen und neu erstellen, Versendete ausserhalb von Dwello berichtigen. Gut so.
6. **Betrag auf 904.00 ändern, «Änderungen speichern».** Erwartet: eine Bestätigung. Gesehen: Zurück auf der Detailseite steht «Betrag CHF 904.00», «Zuletzt geändert 23:25» und neu der gelbe Hinweis «Abrechnungen nicht aktuell». (06-after-save.png)
7. **Bearbeiten nachher.** Erwartet: ein Hinweis. Gesehen: zwei Kästen übereinander (P-2).
8. **Abrechnung Anna Schmidt (Entwurf).** Erwartet: Hinweis und klarer nächster Schritt. Gesehen: «Rechnungen seit der Abrechnung geändert – … Löschen Sie ihn und erstellen Sie die Abrechnung erneut.» Unten gibt es den Knopf «Abrechnung löschen». Klar und richtig. Welche Rechnung betroffen ist, steht nicht da (P-4). (09-schmidt-after.png)
9. **Abrechnung Hans Müller (versendet).** Erwartet: Anleitung für eine bereits zugestellte, noch offene Abrechnung. Gesehen: gelber Kasten oben, ausserhalb von Dwello berichtigen, «Ist der Betrag zu hoch, erstatten Sie ihm die Differenz». Das passt nicht zu einer unbezahlten Rechnung (P-1). Darunter weiter der Saldo CHF 215.80 und «Als bezahlt markieren». (10-mueller-after.png)
10. **PDFs nachher.** Beide sind unverändert, ohne Hinweis. Für das versendete PDF ist das richtig.
11. **Dashboard und Liste nachher.** Erwartet: ein Hinweis auf veraltete Abrechnungen. Gesehen: keiner (Beobachtungen).
12. **Versenden-Dialog bei Anna Schmidt.** Der Dialog öffnet ohne Warnung zum veralteten Stand (P-5). Ich habe abgebrochen. (11-schmidt-send-dialog.png)
13. **Löschen-Dialog bei Anna Schmidt.** «Die Abrechnung NK-11111111-2025-0002 von Anna Schmidt wird gelöscht. Das lässt sich nicht rückgängig machen.» Klar. Abgebrochen, siehe «Nicht geprüft».
14. **Erstellen-Assistent bis zur Vorschau.** Die Vorschau sagt, dass alle Mietverträge schon eine Abrechnung haben und dass ich einen Entwurf zuerst löschen muss. (17-generate-preview.png)

## Verwirrung

- «Ist der Betrag zu hoch»: Welcher Betrag? Der Rechnungsbetrag, der Saldo der Abrechnung oder das, was der Mieter bezahlt hat?
- «Abrechnungen nicht aktuell» und «Rechnung schon abgerechnet» stehen gleichzeitig da. Sind das zwei Zustände?
- «ohne diese Rechnung oder mit einem früheren Stand davon»: Die Formulierung deckt beide Fälle ab, ich weiss danach aber nicht, welcher bei mir zutrifft.
- «Anteil» (Prozent) auf der Seite und «Ihr Anteil» (Franken) im PDF.
- «Kosten des Gebäudes» und «Kosten Liegenschaft» stehen für dasselbe.

## Fehlerrisiken

- Herr Müller zahlt mit dem alten Zahlteil CHF 215.80, also CHF 5.65 zu viel. Oder ich schicke eine berichtigte Abrechnung, er zahlt CHF 210.15, und Dwello kennt nur CHF 215.80. Wie ich das in Dwello abschliesse, ist offen (P-1).
- Wer aus dem Dashboard («Prüfen Sie sie und stellen Sie sie den Mietern zu») direkt versendet, kann einen veralteten Entwurf zustellen (P-5, Beobachtungen).
- Die Entwürfe von Dubois und Rossi sind ebenfalls veraltet, sichtbar ist das aber nur auf ihrer Detailseite.

## Vorschläge

- **P-1:** Rechnung MZ-2025-018 in Musterhaus Zentrum ändern, dann die Abrechnung NK-11111111-2025-0001 (Hans Müller, versendet, nicht bezahlt) öffnen. Was helfen würde: den Hinweis nach Zahlstand unterscheiden. Für nicht bezahlte Abrechnungen etwa: «Schicken Sie dem Mieter eine berichtigte Abrechnung mit neuem Zahlteil und bitten Sie ihn, den alten nicht zu verwenden.» Für bezahlte: «Erstatten Sie zu viel Bezahltes zurück.» Dazu ein Satz, was in Dwello danach zu tun ist, etwa ob «Als bezahlt markieren» trotz abweichendem Betrag richtig ist.
- **P-2:** Dieselbe Rechnung ändern und «Rechnung bearbeiten» erneut öffnen. Was helfen würde: nur einen Hinweis zeigen. Liegt eine Änderung nach dem Abrechnen vor, ersetzt «Abrechnungen nicht aktuell» den Hinweis «Rechnung schon abgerechnet». Die beiden Ratschläge zur Rückzahlung sollten gleich lauten.
- **P-3:** Rechnung ändern und die Detailseite ansehen. Was helfen würde: die betroffenen Abrechnungen mit Status aufzählen oder verlinken, etwa «4 Abrechnungen, davon 1 versendet – Abrechnungen ansehen».
- **P-4:** Nach der Änderung eine Abrechnung des Gebäudes öffnen. Was helfen würde: die geänderte Rechnung im Hinweis nennen und verlinken und in der Kostenaufstellung bei der Rechnung «seither geändert: jetzt CHF 904.00» anzeigen.
- **P-5:** Bei einem veralteten Entwurf «Als versendet markieren» klicken. Was helfen würde: den Hinweis im Dialog wiederholen oder das Versenden erst nach einer ausdrücklichen Bestätigung erlauben.
- **P-6:** Satz umstellen, etwa: «… erstellen Sie die Abrechnungen erneut. Die neuen Abrechnungen enthalten die Rechnung, wie sie jetzt ist.»
- **P-7:** «mit dem Beleg» als Empfehlung kennzeichnen, z. B. «legen Sie am besten den Beleg bei».

## Nicht geprüft

- **Entwurf löschen und neu erstellen:** Die Bestätigung von «Abrechnung löschen» für den Entwurf von Anna Schmidt hat die Rechteprüfung meiner Umgebung abgelehnt. Ich habe das nicht umgangen und nur den Dialogtext gelesen und abgebrochen. Ungeprüft bleiben deshalb, ob der neu erstellte Entwurf CHF 904.00 abrechnet (meine Erwartung: Rückerstattung rund CHF 13.40 statt 6.50), ob der Hinweis danach verschwindet und ob Hans Müllers Hinweis bleibt.
- Ob der Hinweis bei einer bezahlten Abrechnung anders lautet: In Musterhaus Zentrum gibt es 2025 keine bezahlte Abrechnung, und als bezahlt markieren wollte ich Herrn Müller nicht.
- Abrechnungen anderer Gebäude habe ich bewusst nicht geprüft und nichts dort geändert.
- Hinweis zum Ablauf: Vor dem Start habe ich versehentlich die Datei `docs/design/personas/demo-records.md` gelesen, die nicht für Personas gedacht ist. Ich habe daraus nur die Namen und Status entnommen, die auch die Aufgabe nennt.
