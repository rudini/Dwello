# Persona-Lauf: Dr. Weber – Issue 208 (Zeitanteil im PDF der Nebenkostenabrechnung)

Persona: Dr. Weber, 52, rechtlich vorsichtig, liest alles, rechnet nach. Desktop 1440 × 900, Maus.
Aufgabe: Nebenkostenabrechnung 2025 von Anna Schmidt (Entwurf) und von Nina Brunner (Entwurf) öffnen, PDF erstellen und lesen; die Kostenübersicht wie der Mieter lesen: Lassen sich die Spalte «Zeitanteil» und «Ihr Anteil» aus dem PDF nachrechnen, und erklären die Texte unter der Tabelle richtig, wie der Zeitanteil gebildet wird (Tage vs. Prozent, Hinweis auf das Heizprofil)? Nichts versendet, keine Daten geändert.

Skripte und Bilder: `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/weber-issue-208/` (`schmidt.pdf`, `brunner.pdf`, `schmidt-1.png`, `schmidt-2.png`, `brunner-1.png`, `brunner-2.png`, `03-schmidt-detail.png`, `04-brunner-detail.png`).

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | PDF Brunner, Erklärung unter der Tabelle | Der Satz «Zeitanteil: …, bei Heizkosten der Anteil nach dem Heizprofil» verweist nicht auf den Abschnitt «Heiz- und Warmwasserkosten» auf Seite 2, wo die 44.20 % hergeleitet werden. Bei Anna Schmidt steht beim Tank-Satz ein solcher Verweis («siehe Heiz- und Warmwasserkosten»), hier fehlt er. |
| P-2 | Minor | PDF Schmidt und Brunner, Erklärung unter der Tabelle | «Zeitanteil: Ihre Mietstage in der Abrechnungsperiode» beschreibt nur den Zähler. Die Spalte zeigt aber einen Bruch («184/365 Tage»). Dass durch die Tage der Abrechnungsperiode geteilt und dann mit dem Wohnungsanteil multipliziert wird («Ihr Anteil = Wohnungsanteil × Zeitanteil»), steht nirgends. Ich konnte es erschliessen, ein Mieter muss es erraten. |
| P-3 | Nit | PDF Brunner, Seite 2 «Heiz- und Warmwasserkosten» | «Anteile der Monate Ihres Mietverhältnisses: Jul 3.70 % …» sagt nicht, wovon das Anteile sind (vom Jahresbedarf nach Heizprofil, das Jahr = 100 %). Die Summe 44.20 % kann ich bilden, aber die Herkunft der Monatswerte ist nicht erklärt. |

Keine Blocker und keine Major-Befunde: Alle Zahlen lassen sich aus dem PDF nachrechnen, und die Erklärung ist sachlich richtig.

## Beobachtungen

- Die Detailseite der Abrechnung in der App zeigt keine Spalte «Zeitanteil», sondern nur einen kombinierten «Anteil» (z. B. Brunner, Hauswart 12.92 % = 82/320 × 184/365; Heizung 11.33 % = 82/320 × 44.20 %). Der Verwalter sieht damit am Bildschirm etwas anderes als der Mieter im PDF und kann den Zeitanteil dort nicht direkt prüfen.
- Uneinheitliche Nachkommastellen in der Spalte «Anteil» der Detailseite: «12.6 %» (TV/Kabelanschluss) neben «12.92 %».
- Begriffe: Detailseite «Kosten des Gebäudes», PDF «Kosten Liegenschaft» und Adressblock «Liegenschaft». Zwei Wörter für dasselbe.
- Detailseite Schmidt nennt «Heizprofil: Heizung Mittelland»; das PDF erwähnt das Heizprofil bei Schmidt gar nicht (Ganzjahresmiete, Zeitanteil 365/365). Sachlich richtig, weil das Profil über das ganze Jahr 100 % ergibt; ein Mieter, der davon weiss, könnte aber fragen, warum es fehlt.
- PDF Schmidt: Die Tabelle endet auf Seite 1 mit viel Leerraum; Zwischensumme, Saldo und die Erklärung stehen erst auf Seite 2, getrennt von der Tabelle, die sie erklärt.
- Der Abschnitt heisst «Heiz- und Warmwasserkosten», die Zeile in der Tabelle «Heizung».

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, 8 Schritte (Übersicht, Entwurfsliste, 2 × Detailseite, 2 × PDF herunterladen, 2 × PDF lesen und nachrechnen).

## Ablauf

