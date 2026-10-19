# Helga – Nachtragsrechnung erfassen und Entwurf «Neu berechnen» (#338)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom, Maus. App: Persona-Stack auf http://localhost:3300, Deutsch. Gespeichert nur in «Seepark Residenz».
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/94137d46-12c2-5dda-bd7d-6f5cd855db5e/scratchpad/helga-338/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnung (Entwurf) | Nach «Neu berechnen» springt die Seite ganz nach oben (scrollY 3312 → 0, Fokus auf `body`). Die Bestätigung «Der Entwurf ist neu berechnet …» steht unten beim Knopf, ausserhalb des sichtbaren Bereichs. Ich sehe oben nur, dass der gelbe Hinweis weg ist, und eine leere Lücke. |
| P-2 | Major | Abrechnung (Entwurf) | «Neu berechnen» rechnet sofort, ohne Rückfrage und ohne Erklärung vorher. Nirgends steht, was bleibt (Nummer, Heizprofil, Verwaltungspauschale, Frist, Bemerkungen) und was sich ändert (der Saldo kann von Rückerstattung zu Nachzahlung kippen, das PDF wird verworfen). Die alten Beträge sind danach weg. |
| P-3 | Minor | Abrechnung (Entwurf) | Der gelbe Hinweis oben sagt «Wählen Sie «Neu berechnen»», der Knopf steht aber etwa drei Bildschirme weiter unten unter «Weitere Aktionen». Im Hinweis selbst gibt es keinen Knopf und keinen Link. |
| P-4 | Minor | Abrechnung (Entwurf) | Nach dem Neu berechnen heisst der Knopf «PDF erstellen» statt «PDF herunterladen», und im Verlauf fehlt «PDF erstellt». Das alte PDF ist also weg, das sagt mir aber niemand. Im Verlauf steht auch kein Eintrag «Neu berechnet», nur «Erstellt 12:10». |
| P-5 | Minor | Rechnung (Detail) | Die Warnung «Abrechnungen nicht aktuell» packt «Neu berechnen», «Abrechnung berichtigen» und die Verjährung (Art. 128 Ziff. 1 OR) in einen einzigen langen Absatz. Für mich ist das zu viel auf einmal. «auf ihrer Seite» ist unklar (wessen Seite?). Welche Entwürfe betroffen sind, steht hier nicht, nur ein Link auf die Liste. |
| P-6 | Nit | Assistent «Abrechnungen erstellen», Schritt 4 | Zwei Sätze hintereinander sagen dasselbe: «… keine Mietverträge ohne Abrechnung …» und «Alle Mietverträge haben in dieser Periode schon eine Abrechnung.» Der Knopf «Weiter» bleibt, obwohl es 0 Abrechnungen zu erstellen gibt. |

## Zahlen für die Datenprüfung

Abrechnung **NK-22222222-2025-0001**, Thomas Weber, Seepark Residenz, Wohnung A1, 01.01.–31.12.2025, 365 Mietstage. Die Nummer ist nach dem Neu berechnen dieselbe.

| Position | vorher | nachher |
|---|---|---|
| TV/Kabelanschluss (Pro Einheit, 25 %) | 228.00 | 228.00 |
| Heizung (Pro Fläche, 21.25 %, Gebäude 4’115.00) | 874.44 | 874.44 |
| Hauswart (Pro Fläche, 21.25 %, Gebäude 3’060.00) | 650.25 | 650.25 |
| Kaltwasser (Pro Fläche, 21.25 %, Gebäude 2’060.00) | 437.75 | 437.75 |
| Allgemeinstrom (Pro Fläche, 21.25 %, Gebäude 499.30) | 106.10 | 106.10 |
| Hauswart **neu, eigene Zeile** (Gleichmässig pro Wohnung, 25 %, Gebäude 480.00) | – | 120.00 |
| Zwischensumme | 2’296.54 | 2’416.54 |
| Verwaltungspauschale 3 % | 68.90 | 72.50 |
| Ihre Nebenkosten | 2’365.44 | 2’489.04 |
| Akontobeiträge | − 2’400.00 | − 2’400.00 |
| vor Rundung | Rückerstattung 34.56 | Nachzahlung 89.04 |
| Rundung | + 0.04 | − 0.04 |
| **Saldo** | **Rückerstattung CHF 34.60** | **Nachzahlung CHF 89.00** |

