# Dr. Weber – Begriffe für Gebäude und Kosten in App und Abrechnungs-PDF (DE/FR/IT)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. Gebäude: Seepark Residenz (persona-App, Demodaten, 17.10.2026).
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/b8c95026-3aa3-5859-8108-acb1ea5b0967/scratchpad/persona-weber/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | PDF FR und IT, Erläuterung unter der Kostentabelle | Die Definition des Wohnungsanteils lässt auf Französisch und Italienisch «Anteil an» weg: «Part du logement : coûts de l'immeuble selon la clé de répartition» und «Quota appartamento: costi dell'immobile secondo la chiave di riparto». Wörtlich heisst das, der Wohnungsanteil *seien* die Kosten des Gebäudes. Auf Deutsch steht richtig «der Anteil Ihrer Wohnung an den Kosten des Gebäudes nach dem Verteilschlüssel». |
| P-2 | Minor | Abrechnung (App) und PDF, Kostentabelle | Das gleiche Wort meint zweierlei: In der App ist «Anteil» eine Prozentzahl (12.6 %) und der Franken-Betrag heisst «Betrag». Im PDF ist «Ihr Anteil» der Franken-Betrag (114.94), eine Prozentspalte gibt es dort nicht. Wer am Telefon mit der Mieterin «Ihren Anteil» bespricht, meint je nach Bildschirm etwas anderes. |
| P-3 | Nit | Abrechnung (App) und PDF, Titel der Tabelle | Die App schreibt «Kostenaufstellung» (Tabellenbeschriftung «Abrechnungspositionen»), das PDF «Kostenübersicht (CHF)». |
| P-4 | Nit | PDF IT, Kostentabelle | Die Spalte heisst «Costi immobile» (ohne Artikel), die Erläuterung darunter aber «costi dell'immobile». Auf Französisch ist es einheitlich («Coûts de l'immeuble»). |

Sonst sind die Wörter für Gebäude und Kosten in App und PDF gleich: Gebäude, Kosten des Gebäudes, Wohnungsanteil, Zeitanteil, Verteilschlüssel, Zwischensumme, Verwaltungspauschale, Ihre Nebenkosten, Geleistete Akontobeiträge.

## Beobachtungen

- Bei 1440 px Breite ist die Spalte «Betrag» in der Kostenaufstellung der App abgeschnitten: Man sieht nur «CHF», die Beträge erst nach seitlichem Scrollen in der Karte (Tabelle 1069 px breit, Karte 988 px). Ausgerechnet die Spalte, auf die es ankommt, ist nicht zu sehen.
- In der App steht beim Heizungs-Zeitanteil «44.20 % nach Heizprofil», im PDF nur «44.20 %». Die Erläuterung im PDF und Seite 2 («Heiz- und Warmwasserkosten») sagen aber, woher die Zahl kommt. Das genügt mir.
- Die Abrechnungsseite zeigt nicht, in welcher Sprache das PDF entsteht. Dass es nach der Änderung französisch war, sah ich erst im PDF.
- Unter «Verlauf» steht nur die Zeit des letzten «PDF erstellt» (04:03, dann 04:04, dann 04:05). Dass vorher eine deutsche Fassung erstellt wurde, ist nicht mehr zu sehen. Für einen Entwurf ist das unkritisch, beim Versand wüsste ich aber gerne, welche Fassung hinausging.
- Französisch: «Nous vous virons le montant jusqu'au 16.11.2026» klingt umgangssprachlich und ist missverständlich («virer» heisst auch «entlassen»; «jusqu'au» ist keine Frist). Besser wäre etwa «Nous vous verserons le montant au plus tard le 16.11.2026». Das betrifft nicht die Wörter für Gebäude und Kosten.
- Italienisch: «Portiere» für den Hauswart ist verständlich, in der Schweiz ist aber «custode» üblicher. «Chiave di riparto» geht, gebräuchlicher ist «chiave di ripartizione». «Arrotondamento» steht ohne «a 5 centesimi», auf Deutsch und Französisch mit Angabe. Gesetzesverweise (CO, OBLF, OLAL) sind richtig übersetzt.
- In der Kategorie «Kaltwasser» stehen Rechnungen «Wasser und Abwasser» (Demodaten).
- Das Dateifeld auf der Mieterseite zeigt «Choose File / No file chosen» auf Englisch. Das ist das Bedienelement des Browsers (headless Chromium), nicht die App.
- Nach dem Speichern erschien die Meldung «Nina Brunner gespeichert», und die Mieterseite zeigte «Sprache für Abrechnung und Mahnungen: Französisch». Klar und richtig.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, 9 Schritte (Übersicht, Entwürfe, Abrechnung Nina Brunner und PDF, Mieterseite, Bearbeiten, Speichern, Abrechnung und PDF erneut, Abrechnung und PDF Marco Bernasconi).