1. **Übersicht öffnen.** Erwartet: Hinweis auf Entwürfe. Gesehen: «7 Nebenkostenabrechnungen sind noch im Entwurf», Link «Entwürfe ansehen». Passt.
2. **Entwurfsliste.** Erwartet: Anna Schmidt und Nina Brunner. Gesehen: beide, mit Saldo (Schmidt Rückerstattung CHF 6.50, Brunner Rückerstattung CHF 93.85) und PDF-Link.
3. **Detail Anna Schmidt.** Erwartet: Positionen mit Zeitanteil. Gesehen: Tabelle «Kategorie / Verteilschlüssel / Kosten des Gebäudes / Anteil / Betrag», Heizprofil «Heizung Mittelland», «365 Mietstage». Kein Zeitanteil, aber bei Ganzjahresmiete egal.
4. **PDF Schmidt herunterladen** (Link «PDF herunterladen»). Erwartet: Download. Gesehen: Datei `abrechnung-c21d….pdf`, 2 Seiten.
5. **PDF Schmidt lesen.** Kopf: «Ihr Mietverhältnis in dieser Periode: 01.01.2025 – 31.12.2025 (365 Mietstage von 365 Tagen)». Kostenübersicht mit «Kosten Liegenschaft / Wohnungsanteil / Zeitanteil / Ihr Anteil», jede Zeile «365/365 Tage», Ihr Anteil = Wohnungsanteil. Nachgerechnet:
   - Lift 1’690.00 / 6 = 281.67; Kehricht 990.00 / 6 = 165.00.
   - Fläche 92.00 / 492.50 = 18.680 %: Hauswart 687.43, Kaltwasser 717.32, Allgemeinstrom 142.49, Gartenpflege 174.66, Kaminfeger 62.58. Alle stimmen.
   - Heizung 6’957.80 × (70 % × 92/492.5 + 30 % × 1/6) = 6’957.80 × 0.18076 = 1’257.70. Stimmt; die Formel steht in der Zeile.
   - Summe 3’488.85, 3 % = 104.67, total 3’593.52, Akonto 3’600.00, Rückerstattung 6.48 → 6.50. Stimmt.
   - Erklärung: «Zeitanteil: Ihre Mietstage in der Abrechnungsperiode.» Kein Hinweis auf Heizprofil, dafür zum Tank. Für eine Ganzjahresmiete richtig.
6. **Detail Nina Brunner.** Gesehen: 184 Mietstage, Heizprofil «Heizung + Warmwasser», kombinierte Anteile (12.6 %, 12.92 %, 11.33 %).
7. **PDF Brunner herunterladen.** Datei `abrechnung-56cf….pdf`, 2 Seiten.
8. **PDF Brunner lesen und nachrechnen.** Kopf: «01.07.2025 – 31.12.2025 (184 Mietstage von 365 Tagen)». Zeitanteil «184/365 Tage» bei allen Zeilen, bei Heizung «44.20 %».
   - TV/Kabel 912.00 / 4 = 228.00 × 184/365 = 114.94. Stimmt.
   - Fläche 82/320 = 25.625 %: Hauswart 784.13 × 184/365 = 395.29 (aus dem gedruckten, gerundeten Wohnungsanteil; ungerundet käme 395.28 heraus, gerechnet wird also mit dem, was der Mieter sieht – gut). Kaltwasser 527.88 → 266.11, Allgemeinstrom 127.95 → 64.50. Stimmen.
   - Heizung 1’054.47 × 44.20 % = 466.08. Stimmt. Seite 2: Monate Jul 3.70 + Aug 3.60 + Sep 3.70 + Okt 9.50 + Nov 10.70 + Dez 13.00 = 44.20 %. Stimmt.
   - Summe 1’306.92, 3 % = 39.21, total 1’346.13, Akonto 1’440.00, 93.87 → 93.85. Stimmt.
   - Erklärung: «Zeitanteil: Ihre Mietstage in der Abrechnungsperiode, bei Heizkosten der Anteil nach dem Heizprofil.» Richtig: Tage dort, wo «x/365 Tage» steht, Prozent bei Heizung. Ohne Verweis auf Seite 2 (P-1) und ohne Formel (P-2).

## Verwirrung

- «Zeitanteil» ist als «Ihre Mietstage» erklärt, in der Spalte steht aber ein Bruch bzw. ein Prozentsatz. Was mit dem Wert gerechnet wird, muss man selbst herausfinden (P-2).
- Warum Heizung 44.20 % und nicht 184/365 = 50.41 %: erst Seite 2 klärt das, der Leser muss sie selbst finden (P-1).
- «Anteile der Monate» – Anteile woran? (P-3)
- «Liegenschaft» im PDF gegenüber «Gebäude» in der App.

## Fehlerrisiken

- Ein Mieter, der 184/365 = 50.41 % auch auf die Heizung anwendet, hält die Heizkosten für falsch berechnet (zu niedrig), oder umgekehrt hält er sich bei anderen Profilen für benachteiligt, wenn er die Herleitung auf Seite 2 nicht findet.
- Rundung: «Ihr Anteil» wird aus dem gerundeten Wohnungsanteil berechnet; das ist nachrechenbar, aber nirgends gesagt. Bisher keine Abweichung gefunden.

## Vorschläge

- **P-1:** Reproduktion: PDF der Abrechnung NK-22222222-2025-0003 (Nina Brunner) herunterladen, Seite 1 Erklärung unter der Tabelle lesen. Hilfreich: «…, bei Heizkosten der Anteil nach dem Heizprofil (siehe Heiz- und Warmwasserkosten).»
- **P-2:** Reproduktion: PDF Schmidt (NK-11111111-2025-0002) oder Brunner, Erklärung lesen. Hilfreich: «Zeitanteil: Ihre Mietstage im Verhältnis zu den Tagen der Abrechnungsperiode, bei Heizkosten … Ihr Anteil: Wohnungsanteil × Zeitanteil.»
- **P-3:** Reproduktion: PDF Brunner, Seite 2. Hilfreich: «Anteile der Monate Ihres Mietverhältnisses am Jahresbedarf nach Heizprofil (ganzes Jahr = 100 %): …».

## Nicht geprüft

- Ein Mietverhältnis, das mitten im Monat beginnt oder endet (wie der Monatsanteil des Heizprofils dann gekürzt wird): Die beiden Entwürfe beginnen am Monatsersten bzw. laufen das ganze Jahr.
- Heizung mit Heizprofil und Tank gleichzeitig bei Teiljahresmiete: kommt in den beiden Abrechnungen nicht vor.
- Andere Sprachen des PDFs; versendete Abrechnungen; QR-Rechnung (beide sind Rückerstattungen, ohne Einzahlungsschein).