Heizprofil vorher und nachher: «Heizung + Warmwasser (nicht angewendet: Mietvertrag über die ganze Periode)». Zahlungsfrist 18.11.2026 und Abrechnungsdatum 19.10.2026 sind gleich geblieben.
Erfasste Rechnung: Hauswartung Keller GmbH, «Hauswartung Nachtrag 2025», CHF 480.00, Rechnungsdatum 31.12.2025, Kategorie Hauswart, **ohne Verteilschlüssel** (das Feld ist «optional», ich habe es leer gelassen), umlagefähig, ohne Beleg. Rechnungs-ID 9fcf1789-73ed-4432-8ef5-8a3f380977d3.
Die anderen drei Entwürfe (0002 Sarah Meier CHF 69.70 Rückerstattung, 0003 Nina Brunner CHF 113.75 Nachzahlung, 0004 Marco Bernasconi CHF 75.80 Nachzahlung) habe ich nicht neu berechnet. Sie zeigen weiter den Hinweis «Rechnungen seit der Abrechnung geändert».
Hinweis: «Neu berechnen» bei Weber habe ich insgesamt dreimal gedrückt (das erste Mal mit Wirkung, danach um zu sehen, wo die Bestätigung erscheint). Die Beträge blieben danach gleich.

Nachgerechnet: 480 / 4 = 120.00; 2’296.54 + 120.00 = 2’416.54; 3 % = 72.496, gerundet 72.50; 2’489.04 − 2’400 = 89.04, auf 5 Rappen gerundet 89.00. Für mich stimmt das.

## Beobachtungen

- Im Rechnungsformular wird der Verteilschlüssel nicht aus der Kategorie übernommen. Als Anfängerin lasse ich ein «optional»-Feld leer. Darum steht in der Abrechnung jetzt **zweimal «Hauswart»**: einmal «Pro Fläche» und einmal «Gleichmässig pro Wohnung». Ich hätte erwartet, dass die Nachtragsrechnung zu den anderen Hauswart-Rechnungen kommt (dann wären es 21.25 % = 102.00 statt 120.00). Das hat mich verwirrt, und Thomas Weber zahlt so etwas mehr.
- Die Kategorie-Auswahl im Rechnungsformular ist leer, bis ein Gebäude gewählt ist. Danach ging es gut.
- Nach dem Speichern der Rechnung deckt die grüne Meldung «Rechnung von Hauswartung Keller GmbH gespeichert» einen Teil der gelben Warnung zu.
- In der Liste der Nebenkostenabrechnungen sieht man nicht, welche Entwürfe veraltet sind. Erst auf der einzelnen Abrechnung oder im Assistenten steht es. Bei Weber steht nach dem Neu berechnen «PDF noch nicht erstellt».
- Der Assistent (Schritt 4) listet die vier Entwürfe mit Link und dem Satz «Seit dem Erstellen dieses Entwurfs wurden Rechnungen … erfasst, geändert oder gelöscht». Das fand ich sehr hilfreich. In Schritt 2 heisst es dagegen nur «‹Alle Gebäude› lässt 2 Gebäude aus …», ohne «Neu berechnen».
- Auf der Rechnungsseite bleibt «Abrechnungen nicht aktuell» auch nach dem Neu berechnen bei Weber stehen. Das ist richtig, weil drei Entwürfe noch alt sind. Dass es aber einer von vier weniger ist, sieht man dort nicht.
- Nach dem Neu berechnen bleibt oben zwischen «Status: Entwurf» und «Kostenaufstellung» eine grosse leere Fläche, wo vorher der Hinweis war.

## Aufgabe geschafft: ja