## Ablauf

1. **Übersicht → «Entwürfe ansehen».** Erwartet: Liste der Entwürfe. Gesehen: 7 Entwürfe, darunter Nina Brunner NK-22222222-2025-0003, Seepark Residenz, Wohnung A2, 01.07.–31.12.2025, Rückerstattung CHF 93.90.
2. **Abrechnung Nina Brunner öffnen.** Erwartet: Aufstellung mit Begriffen. Gesehen: Kopf «Nina Brunner, Seepark Residenz, Wohnung A2 · Abrechnungsperiode 01.01.2025 – 31.12.2025», Karte «Kostenaufstellung» mit den Spalten Kategorie, Verteilschlüssel, Kosten des Gebäudes, Wohnungsanteil, Zeitanteil, Anteil, Betrag. «Betrag» ist bei 1440 px abgeschnitten (Screenshot `03-statement-nina-de.png`). Unter jeder Kategorie stehen die verlinkten Rechnungen.
3. **«PDF herunterladen».** Erwartet: dieselben Wörter. Gesehen: Kopfblock «Gebäude / Seepark Residenz / Seeweg 15 / 6003 Luzern / Wohnung A2, EG, 82.00 m²», «Kostenübersicht (CHF)» mit Kategorie, Verteilschlüssel, Kosten des Gebäudes, Wohnungsanteil, Zeitanteil, Ihr Anteil, unter dem Schlüssel jeweils «1 / 4 Wohnungen» oder «82.00 / 320.00 m²». Darunter die Erläuterung: «Kosten des Gebäudes: die Rechnungen der Abrechnungsperiode … Wohnungsanteil: der Anteil Ihrer Wohnung an den Kosten des Gebäudes nach dem Verteilschlüssel. Zeitanteil: Ihre Mietstage … Ihr Anteil ist der Wohnungsanteil mal der Zeitanteil. Bei Heizkosten ist der Zeitanteil der Anteil nach dem Heizprofil.» Nachgerechnet: 3'060.00 × 82/320 = 784.13; 784.13 × 184/365 = 395.29; 1'054.47 × 44.20 % = 466.08; die Monatsanteile Juli bis Dezember auf Seite 2 ergeben zusammen 44.20 %. Der Zusammenhang Gebäude → Wohnungsanteil → Ihr Anteil ist auf Deutsch verständlich und stimmt. Abweichungen zur App: P-2, P-3.
4. **Mieterseite Nina Brunner → «Bearbeiten».** Erwartet: ein Sprachfeld. Gesehen: Auswahl «Sprache für Abrechnung und Mahnungen» mit der Hilfe «In dieser Sprache erstellt Dwello die Nebenkostenabrechnung und die Mahnungen.» Auf «Französisch» gestellt, «Änderungen speichern».
5. **Nach dem Speichern.** Erwartet: Bestätigung. Gesehen: zurück auf der Mieterseite, Meldung «Nina Brunner gespeichert», Sprache «Französisch».
6. **Zurück zur Abrechnung, «PDF herunterladen» (gleicher Tag).** Erwartet: französisches PDF. Gesehen: ja, französisch: «Immeuble», «Appartement A2, rez-de-chaussée», «Décompte des charges», «Aperçu des coûts (CHF)», Spalten Catégorie, Clé de répartition, Coûts de l'immeuble, Part du logement, Part temporelle, Votre part; Sous-total, Frais de gestion, Vos frais accessoires, Acomptes versés. Die Begriffe sind gut gewählt und einheitlich. Die Erläuterung verfälscht aber den Wohnungsanteil (P-1). Die Seite selbst zeigt keinen Sprachhinweis.
7. **PDF Marco Bernasconi (Italienisch).** Erwartet: italienische Begriffe. Gesehen: «Immobile», «Appartamento B2, 1° piano», «Conteggio spese accessorie», «Riepilogo costi (CHF)», Spalten Categoria, Chiave di riparto, Costi immobile, Quota appartamento, Quota temporale, La sua quota; Subtotale, Spese di gestione 2.5 %, Le sue spese accessorie, Acconti versati, Importo dovuto, Seite 2 Einzahlungsschein italienisch. Gleicher Fehler in der Erläuterung (P-1), uneinheitlich «Costi immobile» / «costi dell'immobile» (P-4). In der App steht beim Heizprofil «nicht angewendet: Mietvertrag über die ganze Periode», im PDF entsprechend 365/365 und keine Heizprofil-Seite. Das ist folgerichtig.
8. Nichts versendet.

