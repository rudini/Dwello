# Dr. Weber – Runde W4: Heizprofil auf Detailseite und im PDF

Persona: Dr. Weber, 52, rechtlich vorsichtig, liest alles und rechnet nach. Desktop 1440 × 900, Maus, Deutsch. App: http://localhost:3300 (Persona-Stack). Gespeichert nur im Gebäude «Seepark Residenz».

Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/3a249483-dd2a-5ba2-b226-2da9cde281a8/scratchpad/dr-weber-w4/` (ausserhalb des Repos).

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Abrechnungsdetail (Nina Brunner, Sarah Meier) | Bei Thomas Weber steht «Heizprofil: Heizung + Warmwasser (nicht angewendet: Mietvertrag über die ganze Periode)». Bei Nina Brunner und Sarah Meier steht nur «Heizprofil: Heizung + Warmwasser», ohne «angewendet» und ohne Grund. Dass es angewendet wurde, schliesse ich nur aus dem abweichenden Anteil der Zeile Heizung. |
| P-2 | Minor | Abrechnungsdetail | Die Zeile Heizung hat einen anderen «Anteil» als die übrigen Flächenpositionen (Sarah neu: 21.4 % statt 16.99 %; Nina: 11.33 % statt 12.92 %). Auf der Seite steht nirgends, woher der Unterschied kommt. Der Anteil nach Heizprofil (83.53 % bzw. 44.20 %) und die Monatsanteile stehen nur im PDF. Vor dem Versenden kann ich das also nur im PDF prüfen. |
| P-3 | Minor | PDF, Abschnitt «Heiz- und Warmwasserkosten» (Nina, Sarah) | Das PDF sagt nicht, warum nach Heizprofil gerechnet wird (Ein- oder Auszug während der Abrechnungsperiode). Was ein Heizprofil ist, erklärt es auch nicht (im Winter wird mehr geheizt, darum zählen die Monate unterschiedlich). Ein Mieter liest «Heizkosten nach Heizprofil «Heizung + Warmwasser»: 44.20 %» und weiss nicht, warum er nicht einfach nach Tagen bezahlt. |
| P-4 | Nit | PDF Nina Brunner | Ninas Abschnitt zählt nur die Monatsanteile auf (Jul 3.70 % … Dez 13.00 %). Die Summe «zusammen 44.20 %» fehlt, ebenso der Hinweis, dass das ganze Jahr 100 % sind. Bei Sarah stehen Summe und Formel. Bei Nina muss der Leser selbst zusammenzählen. Das stimmt zwar (44.20 %), ist aber anders aufgebaut als bei Sarah. |
| P-5 | Nit | PDF, Überschrift und Kostenzeile | Die Überschrift heisst «Heiz- und Warmwasserkosten», das Profil «Heizung + Warmwasser», die Kostenzeile aber nur «Heizung». Ein Mieter fragt sich, ob das Warmwasser in «Heizung» oder in «Kaltwasser» steckt. |
| P-6 | Nit | PDF Sarah Meier | Die Herleitung ist ein langer Fliesstext: zwei Monatslisten, zwei Summen und eine Formel in einem Absatz. Nachrechnen lässt sie sich, aber nur mit Mühe. Zwei getrennte Zeilen (Monate Ihres Mietverhältnisses / Monate der Abrechnungsperiode) wären leichter zu lesen. |

## Beobachtungen

- **Rundung Heizung Sarah:** Mit den gedruckten Werten ergibt sich 693.16 × 83.53 % = 579.00, so wie gedruckt. Mit dem ungerundeten Bruch gerechnet (693.15625 × 55.8/66.8) ergibt sich 579.01. Das PDF lässt sich nachrechnen, aber offenbar wird mit dem gerundeten Prozentsatz gerechnet. 1 Rappen Unterschied; das sind Beträge, also Sache von `daten-pruefer`.
- **TV/Kabelanschluss in der 9-Monats-Periode:** Die Kosten der Liegenschaft betragen CHF 912.00, gleich viel wie in der Jahresabrechnung. Sarah zahlt neu CHF 151.16 statt CHF 113.06 (181/273 statt 181/365 Tage). Offenbar steckt eine Jahresrechnung ohne Leistungszeitraum ganz in der kürzeren Periode. Laut Legende ist das richtig, für eine Mieterin aber auffällig.
- **Heizkosten Sarah alt und neu:** Für dieselben Monate Jan–Jun zahlte sie in der Jahresabrechnung CHF 588.39, in der Periode Jan–Sep CHF 579.00. Das ist erklärbar, weil die Kosten der Periode (2'705.00) auf 66.80 % der Profilmonate verteilt werden. Für einen Mieter ist aber nicht einsichtig, warum die Wahl der Periode seinen Heizbetrag ändert.
- **Anzeige der Prozente:** Auf der Detailseite stehen teils eine, teils zwei Nachkommastellen (21.4 %, 12.6 %, 16.99 %), im PDF immer zwei (83.53 %).
- **Zeile «Heizprofil»** steht zwischen Tabelle und Zwischensumme, mitten in den Betragszeilen. Sie sieht aus wie ein Betrag, ist aber nur Text.
- **Hilfetext in Schritt 3** des Assistenten (Heizprofil): sehr lang, mit Zählerständen, Heizkostenverteilern und dem Löschen von Entwürfen in einem Absatz. Inhaltlich hilfreich, aber schwer zu überblicken.
- **Vorauswahl in Schritt 3:** Vorgewählt war ein Profil «Mein Haus», das ich nicht angelegt habe (wohl von einer anderen Persona). Ich habe «Heizung + Warmwasser» gewählt, wie bei Nina. Ich werte das nicht als Befund.
- **Uhrzeit:** Im Assistenten stand «Entwurf gespeichert, 19:19», im Verlauf der Abrechnung «Erstellt 16.10.2026, 21:19». Das sind zwei Stunden Unterschied. Vermutlich läuft der Testbrowser in UTC; nicht bewertet.
- **Periode bis 30.09.2025:** Sarah ist am 30.06.2025 ausgezogen. Der Assistent fragt nicht nach, warum die Periode bis 30.09. läuft. Das PDF zeigt korrekt «Ihr Mietverhältnis in dieser Periode: 01.01.2025 – 30.06.2025 (181 Mietstage von 273 Tagen)».
- **Heizprofil «Heizung Bergregion»** (Einstellungen): Juli 1 %, August 4 %. Im August viermal so viel Heizung wie im Juli wirkt unplausibel; nicht Teil der Aufgabe.
- **Löschdialog:** «Die Abrechnung NK-22222222-2025-0002 von Sarah Meier wird gelöscht. Das lässt sich nicht rückgängig machen.» Klar und gut.
- **PDF Thomas Weber:** Hier fehlt der Abschnitt zum Heizprofil, der Zeitanteil Heizung ist 365/365 Tage, und die Legende enthält den Satz zum Heizprofil nicht. Das ist stimmig.

## Aufgabe geschafft: ja

## Aufwand

Etwa 25 Minuten, rund 18 Schritte: Liste, 3 Detailseiten, Heizprofile, Löschen, 5 Assistentenschritte, «PDF erstellen», 3 PDFs.

## Ablauf

1. **Liste der Nebenkostenabrechnungen.** Erwartet: die Entwürfe 2025 der Seepark Residenz. Gesehen: Thomas Weber, Nina Brunner, Sarah Meier und Marco Bernasconi, alle mit Periode 01.01.2025 – 31.12.2025.
2. **Detail Thomas Weber.** Erwartet: ein Hinweis, dass kein Heizprofil nötig ist. Gesehen: «Heizprofil: Heizung + Warmwasser (nicht angewendet: Mietvertrag über die ganze Periode)». Heizung hat denselben Anteil (21.25 %) wie die anderen Flächenpositionen. Verstanden und plausibel.
3. **Detail Nina Brunner.** Erwartet: «angewendet, weil Einzug 01.07.2025». Gesehen: nur «Heizprofil: Heizung + Warmwasser». Heizung 11.33 %, die übrigen Flächenpositionen 12.92 % (184 Mietstage). Den Grund erschliesse ich mir selbst; die Seite sagt ihn nicht (P-1, P-2).
4. **Einstellungen › Heizprofile.** Nachgeschaut, um zu verstehen, was das Profil macht. Gesehen: «Heizung + Warmwasser» mit Monatsanteilen, Jan–Jun zusammen 55.8 %, Jul–Dez 44.2 %. Damit kann ich Ninas 11.33 % nachrechnen (25.625 % × 44.2 % = 11.33 %).
5. **Sarahs alten Entwurf gelöscht.** Erwartet: eine Bestätigung mit der Folge. Gesehen: ein klarer Dialog, danach die Liste mit 6 statt 7 Entwürfen.
6. **Assistent, Schritt 1:** Ende auf 30.09.2025 gesetzt. **Schritt 2:** Seepark Residenz gewählt («12 Rechnungen in der Abrechnungsperiode, 4 Wohnungen»). **Schritt 3:** «Heizung + Warmwasser» gewählt, Verwaltungspauschale 3 %. **Schritt 4, Vorschau:** 1 Abrechnung (Sarah Meier, Kosten CHF 1'467.25, Nachzahlung CHF 147.25), dazu der Hinweis «Es gibt schon Abrechnungen … 3», die angekreuzt werden muss. **Schritt 5:** «Entwürfe erstellen», danach «1 Nebenkostenabrechnung ist als Entwurf erstellt.» Alles wie erwartet.
7. **Neuer Entwurf NK-22222222-2025-0005.** Erwartet: «PDF herunterladen». Gesehen: zuerst «PDF erstellen», danach «PDF herunterladen» und im Verlauf «PDF erstellt». Heizung 21.4 %, die anderen Positionen 16.99 %, ohne Erklärung (P-1, P-2).
8. **PDF Sarah.** Abschnitt «Heiz- und Warmwasserkosten» auf Seite 1: 55.80 % / 66.80 % = 83.53 %. Nachgerechnet: Monatssummen richtig. 2'705.00 × 82/320 = 693.16, × 83.53 % = 579.00 wie gedruckt. Die Sätze sind verständlich, aber dicht (P-6). Ein Grund für das Profil fehlt (P-3).
9. **PDF Nina.** Abschnitt auf Seite 2: «44.20 % der Heizkosten Ihrer Wohnung». Monate Jul–Dez nachgezählt: 44.20 %. 4'115.00 × 82/320 = 1'054.47, × 44.20 % = 466.08 wie gedruckt. Summe und Formel fehlen (P-4). Ein Grund fehlt auch hier (P-3).
10. **PDF Thomas** (zum Vergleich): kein Heizprofil-Abschnitt, 365/365 Tage. Stimmig.

## Verwirrung

- «Heizprofil» ist auf der Detailseite und im PDF ein Fachwort ohne Erklärung. Erklärt wird es nur auf der Einstellungsseite, die ein Mieter nie sieht.
- «Anteil» auf der Detailseite meint den Anteil an den Kosten des Gebäudes. Im PDF heissen die Spalten «Wohnungsanteil» und «Zeitanteil». Die beiden Darstellungen lassen sich nicht direkt vergleichen.
- «Heiz- und Warmwasserkosten» gegenüber der Kategorie «Heizung»: Wo ist das Warmwasser? (P-5)
- «Mietvertrag über die ganze Periode» (Detailseite) gegenüber «Mietverhältnis» (PDF): verschiedene Wörter für dasselbe, aber verständlich.

## Fehlerrisiken

- Der Vermieter sieht auf der Detailseite einen höheren Heizanteil (21.4 % statt 16.99 %), kann ihn dort nicht prüfen und versendet die Abrechnung womöglich, ohne das PDF zu lesen.
- Ein Mieter mit Einzug im Winter oder Auszug im Frühling sieht einen überproportionalen Heizanteil, ohne Begründung. Das kann zu Rückfragen oder zum Bestreiten der Abrechnung führen (P-3).
- Wird die Periode anders gewählt, ändert sich der Heizbetrag des Mieters für dieselben Monate (siehe Beobachtungen). Das lässt sich gegenüber dem Mieter schwer erklären.

## Vorschläge

- **P-1:** Seepark Residenz › Abrechnung Nina Brunner 2025 öffnen. Unter «Kostenaufstellung» steht «Heizprofil: Heizung + Warmwasser» ohne Status. Hilfreich wäre analog zu Thomas: «Heizung + Warmwasser (angewendet: Mietvertrag nur 01.07.2025 – 31.12.2025)».
- **P-2:** Abrechnung Sarah Meier (01.01.–30.09.2025) öffnen und die Zeile Heizung (21.4 %) mit Kaltwasser (16.99 %) vergleichen. Hilfreich wäre ein kurzer Satz unter der Tabelle wie im PDF, mit dem Anteil nach Heizprofil (83.53 %) und den Monaten, oder ein Hinweis direkt an der Zeile Heizung.
- **P-3:** PDF von Nina Brunner oder Sarah Meier öffnen, Abschnitt «Heiz- und Warmwasserkosten». Hilfreich wäre ein einleitender Satz wie: «Weil Ihr Mietverhältnis nicht die ganze Abrechnungsperiode umfasst, werden die Heizkosten nach Monaten verteilt: Im Winter wird mehr geheizt als im Sommer.»
- **P-4:** PDF von Nina Brunner, Seite 2. Hilfreich wäre die Summe wie bei Sarah: «… Dez 13.00 %; zusammen 44.20 % von 100 % des Jahres.»
- **P-5:** PDF, Kostenübersicht und Überschrift. Entweder die Überschrift an die Kategorie angleichen oder einen Satz ergänzen, wo das Warmwasser abgerechnet wird.
- **P-6:** PDF von Sarah Meier, Seite 1, letzter Absatz. Die Herleitung in drei Zeilen gliedern: Monate des Mietverhältnisses, Monate der Abrechnungsperiode, Formel.

## Nicht geprüft

- Heizprofile mit 0-%-Monaten (etwa «Heizung Mittelland» bei Einzug im Sommer) und die Wahl «kein Heizprofil»: nicht Teil der Aufgabe, und ich wollte keine weiteren Entwürfe in der Seepark Residenz anlegen.
- Marco Bernasconis Abrechnung: nicht verlangt.
- Andere Sprachen des PDFs und der Mobile-Viewport: nicht meine Persona.
- Ob die Beträge allgemein stimmen (Verteilschlüssel, Rechnungsabgrenzung): Sache von `daten-pruefer`; ich habe nur die Heizposition nachgerechnet.