Rechnung erfasst, Webers Entwurf neu berechnet, der Hinweis ist weg. Gesehen, dass es geklappt hat, habe ich aber nur an den neuen Zahlen und am fehlenden Hinweis, nicht an der Bestätigung (P-1).

## Aufwand

Etwa 15 Minuten, rund 25 Schritte: Übersicht → Rechnungen → «Rechnung erfassen» → 7 Felder → speichern → Assistent bis Schritt 4 → Abrechnung Weber → lange nach unten scrollen → «Neu berechnen» → wieder nach unten scrollen, um die Bestätigung zu finden.

## Ablauf

1. **Entwürfe ansehen.** Erwartet: die vier Seepark-Entwürfe. Gesehen: Liste mit 7 Entwürfen, Weber NK-22222222-2025-0001, Rückerstattung CHF 34.60. Gut.
2. **Webers Entwurf vorher.** Erwartet: Beträge. Gesehen: Tabelle mit Rechnungen pro Kategorie, Saldo Rückerstattung 34.60. Unten «Weitere Aktionen» mit «Neu berechnen». Ohne Erklärung war mir noch nicht klar, wozu der Knopf da ist.
3. **Rechnung erfassen.** Erwartet: einfaches Formular. Gesehen: Formular mit vielen Hilfetexten (der Text zum Leistungszeitraum ist sehr lang, aber ich brauche ihn nicht). Datum 31.12.2025 angenommen. Kategorie Hauswart gewählt, den Verteilschlüssel liess ich leer. Gespeichert ohne Datei, das ging.
4. **Rechnungsseite.** Erwartet: «gespeichert». Gesehen: Meldung gespeichert und gelbe Warnung «Abrechnungen nicht aktuell» mit Link «Abrechnungen von Seepark Residenz ansehen» und dem langen Absatz (P-5). Dass ich «Neu berechnen» auf der Abrechnung brauche, habe ich verstanden.
5. **Assistent Seepark 2025.** Erwartet: dass er mir sagt, es gibt schon Abrechnungen. Gesehen: in Schritt 4 «Alle Mietverträge haben in dieser Periode schon eine Abrechnung. Einen Entwurf berechnen Sie auf seiner Seite mit «Neu berechnen» neu. Versendete Abrechnungen lassen sich nicht neu berechnen.» Darunter die vier Entwürfe als Links. Klar, nur doppelt formuliert (P-6).
6. **Webers Entwurf mit Hinweis.** Erwartet: einen Hinweis. Gesehen: gelber Kasten «Rechnungen seit der Abrechnung geändert … 1 Rechnung … Wählen Sie «Neu berechnen» …». Gut verständlich. Den Knopf musste ich weit unten suchen (P-3).
7. **«Neu berechnen» geklickt.** Erwartet: eine Rückfrage wie «Was passiert: neue Beträge, Nummer bleibt …». Gesehen: keine Rückfrage, die Seite springt nach oben, keine Meldung zu sehen (P-1, P-2). Erst beim erneuten Scrollen fand ich unten den grünen Kasten «Neu berechnen – Der Entwurf ist neu berechnet. Er rechnet die Rechnungen ab, wie sie jetzt sind.»
8. **Ergebnis prüfen.** Erwartet: Hauswart etwas höher. Gesehen: eine zweite Zeile «Hauswart, Gleichmässig pro Wohnung, CHF 120.00». Der Saldo ist jetzt eine Nachzahlung von CHF 89.00 statt einer Rückerstattung von CHF 34.60. Nummer, Heizprofil und 3 % sind gleich geblieben, das habe ich aber nur selbst verglichen, gesagt wurde es mir nicht.
9. **Neu laden.** Der Hinweis ist weg, das PDF muss neu erstellt werden (P-4). Die anderen Entwürfe haben den Hinweis noch.

## Verwirrung