## Verwirrung

- «Anteil» (App, Prozent) und «Ihr Anteil» (PDF, Franken) (P-2).
- «Kostenaufstellung» und «Kostenübersicht» für dieselbe Tabelle (P-3).
- «Kosten des Gebäudes: die Rechnungen der Abrechnungsperiode» ist knapp. Gemeint ist die Summe der Rechnungen. Bei Rechnungen mit Leistungszeitraum ist der anteilige Betrag gemeint, der Satz danach erklärt das aber.

## Fehlerrisiken

- Eine französisch oder italienisch sprechende Mieterin liest in der Erläuterung, ihr «Wohnungsanteil» seien die Kosten des Gebäudes, während die Zahlen etwas anderes zeigen. Das führt zu Rückfragen oder Misstrauen gegenüber der Abrechnung (P-1).
- Abgleich App ↔ PDF am Telefon: «Ihr Anteil» heisst im PDF 114.94, in der App steht unter «Anteil» 12.6 % (P-2).
- Die Sprache ändert sich bei einem bestehenden Entwurf beim nächsten PDF ohne Hinweis auf der Abrechnungsseite.

## Vorschläge

- **P-1:** Reproduktion: Mieterin auf Französisch oder Italienisch stellen, Abrechnungs-PDF öffnen, Erläuterung unter der Tabelle lesen. Hilfe: wie auf Deutsch formulieren, etwa «Part du logement : la part de votre logement aux coûts de l'immeuble selon la clé de répartition» und «Quota appartamento: la quota del suo appartamento ai costi dell'immobile secondo la chiave di riparto».
- **P-2:** Reproduktion: Abrechnung NK-22222222-2025-0003 in der App und als PDF nebeneinander. Hilfe: In der App die Prozentspalte z. B. «Anteil in %» und die Betragsspalte «Ihr Anteil» nennen, oder im PDF dieselben Namen wie in der App verwenden.
- **P-3:** Reproduktion: wie P-2, Tabellentitel vergleichen. Hilfe: ein Titel für beide, z. B. «Kostenübersicht».
- **P-4:** Reproduktion: PDF von Marco Bernasconi (NK-22222222-2025-0004), Spaltenkopf mit Erläuterung vergleichen. Hilfe: Spalte «Costi dell'immobile».

## Nicht geprüft

- Englisches PDF: keine Mieterin auf Englisch in der Seepark Residenz in der Aufgabe.
- Wie Mahnungen in der geänderten Sprache aussehen: es gibt keine fällige Abrechnung in diesem Gebäude, und nichts durfte versendet werden.
- Beträge im Detail (Rundung, Verwaltungspauschale 2.5 % gegenüber 3 %): nur stichprobenweise nachgerechnet. Das ist Sache von daten-pruefer.
- Nina Brunners Sprache habe ich bei Französisch gelassen, wie es die Aufgabe verlangt.
