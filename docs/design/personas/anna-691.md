# Anna – #691: Kostenaufstellung auf «Abrechnung bearbeiten»

Persona: Anna, 29, erste eigene Wohnung vermietet, seit Monaten nicht mehr in Dwello. Desktop 1440 × 900, danach Mobile 390 × 844. Nur angeschaut, nichts gespeichert.
Geprüfte Abrechnung: NK-22222222-2025-0004 (Marco Bernasconi, Seepark Residenz, Wohnung B2, Entwurf).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Abrechnung bearbeiten, Mobile 390 × 844 | In der Kostenaufstellung bricht die Kategorie «TV/Kabelanschluss» mitten im Wort um: «TV/Kabelanschl» / «uss». Der Wert ist zwar ganz zu sehen, liest sich aber wie ein Tippfehler. |
| P-2 | Minor | Abrechnung bearbeiten, Desktop und Mobile | Der Hinweistext zur Kostenaufstellung sagt, dass man hier nichts ändern kann, verwendet aber Wörter, die ich nach Monaten nicht mehr einordnen kann: «Tankbestand» (ich habe keinen Tank), «einen anderen Satz» (welcher Satz? erst unten steht «Verwaltungspauschale 2.5 %»), und «auf der Seite des Entwurfs» (ich musste raten, dass damit die Seite gemeint ist, von der ich gekommen bin). Ein Link dorthin fehlt. |

## Beobachtungen

- **Alle Werte sichtbar, nichts abgeschnitten (Bearbeiten-Seite).** Auf 1440 × 900 zeigt «Abrechnung bearbeiten» die Kostenaufstellung nicht als Tabelle, sondern als eine Karte pro Position mit allen sieben Werten untereinander (Kategorie, Verteilschlüssel, Kosten des Gebäudes, Wohnungsanteil, Zeitanteil, Anteil, Betrag), darunter die Rechnungen als Links mit Betrag. Seite 1440 px breit, kein seitliches Scrollen. Gleich auf 390 × 844: Seitenbreite 390 px, alles untereinander lesbar.
- **Nicht änderbar ist klar.** Die Werte sind reiner Text ohne Felder; der Hinweis direkt unter «Kostenaufstellung» sagt «lassen sich hier nicht ändern». Was die Abschnitte zeigen, war mir klar: oben «Frist und Bemerkungen» mit Feldern, darunter «Kostenaufstellung» mit Zahlen.
- **Detailseite zum Vergleich: Spalte «Betrag» abgeschnitten.** Auf der Detailseite derselben Abrechnung (1440 × 900) ist die Kostenaufstellung eine Tabelle. Die Tabelle ist 1010 px breit, ihr Rahmen nur 988 px: Die letzte Spalte «Betrag» ist rechts angeschnitten («Betrag» als «Betra…», «CHF 228.0…», «CHF 1’221.6…»), nur seitliches Scrollen in der Tabelle zeigt sie ganz. Gerade der Betrag ist der Wert, den ich suche. Die Bearbeiten-Seite zeigt dieselben Werte vollständig. Auf Mobile zeigt auch die Detailseite keine Tabelle (Seite 390 px breit, kein seitliches Scrollen).
- **Kartenlayout auf Desktop sehr lang.** Auf 1440 px stehen Bezeichnung (links) und Wert (rechts) rund 340 px auseinander; die Seite ist über 4000 px hoch, und «Änderungen speichern» liegt ganz unten, weit weg von den zwei Feldern ganz oben. Wer nur die Frist ändern will, muss an allen fünf Positionen vorbeiscrollen. Auf Mobile ist es ebenso (rund 4750 px), dort steht «Änderungen speichern» über «Abbrechen».
- **Name der Aktion.** Auf der Detailseite heisst der Link «Frist und Bemerkungen bearbeiten»; die Seite, auf die er führt, heisst «Abrechnung bearbeiten». Ich habe zuerst einen Knopf «Abrechnung bearbeiten» gesucht und ihn unter «Weitere Aktionen» rechts unten gefunden. Der Seitentitel verspricht mehr, als man dort ändern kann; der Hinweis klärt das erst weiter unten.
- **Statusfilter in der Liste:** «7 Entwurf» filtert die Liste richtig auf 7 Abrechnungen.
- Zwischensumme, Verwaltungspauschale, Akontobeiträge, Rundung und Saldo stehen auf beiden Seiten gleich; Heizprofil mit Erklärung «nicht angewendet: Mietvertrag über die ganze Periode» auf beiden Seiten.

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten, 6 Schritte (Übersicht, Nebenkostenabrechnungen, Filter «Entwurf», Abrechnung öffnen, «Frist und Bemerkungen bearbeiten», dieselbe Seite auf Mobile).

## Ablauf

- Abrechnung öffnen und bearbeiten: erwartet einen Knopf «Abrechnung bearbeiten» oben bei «PDF herunterladen»; gesehen nur «PDF herunterladen» und «Per E-Mail senden», der Weg zum Bearbeiten heisst «Frist und Bemerkungen bearbeiten» und steht unten rechts unter «Weitere Aktionen».
- Detailseite Desktop: erwartet die ganze Tabelle; gesehen die Spalte «Betrag» rechts angeschnitten (siehe Beobachtungen).
- Bearbeiten-Seite Desktop: erwartet die gleiche Tabelle wie auf der Detailseite; gesehen eine Karte pro Position. Alles vollständig, aber sehr lang.
- Bearbeiten-Seite Mobile: erwartet ganze Wörter; gesehen «TV/Kabelanschl» / «uss» (P-1).

## Vorschläge

- **P-1:** Mobile 390 × 844, Nebenkostenabrechnungen → Entwurf NK-22222222-2025-0004 → «Frist und Bemerkungen bearbeiten» → Kostenaufstellung, erste Karte. Hilfreich: Wert in der Karte nur an Leerzeichen oder «/» umbrechen lassen (oder Wert unter die Bezeichnung setzen, wenn er nicht neben sie passt).
- **P-2:** Gleiche Seite, Text unter «Kostenaufstellung». Hilfreich: kürzer und in meinen Worten, z. B. «Diese Beträge berechnet Dwello. Sie lassen sich hier nicht ändern.» und dann ein Link «Zur Abrechnung (Neu berechnen)»; «Tankbestand» nur zeigen, wenn das Gebäude einen Tank hat; statt «Satz» «Satz der Verwaltungspauschale».

## Nicht geprüft

- Speichern von Frist oder Bemerkungen (Auftrag: nur anschauen).
- Andere Entwürfe mit mehr Positionen oder längeren Kategorienamen; nur NK-22222222-2025-0004 angeschaut.
- Zoom (150 %/200 %) und Dunkelmodus: nicht Teil von Annas Profil.

Screenshots und Skripte: /tmp/claude-0/scratch/anna-691/ (05-edit-desktop-full.png, 05-edit-mobile-full.png, 06-detail-desktop-full.png, 07-edit-mobile-card.png).