- «Neu berechnen»: Was genau bleibt? Ich hatte Angst, dass die Nummer neu vergeben wird oder dass ich Heizprofil und Pauschale wieder eingeben muss. Das ist nicht so, aber ich weiss es nur durch Vergleichen.
- «rechnet er die Rechnungen ab, wie sie jetzt sind»: «er» = der Entwurf. Das habe ich zweimal lesen müssen.
- Zwei Zeilen «Hauswart» mit verschiedenen Verteilschlüsseln: Ist das ein Fehler?
- «Abrechnung berichtigen», «Verjährung», «Art. 128 Ziff. 1 OR» in der Warnung auf der Rechnungsseite: Muss ich das jetzt tun? (Nein, meine sind ja Entwürfe.)
- «Verteilschlüssel (optional)»: Wenn ich ihn leer lasse, wird gleichmässig verteilt, und das weicht von den anderen Rechnungen derselben Kategorie ab.

## Fehlerrisiken

- Man klickt «Neu berechnen» und merkt nicht, dass es gewirkt hat (P-1). Dann klickt man vielleicht mehrmals oder meint, es sei nichts passiert.
- Der Saldo kippt ohne Warnung von Rückerstattung zu Nachzahlung. Wer das alte PDF schon ausgedruckt oder dem Mieter angekündigt hat, merkt den Unterschied nicht (P-2, P-4).
- Eine Nachtragsrechnung ohne Verteilschlüssel wird anders verteilt als die übrigen Rechnungen derselben Kategorie.
- Wer in der Liste nicht sieht, welche Entwürfe veraltet sind, versendet vielleicht einen alten Entwurf.

## Vorschläge

- **P-1:** Seepark-Rechnung erfassen → Abrechnung NK-22222222-2025-0001 öffnen → ganz nach unten scrollen → «Neu berechnen». Die Seite springt nach oben, die Bestätigung steht unten. Besser: die Bestätigung oben zeigen, dort wo der Hinweis war (oder als Meldung im sichtbaren Bereich), und den Fokus darauf setzen.
- **P-2:** Gleicher Weg. Besser: vor dem Rechnen eine Rückfrage oder ein Hilfetext beim Knopf: «Die Beträge werden mit den aktuellen Rechnungen neu gerechnet. Nummer, Heizprofil, Verwaltungspauschale, Frist und Bemerkungen bleiben. Das PDF wird neu erstellt.» Nach dem Rechnen den alten Saldo nennen («vorher Rückerstattung CHF 34.60, jetzt Nachzahlung CHF 89.00»).
- **P-3:** Abrechnung mit Hinweis öffnen. Besser: einen Knopf «Neu berechnen» direkt im gelben Hinweis.
- **P-4:** Nach dem Neu berechnen den Knopf und den Verlauf ansehen. Besser: in der Bestätigung sagen, dass das PDF neu erstellt werden muss, und im Verlauf «Neu berechnet, 19.10.2026, 12:13» eintragen.
- **P-5:** Rechnung in einer Periode mit Entwürfen speichern. Besser: kurze Sätze, den Teil für Entwürfe zuerst und getrennt von dem für versendete Abrechnungen. Die Verjährung nur zeigen, wenn eine versendete Abrechnung betroffen ist. Die betroffenen Entwürfe als Links aufführen wie im Assistenten.
- **P-6:** Assistent, Seepark 2025, Schritt 4. Besser: nur einen der beiden Sätze, und «Weiter» ausblenden oder durch «Zu den Abrechnungen» ersetzen, wenn 0 Abrechnungen entstehen.

## Nicht geprüft

- Zoom 200 %: nur 150 % ausprobiert.
- Eine versendete Abrechnung und «Abrechnung berichtigen»: In Seepark 2025 gibt es keine versendete, und ich sollte nur Webers Entwurf ändern.
- Das neue PDF: Ich habe nicht «PDF erstellen» gedrückt, um nichts über den Auftrag hinaus zu ändern. Den Inhalt prüft die Datenprüfung.
- Die anderen drei Entwürfe neu berechnen: absichtlich nicht (Auftrag).
- Einen Fehlerfall beim Neu berechnen: kein Fehler-Request verlangt.
