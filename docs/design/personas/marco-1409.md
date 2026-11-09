# Marco – Jahreszahlen Seepark Residenz 2025 (Runde 1409)

Persona: Marco, 38, Smartphone 390 × 844, Touch. App: http://localhost:3300 (Persona-Stack, Demo-Daten). Nur angeschaut, nichts gespeichert.

Aufgabe: Im Zug die Jahreszahlen 2025 von «Seepark Residenz» für die Steuererklärung finden (Mietertrag und die Kosten, die ich selbst trage), bei Bedarf Gebäude oder Jahr wechseln, und die Datei holen, die ich später in Excel öffnen kann.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Blocker | Berichte › Kostenabstimmung Seepark Residenz 2025 | Es gibt keine Datei zum Herunterladen (kein CSV/Excel, auch kein PDF). Weder auf der Berichtsliste noch auf der Kostenabstimmung noch beim Gebäude oder bei den Rechnungen fand ich einen Download. |
| P-2 | Blocker | Berichte › Kostenabstimmung Seepark Residenz 2025 | Der Mietertrag fehlt. Die Seite zeigt nur Nebenkosten (Kosten des Gebäudes, davon Mieter, davon tragen Sie) und die Verwaltungspauschale. Nettomieten für 2025 stehen nirgends als Summe; ich müsste sie aus den Mietverträgen selbst zusammenrechnen (Monatsmiete mal Monate, Mietbeginn 01.07.2025 bei Nina Brunner beachten). |
| P-3 | Minor | Berichte (Liste) | Unter «Berichte» heisst der einzige Abschnitt «Kostenabstimmungen». Als Laie suche ich «Jahresübersicht» oder «Zahlen für die Steuererklärung»; ob ich hier richtig bin, merke ich erst nach dem Antippen. Nur der Einleitungssatz («welchen Teil der Kosten die Mieter tragen und welchen Sie») hat mich hingeführt. |
| P-4 | Minor | Berichte › Kostenabstimmung | Kein Wechsel von Gebäude oder Jahr auf der Seite selbst. Für ein anderes Jahr muss ich zurück zur Liste («Berichte» im Brotkrümel) und dort einen anderen Eintrag antippen. Ging, ist aber ein Umweg. |
| P-5 | Minor | Berichte › Kostenabstimmung | «davon tragen Sie» umfasst nur die Nebenkosten-Kategorien der Abrechnung. Dass nicht umlagefähige Kosten (Reparaturen, Versicherung, Hypothekarzinsen) hier gar nicht drin sind, steht nicht da. Für die Steuer könnte ich die CHF 2’594.30 für «meine Kosten» halten. (In 2025 hat Seepark keine nicht umlagefähigen Rechnungen, im Ergebnis also zufällig richtig.) |

## Beobachtungen

- Das Menü (Hamburger) ist übersichtlich, «Berichte» unter «Nebenkosten» habe ich schnell gesehen. Im Bedienungsbaum (readOut) tauchte das geöffnete Menü allerdings nicht auf, nur im Bild.
- Die Kostenabstimmung ist auf dem Handy gut lesbar: eine Karte pro Position, keine Seitwärts-Scrolls (scrollWidth 390), Total-Karte grau hinterlegt, «davon tragen Sie» fett. Total 2025: Kosten des Gebäudes CHF 11’008.30, davon Mieter CHF 8’414.00, davon tragen Sie CHF 2’594.30, Verwaltungspauschale CHF 236.28.
- Der Titel steht doppelt: im Brotkrümel und gleich darunter als Überschrift, beides zweizeilig – kostet auf dem Handy viel Platz.
- Die Links zu den Entwurfs-Abrechnungen (Marco Bernasconi, Nina Brunner, Sarah Meier, Thomas Weber) sind nur 20 px hoch, im Fliesstext; mit dem Daumen schwer zu treffen.
- Der Hinweis «4 Abrechnungen sind noch Entwürfe. Sie zählen schon mit …» ist hilfreich: ich weiss, dass sich die Zahlen noch ändern könnten.
- Die Übersicht (Dashboard) bietet nichts zu Jahreszahlen; ich musste über das Menü suchen.
- In der Rechnungsliste wird aus dem Filter «Nicht umlagefähig» in der Adresse `validity=invalid` – für mich unsichtbar, nur auffällig.
- Die Mietverträge-Liste zeigt pro Vertrag Nettomiete und «Monatlich total», aber keine Jahressumme und keinen Filter nach Jahr.

