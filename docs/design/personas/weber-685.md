# Dr. Weber – Heizkostenanteil im Abrechnungs-PDF (#685)

Desktop 1440 × 900, Maus. Persona-App auf :3300 (Stand w-685). Nichts gespeichert (kein Gebäude zugewiesen); PDFs nur heruntergeladen.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/weber-685/`.

Geprüft: NK-22222222-2025-0003 (Nina Brunner, Seepark Residenz A2, 01.07.–31.12.2025, Heizprofil «Heizung + Warmwasser»), NK-22222222-2025-0002 (Sarah Meier, A2, 01.01.–30.06.2025), NK-11111111-2025-0001 (Hans Müller, Musterhaus Zentrum, acht Positionen), NK-11111111-2025-0003 (Pierre Dubois, französisches PDF), NK-11111111-2025-0004 (Maria Rossi, italienisches PDF, nur angesehen).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| W-1 | Minor | PDF, Heizungsposition und Abschnitt «Heiz- und Warmwasserkosten» | Nirgends im PDF steht, dass das Heizprofil die Heizkosten eines Jahres auf die zwölf Monate verteilt (zusammen 100 %). Die Zeile heisst «Anteile der Monate im Heizprofil: Jan 13.60 %, Feb 12.10 %, Mär 11.50 %; zusammen 37.20 %». Warum Januar 13.60 % «wert» ist und worauf sich die Prozente beziehen, erschliesst sich nur, wenn man selbst alle vier Zeilen addiert (ergibt 100.00 %). Die zwölf Monatswerte des Profils stehen nirgends am Stück; der Abschnitt «Heiz- und Warmwasserkosten» verweist nur zurück auf die Position. |
| W-2 | Minor | Detailseite «Kostenaufstellung» gegenüber PDF «Kostenübersicht» | Die Spalte «Anteil» auf der Detailseite (jetzt 12.60 %, 11.24 % usw.) ist ein Prozentwert, die Spalte «Ihr Anteil» im PDF ist ein Frankenbetrag (114.94, 462.53); den Frankenbetrag nennt die Detailseite «Betrag». Wer beide nebeneinander vergleicht, liest «Anteil» und «Ihr Anteil» leicht als dasselbe. Der Prozentwert «Anteil» kommt im PDF gar nicht vor. |

## Beobachtungen

- Seitenumbruch tut, was angekündigt war: Bei Brunner und Meier steht auf Seite 1 die Tabelle bis «Kaltwasser», «Allgemeinstrom» rückt mit Zwischensumme, Akontobeiträgen und Saldo auf Seite 2, der Tabellenkopf (Kategorie … Ihr Anteil) wiederholt sich dort. Die Erläuterung (Kosten des Gebäudes / Wohnungsanteil / Zeitanteil …) steht direkt unter dem Saldo. Bei Müller (acht Positionen) ebenso mit «Kaminfeger» auf Seite 2, im französischen PDF von Dubois mit «Ramonage». Auf Seite 1 bleibt dadurch unten etwa ein Drittel leer; das stört mich nicht.
- Erläuterung «Bei Heizkosten ist der Zeitanteil der Anteil nach dem Heizprofil (siehe Heiz- und Warmwasserkosten)»: Der Abschnitt mit genau diesem Titel steht auf derselben Seite darunter, der Verweis ist also auffindbar. Andere Abschnittsnamen im PDF stehen in «…» (z. B. «Heizung + Warmwasser»), dieser Verweis nicht.
- Nachrechnen gelang mir aus dem PDF allein: Brunner, Rechnung Q3: 11.00 % / 11.00 % = 100.00 %; Q1: 0.00 % / 37.20 % = 0.00 %; (395.00 + 1'410.00) / 4'115.00 = 43.86 %; 1'054.47 × 1'805 / 4'115 = 462.53. Stimmt mit der Detailseite überein (Zeitanteil 43.86 %, Anteil 11.24 % = 25.625 % × 43.86 %, Betrag CHF 462.53). Meier entsprechend 56.14 % und CHF 591.94; Brunner + Meier = 1'054.47. Die Anteile der Spalte «Anteil» auf der Detailseite habe ich für TV, Hauswart und Heizung nachgerechnet, alle stimmen auf zwei Stellen.
- Die Formelzeile im PDF lautet «Ihr Anteil: 1'054.47 × Zeitanteil (1'520.00 × 0.00 % + … ) / 4'115.00 = 462.53». Das eingeschobene Wort «Zeitanteil» liest sich zuerst wie ein weiterer Faktor (1'054.47 × Zeitanteil × (…)); gemeint ist wohl «Zeitanteil = (…) / 4'115.00». Auf der Detailseite fehlt das Wort.
- Die Detailseite zeigt pro Heizrechnung nur «Anteil nach Heizprofil: 100.00 %», ohne die Monatsanteile; das PDF ist hier ausführlicher als die Ansicht des Verwalters. Ich muss also das PDF öffnen, um zu sehen, was der Mieter liest.
- Bei Müller (ganzes Jahr, Heizöl aus dem Tank) steht beim Heizprofil auf der Detailseite «Heizung Mittelland (nicht angewendet: Mietvertrag über die ganze Periode)», im PDF erscheint das Heizprofil gar nicht und die Heizung hat «365/365 Tage». Folgerichtig.
- Überschrift der Tabelle: Detailseite «Kostenaufstellung», PDF «Kostenübersicht (CHF)».
- Im Abschnitt «Heiz- und Warmwasserkosten» des Tank-Falls ist der Satz «Abgerechnet wird das verbrauchte Heizmaterial, nicht der Einkauf.» (französisch «Le décompte porte sur le combustible consommé et non sur les achats.») fett und so gross wie eine Überschrift gesetzt; er wirkt wie ein zweiter Titel.
- Französisches PDF (Dubois): Begriffe durchgehend französisch, Tabellenkopf auf Seite 2 wiederholt («Catégorie … Votre part»). «Montant à payer avant arrondi» bricht in der Betragsspalte auf zwei Zeilen um.
- Die Sprache des PDFs folgt dem Mieter (Rossi bekommt Italienisch), nicht der Oberfläche.

## Aufgabe geschafft: teilweise

Deutsch vollständig geprüft und nachgerechnet; den neuen Heizprofil-Text auf Französisch konnte ich nicht sehen (siehe «Nicht geprüft»).

## Aufwand

Etwa 20 Minuten, rund 20 Schritte (Liste, vier Detailseiten, fünf PDF-Downloads, Nachrechnen).

## Ablauf

- PDF Brunner, Heizungsposition: erwartet, dass erklärt wird, was ein Heizprofil ist (Verteilung der Jahresheizkosten auf zwölf Monate). Gesehen: nur die Monatsprozente pro Rechnung und im Abschnitt «Heiz- und Warmwasserkosten» Profilname und Quelle (Merkblatt Mieterverband), keine Aussage über die Jahresverteilung (W-1).
- Vergleich Detailseite mit PDF: erwartet, dass «Anteil» an beiden Orten dasselbe meint. Gesehen: Prozent auf der Detailseite, Franken im PDF (W-2).
- Französisches PDF: erwartet, eine französische Abrechnung mit Heizprofil und kurzem Mietverhältnis zu finden. Gesehen: einzig Dubois ist französisch, ganzjährig, Heizung aus dem Tank; der neue Heizprofil-Text erscheint darin nicht.

## Vorschläge

- W-1: Abrechnung NK-22222222-2025-0003 öffnen, «PDF herunterladen», Seite 1 Position «Heizung» und Seite 2 Abschnitt «Heiz- und Warmwasserkosten» lesen. Hilfreich: im Abschnitt «Heiz- und Warmwasserkosten» ein Satz wie «Das Heizprofil verteilt die Heizkosten eines Jahres auf die zwölf Monate (zusammen 100 %)», am besten mit den zwölf Monatswerten des Profils als kleine Tabelle.
- W-2: Dieselbe Abrechnung auf der Detailseite neben dem PDF öffnen, Spalten «Anteil»/«Betrag» mit «Ihr Anteil» vergleichen. Hilfreich: gleiche Begriffe an beiden Orten, z. B. Detailseite «Ihr Anteil (%)» und «Ihr Anteil (CHF)», oder den Prozentwert auch im PDF zeigen.

## Nicht geprüft

- Neuer Heizprofil-Text auf Französisch (und Italienisch/Englisch): Alle Abrechnungen mit Heizprofil und kürzerem Mietverhältnis (Brunner, Meier) gehen an deutschsprachige Mieter. Die Sprache des PDFs folgt dem Mieter; diese zu ändern wäre Speichern ohne zugewiesenes Gebäude. Ich habe die Listen beider Seiten (17 Abrechnungen) durchgesehen; die einzige französische (Dubois 2025) hat Tankheizung und ganzes Jahr.
- Eine Heizrechnung, deren Leistungszeitraum das Mietverhältnis nur teilweise abdeckt (z. B. Einzug mitten im Quartal): In den Demodaten fallen alle Ein- und Auszüge auf Quartalsgrenzen, der Anteil nach Heizprofil ist daher immer 0 % oder 100 %. Gerade der Fall, in dem die Monatsgewichte wirklich etwas bewirken, liess sich nicht ansehen.
- Eine Abrechnung, deren Tabelle mehr als eine volle Seite füllt (Kopf auf drei Seiten): keine in den Demodaten.