## Aufgabe geschafft: nein

Gescheitert an: Mietertrag 2025 finden (P-2) und Datei für Excel holen (P-1). Die selbst getragenen Nebenkosten habe ich gefunden.

## Aufwand

ca. 15 Minuten, rund 14 Schritte (Übersicht, Menü, Berichte, Kostenabstimmung, zurück, Dokumente, Gebäude, Gebäude Seepark, Rechnungen mit Filtern, Mietverträge).

## Ablauf

- Übersicht: erwartet einen Hinweis auf Jahreszahlen oder Berichte; gesehen nur Aufgaben zu Nebenkostenabrechnungen und Kennzahlen zu Wohnungen.
- Berichte: erwartet «Jahresübersicht 2025» o.ä. mit Gebäude- und Jahresauswahl; gesehen eine Liste «Kostenabstimmungen» mit fünf Einträgen Gebäude + Periode (Seepark 2025 und 2024 dabei).
- Kostenabstimmung Seepark Residenz 2025: erwartet Mieteinnahmen, meine Kosten und einen Knopf «Als Excel herunterladen»; gesehen nur die Nebenkosten-Aufteilung, kein Mietertrag, kein Download, keine Umschaltung von Jahr oder Gebäude (Screenshot 04: sechs Positionskarten, Total-Karte, Erklärtext, Leerstand B1 365 Tage, Liste der Entwürfe – sonst nichts).
- Dokumente: gehofft, dort Exporte zu finden; gesehen nur Mieterdokumente (Übergabeprotokoll B2).
- Gebäude Seepark Residenz: erwartet einen Link zu Auswertungen; gesehen Angaben, Wohnungen, Tankbestand, «Rechnungen ansehen» – kein Bericht, kein Export.
- Rechnungen (Seepark, 2025, Nicht umlagefähig): erwartet Liste und Summe bzw. Export; gesehen «Keine Rechnungen gefunden», und auch in der ungefilterten Liste keinen Export.
- Mietverträge: erwartet Jahresmieteinnahmen; gesehen nur Monatsbeträge pro Vertrag.

## Vorschläge

- **P-1:** Menü › Berichte › «Seepark Residenz, 01.01.2025 – 31.12.2025» antippen › Seite ganz durchscrollen: kein Download. Hilfreich: ein Knopf «Als CSV für Excel herunterladen» auf der Kostenabstimmung (bzw. der Jahresübersicht), Dateiname mit Gebäude und Jahr.
- **P-2:** wie P-1. Hilfreich: auf derselben Seite eine Zeile «Mietertrag (Nettomieten) 2025» und ggf. «Nebenkosten-Akonto/Pauschalen», am besten mit Hinweis, welche Zahl in die Steuererklärung gehört; diese Zahlen auch in der Datei.
- **P-3:** Menü › Berichte. Hilfreich: Abschnitt oder Einleitung, die das Wort «Jahresübersicht» oder «für die Steuererklärung» nennt, oder ein zusätzlicher Eintrag dafür.
- **P-4:** Kostenabstimmung Seepark 2025 öffnen, 2024 sehen wollen. Hilfreich: Auswahl Gebäude und Jahr oben auf der Seite, oder Links «Vorjahr / Folgejahr».
- **P-5:** Kostenabstimmung lesen. Hilfreich: ein Satz «Nicht umlagefähige Kosten (z. B. Reparaturen, Hypothekarzinsen) sind hier nicht enthalten; Sie finden sie unter Rechnungen» mit Link auf die gefilterte Rechnungsliste – oder sie gleich mit aufführen.

## Nicht geprüft

- Den Inhalt einer Excel-Datei: es gab keine Datei. Gesucht auf Berichte (Liste und Detail), Dokumente, Gebäude Seepark Residenz, Rechnungen (mit Filtern), Mietverträge, Benutzermenü; auf keiner Seite ein Knopf oder Link mit Download/Export/CSV/Excel (ausser «Datei herunterladen» beim Übergabeprotokoll).
- Ob die Funktion im gestarteten Build einfach fehlt (z. B. älterer Persona-Build): das kann ich als Nutzer nicht sehen.
- Einzelne Mietvertragsdetails habe ich nicht geöffnet, um Mieten selbst zusammenzurechnen; das wäre nicht die Aufgabe.
